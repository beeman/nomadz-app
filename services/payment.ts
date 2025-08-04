import { useConnection } from '@/components/solana/solana-provider'
import { useMobileWallet } from '@/components/solana/use-mobile-wallet'
import { useWalletUi } from '@/components/solana/use-wallet-ui'
import { useBooking } from '@/hooks/booking/booking.hooks'
import { GuestDetails } from '@/types/booking.types'
import {
  createAssociatedTokenAccountIdempotentInstruction,
  createTransferInstruction,
  getAssociatedTokenAddress,
} from '@solana/spl-token'
import { PublicKey, SystemProgram, Transaction, TransactionSignature } from '@solana/web3.js'
import { useCallback } from 'react'

function convertToBigInt(amount: number) {
  // Multiply by 1 million and round to ensure it's an integer
  const multipliedAmount = Math.round(amount * 1_000_000)
  return BigInt(multipliedAmount)
}

export const useCreateCryptoTransaction = () => {
  const { account } = useWalletUi()
  const connection = useConnection()
  const wallet = useMobileWallet()

  return useCallback(
    async (amount: number): Promise<TransactionSignature> => {
      if (!account?.publicKey) {
        throw new Error('Wallet not connected')
      }

      const bigIntAmount = convertToBigInt(amount)

      const tokenMint = new PublicKey(process.env.EXPO_PUBLIC_SOLANA_TOKEN_MINT || '')
      const recipientAddress = new PublicKey(process.env.EXPO_PUBLIC_SOLANA_RECIPIENT_ADDRESS || '')

      // Get or create associated token accounts
      const senderATA = await getAssociatedTokenAddress(tokenMint, account.publicKey)
      const recipientATA = await getAssociatedTokenAddress(tokenMint, recipientAddress)

      // Create instructions
      const createSenderATAIx = await createAssociatedTokenAccountIdempotentInstruction(
        account.publicKey,
        senderATA,
        account.publicKey,
        tokenMint,
      )

      const createRecipientATAIx = await createAssociatedTokenAccountIdempotentInstruction(
        account.publicKey,
        recipientATA,
        recipientAddress,
        tokenMint,
      )

      const transferIx = createTransferInstruction(senderATA, recipientATA, account.publicKey, bigIntAmount)

      // Create and return transaction
      const tx = new Transaction().add(createSenderATAIx, createRecipientATAIx, transferIx)

      const slot = await connection.getSlot()
      const signature = await wallet.signAndSendTransaction(tx, slot)

      console.log('signature', signature)

      return signature
    },
    [account?.publicKey, wallet.signAndSendTransaction, connection],
  )
}

export const useCreateCryptoTransactionSol = () => {
  const connection = useConnection()
  const { account } = useWalletUi()
  const wallet = useMobileWallet()

  return useCallback(
    async (amount: number): Promise<TransactionSignature> => {
      if (!account?.publicKey) {
        throw new Error('Wallet not connected')
      }

      const bigIntAmount = convertToBigInt(amount)

      const recipientAddress = new PublicKey(process.env.EXPO_PUBLIC_SOLANA_RECIPIENT_ADDRESS || '')

      const transferIx = SystemProgram.transfer({
        fromPubkey: account.publicKey,
        toPubkey: recipientAddress,
        lamports: bigIntAmount,
      })

      // Create and return transaction
      const tx = new Transaction().add(transferIx)

      const slot = await connection.getSlot()
      const signature = await wallet.signAndSendTransaction(tx, slot)

      console.log('signature', signature)

      return signature
    },
    [account?.publicKey, wallet.signAndSendTransaction, connection],
  )
}

interface ProcessBookingParams {
  bookHash: string
  guests: {
    adults: number
    children: number[]
    guestsDetails?: GuestDetails[]
  }
  hid: string
  onPayment: () => Promise<{ signature: TransactionSignature; total: number }>
}

export const useProcessBooking = () => {
  const { preBook, initializeBooking, finishBooking } = useBooking()

  return useCallback(
    async ({ bookHash, guests, hid, onPayment }: ProcessBookingParams) => {
      try {
        // Step 3: Pre-book with hash
        const preBookResponse = await preBook(bookHash)

        // Step 4: Check price changes
        let finalHash = bookHash
        if (preBookResponse?.changes?.price_changed) {
          const foundRate = preBookResponse?.rates?.find((rate: any) => rate.payment_options?.payment_types?.[0])

          finalHash = foundRate?.book_hash

          if (!finalHash) {
            throw new Error('Sorry, looks like this room is no longer available.')
          }
        }

        // Step 5: Initialize booking
        const initResponse = await initializeBooking({
          hid: Number(hid),
          hash: finalHash,
        })

        // Get deposit payment type
        const depositPaymentType = initResponse.payment_types.find((pt: any) => pt.type === 'deposit')

        if (!depositPaymentType) {
          throw new Error('No deposit payment type available')
        }

        // Step 6: Process payment
        const payment = await onPayment()

        // Step 7: Finish booking
        await finishBooking({
          orderId: initResponse.partner_order_id,
          upsellData: [],
          payment: (payment as any).signature
            ? { transactionSignature: (payment as any).signature, amount: (payment as any).total }
            : payment,
          paymentType: depositPaymentType,
          guests,
        })

        return initResponse.partner_order_id
      } catch (error) {
        console.error(error)
        throw error
      }
    },
    [preBook, initializeBooking, finishBooking],
  )
}

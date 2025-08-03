import { FC, useEffect, useMemo, useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useProcessBooking, useCreateCryptoTransaction } from '../../services/payment';
import toastNotifications from '../../utils/toastNotifications.utils';
import { useApartments } from '../../hooks';
import { LoadingIcon } from '../icons/Icons';
import '@dialectlabs/blinks/index.css';
import { Blink, useBlink } from '@dialectlabs/blinks';
import { useBlinkSolanaWalletAdapter } from '@dialectlabs/blinks/hooks/solana';
import { useParams } from 'react-router-dom';
// import { createJupiterApiClient } from '@jup-ag/api';

interface PaymentWalletElementProps {
  total: number;
  guests: {
    adults: number;
    children: number[];
  };
  bookHash: string;
  onSuccess?: () => void;
}

export const PaymentWalletElement: FC<PaymentWalletElementProps> = ({
  total,
  guests,
  bookHash,
  onSuccess,
}) => {
  // const { publicKey, sendTransaction } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const { selectedApartment } = useApartments();
  const processBooking = useProcessBooking();
  const [amountInSol, setAmountInSol] = useState<number | null>(null);
  const { id } = useParams<{ id: string }>();
  const createCryptoTransaction = useCreateCryptoTransaction();

  const { adapter } = useBlinkSolanaWalletAdapter(import.meta.env.VITE_SOLANA_RPC_PROVIDER_URL);
  const { blink, isLoading: isBlinkLoading } = useBlink({
    url: `http://localhost/api/v1/solana/actions/pay-usdc?amount=${total}&apartmentId=${id}`,
  });

  // const jupiter = useMemo(() => createJupiterApiClient(), []);
  // const connection = useMemo(
  //   () => new Connection(import.meta.env.VITE_SOLANA_RPC_PROVIDER_URL),
  //   [],
  // );

  // useEffect(() => {
  //   const intervalCallback = async () => {
  //     const { outAmount } = await jupiter.quoteGet({
  //       amount: Number(total.toFixed(6)) * 1_000_000,
  //       inputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  //       outputMint: 'So11111111111111111111111111111111111111112',
  //       autoSlippage: true,
  //       swapMode: 'ExactIn',
  //     });

  //     setAmountInSol(Number(outAmount));
  //   };

  //   intervalCallback();
  //   const interval = setInterval(intervalCallback, 5000);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [jupiter]);

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      await processBooking({
        bookHash,
        guests,
        hid: selectedApartment.hid,
        onPayment: async () => ({ signature: await createCryptoTransaction(total), total }),
      });
      onSuccess?.();
      toastNotifications.success('Booking successful');
    } catch (error: any) {
      toastNotifications.error(error.message || 'Booking failed');
      console.error('Booking error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // const handlePaymentInSol = async () => {
  //   try {
  //     setIsLoading(true);
  //     await processBooking({
  //       bookHash,
  //       guests,
  //       hid: selectedApartment.hid,
  //       onPayment: async () => {
  //         if (!publicKey) {
  //           throw new Error('Wallet not connected');
  //         }

  //         const quoteResponse = await jupiter.quoteGet({
  //           amount: Number(total.toFixed(6)) * 1_000_000,
  //           inputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  //           outputMint: 'So11111111111111111111111111111111111111112',
  //           autoSlippage: true,
  //           swapMode: 'ExactOut',
  //         });

  //         const bigIntAmount = BigInt(quoteResponse.outAmount);
  //         const recipientAddress = new PublicKey(import.meta.env.VITE_SOLANA_RECIPIENT_ADDRESS);

  //         const transferIx = SystemProgram.transfer({
  //           fromPubkey: publicKey,
  //           toPubkey: recipientAddress,
  //           lamports: bigIntAmount,
  //         });

  //         const {
  //           tokenLedgerInstruction,
  //           computeBudgetInstructions,
  //           setupInstructions,
  //           swapInstruction: swapInstructionPayload,
  //           cleanupInstruction,
  //           addressLookupTableAddresses,
  //         } = await jupiter.swapInstructionsPost({
  //           swapRequest: {
  //             userPublicKey: recipientAddress.toBase58(),
  //             payer: publicKey.toBase58(),
  //             wrapAndUnwrapSol: true,
  //             quoteResponse,
  //           },
  //         });

  //         const deserializeInstruction = (instruction: any) => {
  //           return new TransactionInstruction({
  //             programId: new PublicKey(instruction.programId),
  //             keys: instruction.accounts.map((key: any) => ({
  //               pubkey: new PublicKey(key.pubkey),
  //               isSigner: key.isSigner,
  //               isWritable: key.isWritable,
  //             })),
  //             data: Buffer.from(instruction.data, 'base64'),
  //           });
  //         };

  //         const getAddressLookupTableAccounts = async (
  //           keys: string[],
  //         ): Promise<AddressLookupTableAccount[]> => {
  //           const addressLookupTableAccountInfos = await connection.getMultipleAccountsInfo(
  //             keys.map(key => new PublicKey(key)),
  //           );

  //           return addressLookupTableAccountInfos.reduce((acc, accountInfo, index) => {
  //             const addressLookupTableAddress = keys[index];
  //             if (accountInfo) {
  //               const addressLookupTableAccount = new AddressLookupTableAccount({
  //                 key: new PublicKey(addressLookupTableAddress),
  //                 state: AddressLookupTableAccount.deserialize(accountInfo.data),
  //               });
  //               acc.push(addressLookupTableAccount);
  //             }

  //             return acc;
  //           }, new Array<AddressLookupTableAccount>());
  //         };

  //         const addressLookupTableAccounts: AddressLookupTableAccount[] = [];

  //         addressLookupTableAccounts.push(
  //           ...(await getAddressLookupTableAccounts(addressLookupTableAddresses)),
  //         );

  //         const blockhash = (await connection.getLatestBlockhash()).blockhash;

  //         const messageV0 = new TransactionMessage({
  //           payerKey: publicKey,
  //           recentBlockhash: blockhash,
  //           instructions: [
  //             transferIx,
  //             ...(tokenLedgerInstruction ? [deserializeInstruction(tokenLedgerInstruction)] : []),
  //             ...computeBudgetInstructions.map(deserializeInstruction),
  //             ...setupInstructions.map(deserializeInstruction),
  //             ...(swapInstructionPayload ? [deserializeInstruction(swapInstructionPayload)] : []),
  //             ...(cleanupInstruction ? [deserializeInstruction(cleanupInstruction)] : []),
  //           ],
  //         }).compileToV0Message(addressLookupTableAccounts);

  //         const tx = new VersionedTransaction(messageV0);

  //         const signature = await sendTransaction(tx, connection);

  //         console.log('signature: ', signature);

  //         return signature;
  //       },
  //     });
  //     onSuccess?.();
  //     toastNotifications.success('Booking successful');
  //   } catch (error: any) {
  //     toastNotifications.error(error.message || 'Booking failed');
  //     console.error('Booking error:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div className='space-y-6'>
      {/* Connect Wallet Section */}
      <div className='space-y-4'>
        <p className='text-sm text-gray-400'>Connect your wallet to proceed with the payment</p>
        <WalletMultiButton />
      </div>

      {/* Payment Buttons */}
      <div className='flex flex-col gap-3'>
        <button
          // onClick={handlePayment}
          disabled={isLoading}
          className='w-full py-3 text-sm font-bold text-white rounded-lg bg-gradient-to-r from-[#FF3D00] to-[#FF9900] disabled:opacity-50'
        >
          {isLoading ? (
            <div className='flex items-center justify-center'>
              <LoadingIcon className='size-6 animate-spin' />
            </div>
          ) : (
            `Pay ${total.toFixed(2)} USDC`
          )}
          {!isBlinkLoading && blink && (
            <Blink
              blink={blink}
              adapter={adapter}
              securityLevel='all'
              callbacks={{ onActionComplete: () => {}, onActionError: () => {} }}
            />
          )}
        </button>
        {/* <button
          onClick={handlePayment}
          disabled={!publicKey || isLoading}
          className='w-full py-3 text-sm font-bold text-white rounded-lg bg-gradient-to-r from-[#FF3D00] to-[#FF9900] disabled:opacity-50'
        >
          {isLoading ? (
            <div className='flex items-center justify-center'>
              <LoadingIcon className='size-6 animate-spin' />
            </div>
          ) : (
            `Pay ${total.toFixed(2)} USDC`
          )}
        </button>

        <button
          onClick={handlePaymentInSol}
          disabled={!publicKey || isLoading}
          className='w-full py-3 text-sm font-bold text-white rounded-lg bg-gradient-to-r from-[#FF3D00] to-[#FF9900] disabled:opacity-50'
        >
          {isLoading || !amountInSol ? (
            <div className='flex items-center justify-center'>
              <LoadingIcon className='size-6 animate-spin' />
            </div>
          ) : (
            <span className='inline-flex items-center gap-2'>
              Pay {parseFloat((amountInSol / LAMPORTS_PER_SOL).toFixed(9))} SOL
              <CountdownSpinner
                className='size-6 text-xs text-white'
                strokeWidth={10}
                showSecondsLeftLabel
                interval={5000}
                stroke='white'
              />
            </span>
          )}
        </button> */}
      </div>
    </div>
  );
};

import { useAuth } from '@/components/auth/auth-provider'
import { LoadingIcon } from '@/components/icons/Icons'
import { useMobileWallet } from '@/components/solana/use-mobile-wallet'
import { useWalletUi } from '@/components/solana/use-wallet-ui'
import WhiteButton from '@/components/ui/Buttons/WhiteButton'
import Spinner from '@/components/ui/Spinner'
import { useProcessBooking } from '@/services/payment'
import { api } from '@/utils/api'
import { calculateCommission, getNightlyPriceWithCommission } from '@/utils/rate.utils'
import toastNotifications from '@/utils/toastNotifications.utils'
import { useRoute } from '@react-navigation/native'
import { Cluster, clusterApiUrl, VersionedTransaction } from '@solana/web3.js'
import bs58 from 'bs58'
import React, { FC, useEffect, useState } from 'react'
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native'

const logoNomadz = require('@/assets/pngs/icons/logo-white.png')

const CryptoPayment: FC<any> = ({
  property,
  nights,
  subtotal,
  fee,
  total,
  guests,
  bookHash,
  currencyCode,
  dates,
  beddingType,
  onSuccess,
  onCancel,
  selectedRate,
}) => {
  const { connectWallet, disconnectWallet } = useAuth()
  const { account } = useWalletUi()
  const wallet = useMobileWallet()
  const [isLoading, setIsLoading] = useState(false)
  const [blinkDetails, setBlinkDetails] = useState<any>({})
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [isBlinkLoading, setIsBlinkLoading] = useState(true)
  const route = useRoute<any>()
  const { id } = route.params
  const processBooking = useProcessBooking()

  const guestsNumber = (guests?.adults || 0) + (guests?.children?.length || 0)
  const commissionAmount = calculateCommission(subtotal)
  const subtotalWithCommission = subtotal + commissionAmount
  const totalWithCommission = subtotalWithCommission + fee

  useEffect(() => {
    disconnectWallet()
  }, [])

  useEffect(() => {
    if (isPageLoading) {
      setIsPageLoading(false)
      return
    }

    const request = async () => {
      await api.options(`/solana/actions/pay-usdc?hash=${bookHash}&price_increase_percent=20`, {
        withCredentials: false,
      })
      const { data } = await api.get(`/solana/actions/pay-usdc?hash=${bookHash}&price_increase_percent=20`, {
        withCredentials: false,
      })
      setBlinkDetails(data)
      setIsBlinkLoading(false)
    }

    request().catch(console.error)
  }, [isPageLoading])

  const handleBookNow = async () => {
    if (!account?.publicKey) {
      toastNotifications.error('The wallet is not connected to proceed the action')
      return
    }
    try {
      setIsLoading(true)
      await processBooking({
        bookHash,
        guests,
        hid: id,
        onPayment: async () => {
          const response = await api.post(
            blinkDetails.links.actions[0].href.replace('api/v1/', ''),
            { account: account.publicKey.toBase58() },
            {
              withCredentials: false,
              headers: {
                'x-blockchain-ids': clusterApiUrl((process.env.EXPO_PUBLIC_SOLANA_NETWORK as Cluster) || 'devnet'),
                'x-action-version': '2.4',
              },
            },
          )
          console.log(`BLINK DETAILS ${JSON.stringify(response)}`)
          const { transaction } = response.data
          const versionedTransaction = VersionedTransaction.deserialize(Buffer.from(transaction, 'base64'))
          const signedTransaction = await wallet.signTransaction?.(versionedTransaction)
          const signedSerializedTransaction = Buffer.from(signedTransaction.serialize()).toString('base64')
          const userSignature = signedTransaction.signatures[0]
          const approveResponse = await api.post('solana/actions/pay-usdc/approve', {
            payer: account.publicKey.toBase58(),
            signedSerializedTransaction,
            signature: bs58.encode(userSignature),
          })
          if (approveResponse.status !== 201) throw new Error('Failed to process the payment')
          return { signature: approveResponse.data.signature, total }
        },
      })
      onSuccess?.()
      toastNotifications.success('Booking successful')
    } catch (error) {
      toastNotifications.error('Error occurred.')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isBlinkLoading) {
    return (
      <View className="flex min-h-[500px] flex-col items-center justify-center bg-[#151515] rounded-xl">
        <Spinner duration={500}>
          <LoadingIcon width={24} height={24} color="white" />
        </Spinner>
      </View>
    )
  }

  return (
    <View className="flex flex-col bg-[#151515] rounded-xl">
      <TouchableOpacity onPress={onCancel} style={{ position: 'absolute', top: 20, right: 20, zIndex: 1 }}>
        <Text
          style={{
            color: '#CA5555',
            backgroundColor: '#15151580',
            borderRadius: 50,
            paddingVertical: 5,
            paddingHorizontal: 15,
          }}
        >
          cancel
        </Text>
      </TouchableOpacity>

      <Image
        source={{ uri: blinkDetails.icon || property.images?.[0]?.url?.replace('{size}', '640x640') }}
        style={{ width: '100%', height: 236, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
        resizeMode="cover"
      />

      <View style={{ padding: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <View
            style={{
              width: 16,
              height: 16,
              backgroundColor: '#000',
              borderRadius: 4,
              justifyContent: 'center',
              alignItems: 'center',
              borderColor: '#4B4B4B',
              borderWidth: 0.33,
            }}
          >
            <Image source={logoNomadz} style={{ height: 10, resizeMode: 'contain' }} />
          </View>
          <Text style={{ color: '#999', fontSize: 11, marginLeft: 6 }}>Nomadz</Text>
        </View>

        <Text style={{ color: 'white', fontSize: 20, fontWeight: '600', marginBottom: 8 }}>{property.name}</Text>
        <Text style={{ color: 'white', fontSize: 12, marginBottom: 24 }}>
          {dates?.split('/').join('.')} {dates && beddingType ? '|' : ''} {beddingType}{' '}
          {guestsNumber ? `, ${guestsNumber} guest${guestsNumber > 1 ? 's' : ''}` : ''}
        </Text>

        <View style={{ backgroundColor: '#242424', borderRadius: 12, padding: 16, marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ color: '#9D9D9D', fontSize: 12 }}>price per night</Text>
            <Text style={{ color: '#D0D0D0', fontSize: 12 }}>
              {getNightlyPriceWithCommission(selectedRate || property).toFixed(2)} {currencyCode}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ color: '#9D9D9D', fontSize: 12 }}>taxes</Text>
            <Text style={{ color: '#D0D0D0', fontSize: 12 }}>
              {fee.toFixed(2)} {currencyCode}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
            <Text style={{ color: 'white', fontSize: 12 }}>total price</Text>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              {totalWithCommission.toFixed(2)} {currencyCode}
            </Text>
          </View>
        </View>

        <WhiteButton
          size="lg"
          className="bg-white"
          onClick={() => {
            if (account?.publicKey) {
              return handleBookNow()
            }

            return connectWallet()
          }}
          disabled={isLoading}
        >
          <Text className="text-black">
            {isLoading ? <ActivityIndicator color="black" /> : account?.publicKey ? 'book now' : 'connect wallet'}
          </Text>
        </WhiteButton>
      </View>
    </View>
  )
}

export default CryptoPayment

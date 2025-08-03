import { LoadingIcon } from '@/components/icons/Icons'
import { Blink, useBlink } from '@dialectlabs/blinks'
import { useBlinkSolanaWalletAdapter } from '@dialectlabs/blinks/hooks/solana'
import '@dialectlabs/blinks/index.css'
import { useRoute } from '@react-navigation/native'
import { FC } from 'react'
import { Text, View } from 'react-native'

interface BlinkPaymentProps {
  property: any
  nights: number
  subtotal: number
  fee: number
  total: number
  guests: {
    adults: number
    children: number[]
  }
  bookHash: string
  currencyCode: string
  dates?: string
  beddingType?: string
  onSuccess?: () => void
}

const BlinkPayment: FC<BlinkPaymentProps> = ({ total }) => {
  const route = useRoute<any>()
  const { id } = route.params.id
  const { adapter } = useBlinkSolanaWalletAdapter(process.env.EXPO_PUBLIC_SOLANA_RPC_PROVIDER_URL || '')
  const { blink, isLoading: isBlinkLoading } = useBlink({
    url: `http://localhost/api/v1/solana/actions/pay-usdc?amount=${total}&apartmentId=${id}`,
  })
  return (
    <>
      {isBlinkLoading ? (
        <View className="w-[400px] max-[400px]:w-[90%] flex flex-col items-center justify-center rounded-2xl shadow-lg bg-[#121212] py-12">
          <LoadingIcon className="animate-spin" width={48} height={48} color="white" />
          <Text className="mt-4 text-lg text-white">Loading payment widget...</Text>
        </View>
      ) : blink ? (
        <View className="w-[400px]">
          <Blink
            stylePreset="x-dark"
            blink={blink}
            adapter={adapter}
            securityLevel="all"
            callbacks={{ onActionComplete: () => {}, onActionError: () => {} }}
          />
        </View>
      ) : null}
    </>
  )
}

export default BlinkPayment

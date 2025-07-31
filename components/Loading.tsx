import { LoadingIcon } from '@/components/icons/Icons'
import { FC } from 'react'
import { View } from 'react-native'

const Loading: FC = () => {
  return (
    <View className="fixed inset-0 flex items-center justify-center">
      <View className="flex flex-col items-center gap-2">
        <LoadingIcon className="animate-spin size-12" />
      </View>
    </View>
  )
}

export default Loading

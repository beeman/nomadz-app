import { ShareIcon } from '@/components/icons/Icons'
import Modal from '@/components/ui/Modal'
import { SHARING_OPTIONS } from '@/constants/sharingOptions'
import { copyToClipboard } from '@/utils/app.utils'
import { FC, useState } from 'react'
import { Linking, Text, View } from 'react-native'

interface ShareButtonProps {
  url: string
  options?: Array<keyof typeof SHARING_OPTIONS>
  className?: string
}

const ShareButton: FC<ShareButtonProps> = ({
  url,
  options = Object.keys(SHARING_OPTIONS) as Array<keyof typeof SHARING_OPTIONS>,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <View onTouchStart={() => setIsOpen(true)} className={`flex flex-row items-center gap-x-2 ${className}`}>
        <ShareIcon width={20} height={20} color="#D9D9D9" />
      </View>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="border border-[#252525] rounded-xl bg-black p-6 h-fit w-full max-w-[90%]"
      >
        <View className="flex flex-col gap-y-4">
          <View className="flex flex-row items-center justify-between gap-x-5 px-4 py-2 bg-[#252525] rounded-xl">
            <Text className="overflow-auto text-sm text-white font-primary-semibold no-scrollbar text-nowrap">
              {url}
            </Text>
            <View
              onTouchStart={() => copyToClipboard(url, 'Link copied to clipboard.')}
              className="px-4 py-1.5 text-black bg-white rounded-full"
            >
              <Text className="font-primary pb-0.5">copy</Text>
            </View>
          </View>
          {options?.map((option: keyof typeof SHARING_OPTIONS) => {
            const item = SHARING_OPTIONS[option]

            return (
              <View
                key={option}
                onTouchStart={async () => {
                  const externalUrl = `${item.url}${encodeURIComponent(url)}`
                  const supported = await Linking.canOpenURL(externalUrl)

                  if (supported) {
                    await Linking.openURL(externalUrl)
                  }
                }}
                className="flex flex-col items-center justify-center gap-y-2"
              >
                <item.icon color="white" width={20} height={20} />
                {/* <Text>{option}</Text> */}
              </View>
            )
          })}
        </View>
      </Modal>
    </>
  )
}

export default ShareButton

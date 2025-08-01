import { Text, View } from 'react-native'
// import sanitizeHtml from 'sanitize-html'

interface HouseRules {
  checkIn: string
  checkOut: string
}

interface ImportantInformationSectionProps {
  property: any // Update type when available
}

function renderPolicyParagraphs(paragraphs: string[]) {
  const formatRichText = (text: string): string => {
    return text
      .replace(/\*\*\*(.*?)\*\*\*/g, '<b><i>$1</i></b>') // bold italic
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // bold
      .replace(/\*(.*?)\*/g, '<i>$1</i>') // italic
  }

  return paragraphs.map((paragraph, index) => {
    const isHtml = paragraph.includes('<') && paragraph.includes('>')
    const htmlContent = isHtml ? paragraph : formatRichText(paragraph)

    return (
      <Text
        key={index}
        className="text-[#A9A9A9] text-sm font-primary-light [&_b]:font-primary-bold [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-1"
      >
        {htmlContent}
      </Text>
    )
  })
}

export default function ImportantInformationSection({ property }: ImportantInformationSectionProps) {
  const houseRules = {
    checkIn: property.checkInTime?.slice(0, 5) || '',
    checkOut: property.checkOutTime?.slice(0, 5) || '',
  } as HouseRules

  return (
    <View className="flex flex-col space-y-8">
      <Text className="text-2xl text-left text-white mb-6 font-primary-medium">important information</Text>
      <View className="border border-[#313131] rounded-xl bg-[#151515] px-6 py-8 gap-y-8">
        {/* House Rules */}
        <View>
          <Text className="mb-4 text-xl/[26px] font-primary-medium text-white">House Rules</Text>
          <View className="text-[#A9A9A9] text-sm font-primary-light">
            {houseRules.checkIn && (
              <Text className="text-[#A9A9A9] text-sm font-primary-light">Check-in: {houseRules.checkIn}</Text>
            )}
            {houseRules.checkOut && (
              <Text className="text-[#A9A9A9] text-sm font-primary-light">Check-out: {houseRules.checkOut}</Text>
            )}
          </View>
        </View>

        {/* Policies */}
        {property.policyStruct?.map((policy: { title: string; paragraphs: string[] }, index: number) => (
          <View key={index}>
            <Text className="mb-4 text-xl/[26px] font-primary-medium text-white">{policy.title}</Text>
            <View className="text-[#A9A9A9] text-sm font-light [&_b]:font-primary-bold [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-1">
              {renderPolicyParagraphs(policy.paragraphs)}
            </View>
          </View>
        ))}

        {/* Report Link */}
        {/* <View>
          <button className="text-[#FFC7C7] hover:underline text-xs">
            Report this listing
          </button>
        </View> */}
      </View>
    </View>
  )
}

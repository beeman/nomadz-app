import { Text, View, useWindowDimensions } from 'react-native'
import RenderHtml from 'react-native-render-html'

interface HouseRules {
  checkIn: string
  checkOut: string
}

interface ImportantInformationSectionProps {
  property: any // Update type when available
}

function renderPolicyParagraphs(paragraphs: string[], contentWidth: number) {
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
      <View key={index} style={{ marginBottom: 8 }}>
        <RenderHtml
          contentWidth={contentWidth}
          source={{ html: htmlContent }}
          baseStyle={{
            color: '#A9A9A9',
            fontSize: 14,
            fontFamily: 'System',
          }}
          tagsStyles={{ b: { fontWeight: 'bold' }, i: { fontStyle: 'italic' }, ul: { marginLeft: 16 }, li: { marginBottom: 4 },
          }}
        />
      </View>
    )
  })
}

export default function ImportantInformationSection({ property }: ImportantInformationSectionProps) {
  const { width } = useWindowDimensions()
  
  const houseRules = {
    checkIn: property.checkInTime?.slice(0, 5) || '',
    checkOut: property.checkOutTime?.slice(0, 5) || '',
  } as HouseRules

  return (
    <View className="flex flex-col gap-y-8">
      <Text className="text-2xl text-left text-white font-primary-medium mt-4">important information</Text>
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
              {renderPolicyParagraphs(policy.paragraphs, width - 48)}
            </View>
          </View>
        ))}

        {/* Report Link */}
        {/* <View>
          <Button className="text-[#FFC7C7] hover:underline text-xs">
            Report this listing
          </Button>
        </View> */}
      </View>
    </View>
  )
}

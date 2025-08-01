import 'pure-react-carousel/dist/react-carousel.es.css'
import { ApartmentsItemInfo } from '../../types/booking.types'
import StayCard from './StayCard'

interface StaysListProps {
  stays: ApartmentsItemInfo[]
  onLoadMore: () => void
  hasMore: boolean
  isLoading?: boolean
}

export default function StaysList({ stays, onLoadMore, hasMore, isLoading }: StaysListProps) {
  return (
    <View className="flex flex-col flex-1 overflow-hidden">
      <View className="flex-1 px-2 overflow-y-auto sm:px-6">
        <View className="grid grid-cols-1 gap-6 min-[500px]:grid-cols-2 xl:grid-cols-3">
          {stays.map((stay, index) => (
            <StayCard key={`${stay.id}-${index}`} stay={stay} />
          ))}
        </View>

        {hasMore && (
          <View className="flex justify-center mt-8 mb-4">
            <Button
              onClick={onLoadMore}
              disabled={isLoading}
              className="px-6 py-2 text-white transition-colors rounded-lg bg-[#292929] hover:bg-[#363636] disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'See More'}
            </Button>
          </View>
        )}
      </View>
    </View>
  )
}

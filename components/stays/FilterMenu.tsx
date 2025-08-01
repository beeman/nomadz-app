import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams as useRouterSearchParams } from 'react-router-dom'
import { SORT_OPTIONS } from '../../constants/booking.constants'
import { RoutePaths } from '../../enums/RoutePaths'
import { useEvents, useSearchParams } from '../../hooks'
import { bookingsService } from '../../services/bookings'
import { GetApartmentsSort, PropertyCategory } from '../../types/booking.types'
import { parseQueryParams, resolveUrl } from '../../utils/app.utils'
import { ArrowsUpDownIcon, ListIcon, MapIcon } from '../icons/Icons'
import { PriceRange } from '../ui'
import EventCard from './EventCard'

export default function FilterMenu({ priceDistribution }: { priceDistribution: Record<number, number> }) {
  const { filterParams, updateFilterParams, getCombinedParams } = useSearchParams()
  const { selectedEvent } = useEvents()

  const [isSortOpen, setIsSortOpen] = useState(false)
  const [parsedParams, setParsedParams] = useState<any>(null)
  const [propertyCategories, setPropertyCategories] = useState<PropertyCategory[]>([])
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPropertyTypes = async () => {
      try {
        const categories = await bookingsService.getPropertyTypes()
        setPropertyCategories(categories)
      } catch (error) {
        console.error('Failed to fetch property types:', error)
      }
    }

    fetchPropertyTypes()
  }, [])

  const togglePropertyType = (type: string) => {
    if (type === 'all') {
      const allCategoryNames = propertyCategories.map((cat) => cat.name)
      const areAllSelected = allCategoryNames.every((name) => filterParams.categories?.includes(name))

      updateFilterParams({
        categories: areAllSelected ? [] : allCategoryNames,
      })
    } else {
      updateFilterParams({
        categories: filterParams.categories?.includes(type)
          ? filterParams.categories.filter((t) => t !== type)
          : [...(filterParams.categories || []), type],
      })
    }
  }

  const handlePriceRangeChange = (range: { min: number; max: number | null }) => {
    updateFilterParams({
      minPrice: range.min,
      maxPrice: range.max,
    })
  }

  const searchParams = new URLSearchParams(location.search)
  const isMapOpen = searchParams.get('map_open') === 'true'

  const setSortOption = (option: GetApartmentsSort) => {
    updateFilterParams({
      sort: option,
    })
    setIsSortOpen(false)
  }

  const toggleMapView = () => {
    if (isMapOpen) {
      searchParams.delete('map_open')
    } else {
      searchParams.set('map_open', 'true')
    }
    navigate({ search: searchParams.toString() })
  }

  const [routerSearchParams] = useRouterSearchParams()
  const handleApply = () => {
    const parsedParams = parseQueryParams(routerSearchParams.toString())

    // Navigate to stays page with search params
    const searchUrl = resolveUrl(RoutePaths.STAYS, {
      ...parsedParams, // Preserve existing params
      ...getCombinedParams(),
      categories: filterParams.categories,
      sort: filterParams.sort,
      minPrice: filterParams.minPrice,
      maxPrice: filterParams.maxPrice,
    })

    navigate(searchUrl)
  }

  useEffect(() => {
    setParsedParams(parseQueryParams(routerSearchParams.toString()))
  }, [routerSearchParams])

  return (
    <View className="overflow-y-auto no-scrollbar overflow-x-hidden !w-[21vw] min-w-60 bg-[#151515] rounded-2xl p-6 border border-[#292929]">
      {/* Event card */}
      {selectedEvent && selectedEvent.id === parsedParams?.event && (
        <EventCard event={selectedEvent} className="mb-4" />
      )}

      {/* Property Type */}
      {propertyCategories.length > 0 && (
        <View className="border-b border-[#292929] pb-6">
          <Text className="mb-4 text-xs text-white">property type</Text>
          <View className="flex flex-wrap gap-1">
            <Button
              onClick={() => {
                // Clear all selected categories from the filter parameters
                updateFilterParams({
                  categories: [],
                })
              }}
              className={`
                px-4 py-1.5 rounded-full text-white text-xs border border-[#ffffff80]
                ${filterParams.categories?.length === 0 ? 'bg-[#FFFFFF1F]' : 'bg-[#1B1B1B]'}
              `}
            >
              all
            </Button>
            {propertyCategories.map((category) => (
              <Button
                key={category.name}
                onClick={() => togglePropertyType(category.name)}
                className={`
                  px-4 py-1.5 rounded-full text-white text-xs border border-[#ffffff80]
                  ${filterParams.categories?.includes(category.name) ? 'bg-[#FFFFFF1F]' : 'bg-[#1B1B1B]'}
                `}
              >
                {category.name.replace(/_/g, ' ').toLowerCase()}
              </Button>
            ))}
          </View>
        </View>
      )}

      {/* Price Range */}
      <View className="pt-10 pb-6 text-xs border-b border-[#292929]">
        <Text className="mb-4 text-white">price range</Text>
        <PriceRange
          distribution={priceDistribution}
          onChange={handlePriceRangeChange}
          initialRange={{
            min: filterParams.minPrice,
            max: filterParams.maxPrice,
          }}
        />
      </View>

      {/* Free Cancellation Toggle */}
      <View className="pt-6 pb-6 text-xs border-b border-[#292929]">
        <View className="flex items-center justify-between">
          <Text className="text-white">free cancellation</Text>
          <Button
            onClick={() => updateFilterParams({ hasFreeCancellation: !filterParams.hasFreeCancellation })}
            className={`
              w-12 h-6 rounded-full transition-colors duration-200
              ${filterParams.hasFreeCancellation ? 'bg-white' : 'bg-[#292929]'}
            `}
          >
            <View
              className={`
                w-5 h-5 rounded-full bg-black transition-transform duration-200
                ${filterParams.hasFreeCancellation ? 'translate-x-6' : 'translate-x-1'}
              `}
            />
          </Button>
        </View>
      </View>

      {/* Apply Button */}
      <Button className="w-full py-2 mt-4 font-semibold text-black bg-white rounded-full" onClick={() => handleApply()}>
        apply
      </Button>

      {/* Map/List Toggle Button */}
      <View className="w-full pt-6">
        <Button
          onClick={toggleMapView}
          className="bg-[#D9D9D90D] rounded-full text-white text-xs font-medium flex justify-between w-full"
        >
          <Text className="mx-6 my-auto">{isMapOpen ? 'show list' : 'explore on map'}</Text>
          <Text className="bg-[#D9D9D912] rounded-full p-3">
            {isMapOpen ? <ListIcon className="w-5 h-5" /> : <MapIcon className="w-5 h-5" />}
          </Text>
        </Button>
      </View>

      {/* Sort Dropdown */}
      <View className="mt-6">
        <View className="relative">
          <Button
            className="w-full flex items-center py-2 px-4 bg-[#1B1B1B] rounded-full border border-[#ffffff80] text-xs text-white"
            onClick={() => setIsSortOpen(!isSortOpen)}
          >
            <View className="w-full flex items-center justify-center space-x-1.5">
              <ArrowsUpDownIcon />
              <Text>sort by: {SORT_OPTIONS[filterParams.sort ?? GetApartmentsSort.MostRelevant]}</Text>
            </View>
          </Button>

          {/* Dropdown Menu */}
          {isSortOpen && (
            <View className="absolute z-50 w-full bottom-full mb-2 bg-[#1B1B1B] border border-[#292929] rounded-xl py-2 shadow-lg">
              {Object.entries(SORT_OPTIONS).map(([key, label]) => (
                <Button
                  key={key}
                  className={`
                    w-full px-4 py-2 text-left text-xs hover:bg-[#292929] transition-colors
                    ${filterParams.sort === key ? 'text-white bg-[#292929]' : 'text-[#A9A9A9]'}
                  `}
                  onClick={() => setSortOption(key as GetApartmentsSort)}
                >
                  {label}
                </Button>
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

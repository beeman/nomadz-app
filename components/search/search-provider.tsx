import React, { ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/utils/api'

export interface ResultRegion {
  countryName: string
  center: {
    longitude: number
    latitude: number
  }
  type: string
  name: string
}

export interface Result {
  region: ResultRegion
  id: string
  hid: number
  name: string
  category: string
  address: string
  latitude: number
  longitude: number
  hotelChain: string
  images: { url: string; categorySlug: string }[]
  rating: number
  reviewsNumber: number
}

export interface SearchProviderContext {
  random?: Result[]
}

const SearchContext = React.createContext<SearchProviderContext>({} as SearchProviderContext)

function useSearchRandomProperties() {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  const dayAfterTomorrow = new Date()
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)

  return useQuery({
    queryKey: ['searchRandomProperties'],
    queryFn: () => api.get('/bookings/random/apartments').then((res) => res.data),
  })
}

export function SearchProvider(props: { children: ReactNode }) {
  const { children } = props
  const randomQuery = useSearchRandomProperties()
  const value = {
    random: (randomQuery.data ?? []) as Result[],
  }
  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
}

export function useSearch() {
  return React.useContext(SearchContext)
}

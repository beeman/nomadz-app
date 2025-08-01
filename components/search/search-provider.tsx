import { api } from '@/utils/api'
import { useMutation, useQuery } from '@tanstack/react-query'
import React, { ReactNode, useCallback, useState } from 'react'

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

export interface SearchFilters {
  categories: string[]
  sort: 'most_relevant' | 'price_lowest' | 'price_highest' | 'distance' | 'best_reviews'
  minPrice: number
  maxPrice: number
  hasFreeCancellation: boolean
}

export interface SearchParams {
  regionId?: number
  checkin?: string
  checkout?: string
  guests: {
    adults: number
    children: number[]
  }
  sort?: string
  limit?: number
  page?: number
  minPrice?: number
  maxPrice?: number
  hasFreeCancellation?: boolean
  categories?: string[]
}

export interface SearchProviderContext {
  random?: Result[]
  searchResults?: Result[]
  isSearchModalOpen: boolean
  openSearchModal: () => void
  closeSearchModal: () => void
  filters: SearchFilters
  updateFilters: (filters: Partial<SearchFilters>) => void
  searchParams: SearchParams
  updateSearchParams: (params: Partial<SearchParams>) => void
  performSearch: () => void
  clearSearch: () => void
  isLoading: boolean
  searchError?: string
}

const SearchContext = React.createContext<SearchProviderContext>({} as SearchProviderContext)

const defaultFilters: SearchFilters = {
  categories: [],
  sort: 'most_relevant',
  minPrice: 0,
  maxPrice: 0,
  hasFreeCancellation: false,
}

const defaultSearchParams: SearchParams = {
  regionId: 1565, // Hardcoded Kyiv region
  checkin: '2025-08-06',
  checkout: '2025-08-08',
  guests: {
    adults: 1,
    children: []
  }
}

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

function useSearchProperties() {
  return useMutation({
    mutationFn: async (params: SearchParams) => {
      const queryParams = new URLSearchParams()
      
      // Required parameters
      if (params.regionId) queryParams.append('regionId', params.regionId.toString())
      if (params.checkin) queryParams.append('checkin', params.checkin)
      if (params.checkout) queryParams.append('checkout', params.checkout)
      
      // Guests parameter - this is required
      if (params.guests) {
        queryParams.append('guests[0][adults]', params.guests.adults.toString())
        if (params.guests.children && params.guests.children.length > 0) {
          params.guests.children.forEach((childAge, index) => {
            queryParams.append(`guests[0][children][${index}]`, childAge.toString())
          })
        }
      }
      
      // Optional parameters
      if (params.sort) queryParams.append('sort', params.sort)
      if (params.limit) queryParams.append('limit', params.limit.toString())
      if (params.page) queryParams.append('page', params.page.toString())
      if (params.minPrice !== undefined) queryParams.append('minPrice', params.minPrice.toString())
      if (params.maxPrice !== undefined) queryParams.append('maxPrice', params.maxPrice.toString())
      if (params.hasFreeCancellation !== undefined) queryParams.append('hasFreeCancellation', params.hasFreeCancellation.toString())
      
      // Handle categories
      if (params.categories && params.categories.length > 0) {
        params.categories.forEach(category => {
          queryParams.append('categories', category)
        })
      }

      const url = `/bookings/apartments?${queryParams.toString()}`
      console.log('Search API Request URL:', url)
      console.log('Search API Parameters:', params)

      try {
        const response = await api.get(url)
        console.log('Search API Response:', response.data)
        return response.data
      } catch (error: any) {
        console.error('Search API Error:', error)
        console.error('Search API Error Response:', error.response?.data)
        console.error('Search API Error Status:', error.response?.status)
        throw error
      }
    }
  })
}

export function SearchProvider(props: { children: ReactNode }) {
  const { children } = props
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters)
  const [searchParams, setSearchParams] = useState<SearchParams>(defaultSearchParams)
  const [searchResults, setSearchResults] = useState<Result[]>()
  const [searchError, setSearchError] = useState<string>()

  const randomQuery = useSearchRandomProperties()
  const searchMutation = useSearchProperties()

  const openSearchModal = useCallback(() => {
    setIsSearchModalOpen(true)
  }, [])

  const closeSearchModal = useCallback(() => {
    setIsSearchModalOpen(false)
  }, [])

  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  const updateSearchParams = useCallback((newParams: Partial<SearchParams>) => {
    setSearchParams(prev => ({ ...prev, ...newParams }))
  }, [])

  const performSearch = useCallback(() => {
    const combinedParams = {
      ...searchParams,
      sort: filters.sort,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      hasFreeCancellation: filters.hasFreeCancellation,
      categories: filters.categories,
      limit: 24,
      page: 1
    }

    searchMutation.mutate(combinedParams, {
      onSuccess: (data) => {
        setSearchResults(data)
        setSearchError(undefined)
        closeSearchModal()
      },
      onError: (error: any) => {
        setSearchError(error.message || 'Search failed')
      }
    })
  }, [searchParams, filters, searchMutation, closeSearchModal])

  const clearSearch = useCallback(() => {
    setSearchResults(undefined)
    setSearchError(undefined)
  }, [])

  const value: SearchProviderContext = {
    random: (randomQuery.data ?? []) as Result[],
    searchResults,
    isSearchModalOpen,
    openSearchModal,
    closeSearchModal,
    filters,
    updateFilters,
    searchParams,
    updateSearchParams,
    performSearch,
    clearSearch,
    isLoading: randomQuery.isLoading || searchMutation.isPending,
    searchError,
  }
  
  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
}

export function useSearch() {
  return React.useContext(SearchContext)
}

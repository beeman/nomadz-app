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

export interface SearchSuggestion {
  center?: {
    longitude: number
    latitude: number
  }
  iata?: string
  id: number | string
  countryName?: string
  countryCode?: string
  name: string
  listings?: number
  searchEntityType: 'region' | 'apartment'
  firstSearchInputOccurence: number
  searchInputMatchScore: number
  region?: {
    id: number
    countryCode: string
    iata: string | null
    name: string
    type: string
    type_v2: string
  }
  hid?: number
  category?: string
  address?: string
  hotelChain?: string
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
    infants: number
  }
  sort?: string
  limit?: number
  page?: number
  minPrice?: number
  maxPrice?: number
  hasFreeCancellation?: boolean
  categories?: string[]
  nameIncludes?: string
  selectedDestination?: string // Store the actual destination name for display
  dateRange?: {
    checkin: string | null
    checkout: string | null
    range: string
  }
}

export interface SearchProviderContext {
  random?: Result[]
  searchResults?: Result[]
  searchSuggestions?: SearchSuggestion[]
  isSearchModalOpen: boolean
  openSearchModal: () => void
  closeSearchModal: () => void
  filters: SearchFilters
  updateFilters: (filters: Partial<SearchFilters>) => void
  searchParams: SearchParams
  updateSearchParams: (params: Partial<SearchParams>) => void
  performSearch: () => void
  loadMore: () => void
  clearSearch: () => void
  clearDestination: () => void
  fetchSearchSuggestions: (searchTerm: string) => Promise<void>
  isLoading: boolean
  searchError?: string
  isSearchSuggestionsLoading: boolean
  hasMore: boolean
  isLoadMoreLoading: boolean
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
  guests: {
    adults: 1,
    children: [],
    infants: 0
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

function useSearchSuggestions() {
  return useMutation({
    mutationFn: async (searchTerm: string) => {
      if (!searchTerm || searchTerm.trim().length === 0) {
        return []
      }

      const response = await api.get(`/bookings/search/suggestions?includes=${encodeURIComponent(searchTerm.trim())}&limit=15`)
      console.log('Search suggestions response:', response.data)
      return response.data
    }
  })
}

function useSearchProperties() {
  return useMutation({
    mutationFn: async (params: SearchParams) => {
      const queryParams = new URLSearchParams()
      
      // Required parameters
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
      
      // Search parameters - only send one type
      if (params.regionId) {
        queryParams.append('regionId', params.regionId.toString())
      } else if (params.nameIncludes) {
        queryParams.append('nameIncludes', params.nameIncludes)
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
  const [searchSuggestions, setSearchSuggestions] = useState<SearchSuggestion[]>()
  const [searchError, setSearchError] = useState<string>()
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false)

  const randomQuery = useSearchRandomProperties()
  const searchMutation = useSearchProperties()
  const searchSuggestionsMutation = useSearchSuggestions()

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

  const fetchSearchSuggestions = useCallback(async (searchTerm: string) => {
    try {
      const suggestions = await searchSuggestionsMutation.mutateAsync(searchTerm)
      setSearchSuggestions(suggestions)
    } catch (error) {
      console.error('Error fetching search suggestions:', error)
      setSearchSuggestions([])
    }
  }, [searchSuggestionsMutation])

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

    setCurrentPage(1)
    setHasMore(false)
    setIsLoadMoreLoading(false)

    searchMutation.mutate(combinedParams, {
      onSuccess: (data) => {
        setSearchResults(data)
        setSearchError(undefined)
        setIsSearchModalOpen(false)
        setHasMore(data && data.length === 24)
      },
      onError: (error: any) => {
        setSearchError(error.message || 'Search failed')
      }
    })
  }, [searchParams, filters, searchMutation])

  const loadMore = useCallback(() => {
    if (!hasMore || isLoadMoreLoading) return

    const nextPage = currentPage + 1
    const combinedParams = {
      ...searchParams,
      sort: filters.sort,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      hasFreeCancellation: filters.hasFreeCancellation,
      categories: filters.categories,
      limit: 24,
      page: nextPage
    }

    setIsLoadMoreLoading(true)

    searchMutation.mutate(combinedParams, {
      onSuccess: (data) => {
        if (data && data.length > 0) {
          // Filter out duplicates based on id
          const existingIds = new Set((searchResults || []).map((item: Result) => item.id))
          const newItems = data.filter((item: Result) => !existingIds.has(item.id))
          
          if (newItems.length > 0) {
            setSearchResults(prev => [...(prev || []), ...newItems])
            setCurrentPage(nextPage)
            setHasMore(data.length === 24)
          } else {
            // If all items are duplicates, try next page
            setHasMore(false)
          }
        } else {
          setHasMore(false)
        }
        setIsLoadMoreLoading(false)
      },
      onError: (error: any) => {
        setSearchError(error.message || 'Load more failed')
        setIsLoadMoreLoading(false)
      }
    })
  }, [searchParams, filters, searchMutation, hasMore, isLoadMoreLoading, currentPage, searchResults])

  const clearSearch = useCallback(() => {
    setSearchResults(undefined)
    setSearchError(undefined)
  }, [])

  const clearDestination = useCallback(() => {
    setSearchParams(defaultSearchParams)
    setFilters(defaultFilters)
    setSearchResults(undefined)
    setSearchError(undefined)
  }, [])

  const value: SearchProviderContext = {
    random: (randomQuery.data ?? []) as Result[],
    searchResults,
    searchSuggestions,
    isSearchModalOpen,
    openSearchModal,
    closeSearchModal,
    filters,
    updateFilters,
    searchParams,
    updateSearchParams,
    performSearch,
    loadMore,
    clearSearch,
    clearDestination,
    fetchSearchSuggestions,
    isLoading: randomQuery.isLoading || searchMutation.isPending,
    searchError,
    isSearchSuggestionsLoading: searchSuggestionsMutation.isPending,
    hasMore,
    isLoadMoreLoading,
  }
  
  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
}

export function useSearch() {
  return React.useContext(SearchContext)
}

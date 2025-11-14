import { SearchFeatureDetails } from '@/components/search/search-feature-details'
import { useLocalSearchParams } from 'expo-router'
import React from 'react'

export default function PropertyDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  
  if (!id) {
    return null
  }
  
  return <SearchFeatureDetails />
}

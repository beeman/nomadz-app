import { useAuth } from '@/components/auth/auth-provider'
import { Order } from '@/types/order.types'
import { api } from '@/utils/api'
import React, { ReactNode, useEffect, useState } from 'react'

export interface TripsListProviderContext {
  orders: Order[]
  isLoading: boolean
  error: string | null
  fetchOrders: (userId: string) => Promise<void>
}

const TripsListContext = React.createContext<TripsListProviderContext>({} as TripsListProviderContext)

export function TripsListProvider(props: { children: ReactNode }) {
  const { children } = props
  const { user } = useAuth()
  
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = async (userId: string) => {
    if (!userId) {
      setError('User not authenticated')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await api.get(`users/${userId}?include.orders`)
      setOrders(response.data.orders || [])
    } catch (error: any) {
      console.error('Failed to fetch the orders:', error)
      setError(error.message)
      setOrders([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchOrders(user.userId)
    }
  }, [user])

  const value: TripsListProviderContext = {
    orders,
    isLoading,
    error,
    fetchOrders
  }

  return <TripsListContext.Provider value={value}>{children}</TripsListContext.Provider>
}

export function useTripsList() {
  return React.useContext(TripsListContext)
}

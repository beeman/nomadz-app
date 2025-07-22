import React, { ReactNode } from 'react'

export interface Trip {
  id: string
  title: string
  from: Date
  to: Date
  destination: string
}

export interface TripsListProviderContext {
  items: Trip[]
}

const TripsListContext = React.createContext<TripsListProviderContext>({} as TripsListProviderContext)

export function TripsListProvider(props: { children: ReactNode }) {
  const { children } = props

  const value = {
    items: [
      {
        id: '1',
        title: 'Trip 1',
        from: new Date(),
        to: new Date(),
        destination: 'Destination 1',
      },
      {
        id: '2',
        title: 'Trip 2',
        from: new Date(),
        to: new Date(),
        destination: 'Destination 2',
      },
      {
        id: '3',
        title: 'Trip 3',
        from: new Date(),
        to: new Date(),
        destination: 'Destination 3',
      },
    ],
  }
  return <TripsListContext.Provider value={value}>{children}</TripsListContext.Provider>
}

export function useTripsList() {
  return React.useContext(TripsListContext)
}

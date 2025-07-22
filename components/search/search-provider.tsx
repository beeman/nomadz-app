import React, { ReactNode } from 'react'

export interface Result {
  id: string
  title: string
  destination: string
  image: string
}

export interface SearchProviderContext {
  items: Result[]
}

const SearchContext = React.createContext<SearchProviderContext>({} as SearchProviderContext)

export function SearchProvider(props: { children: ReactNode }) {
  const { children } = props

  const value = {
    items: [
      {
        id: '1',
        title: 'Trip 1',
        destination: 'Destination 1',
        image: 'https://picsum.photos/id/10/200/300',
      },
      {
        id: '2',
        title: 'Trip 2',
        destination: 'Destination 2',
        image: 'https://picsum.photos/id/10/200/300',
      },
      {
        id: '3',
        title: 'Trip 3',
        destination: 'Destination 3',
        image: 'https://picsum.photos/id/10/200/300',
      },
    ],
  }
  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
}

export function useSearch() {
  return React.useContext(SearchContext)
}

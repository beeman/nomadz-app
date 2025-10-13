import {
    useCreateGuestsBatch,
    useGuests
} from '@/components/guests/use-guests';
import { Guest, GuestDetails } from '@/types/guest.types';
import React, { ReactNode, useCallback, useState } from 'react';

export interface SearchProviderContext {
  // Guests state
  savedGuests: Guest[] | undefined;
  guestsLoading: boolean;
  guestsError: any;
  
  // Guest selection state
  selectedGuests: Guest[];
  
  // Actions
  createGuestsBatch: (guestDetails: GuestDetails[]) => Promise<Guest[]>;
  selectGuest: (guest: Guest) => void;
  unselectGuest: (guest: Guest) => void;
  clearSelectedGuests: () => void;
  
  // Utility functions
  isGuestSelected: (guest: Guest) => boolean;
}

const SearchContext = React.createContext<SearchProviderContext>({} as SearchProviderContext);

export function SearchProvider(props: { children: ReactNode }) {
  const { children } = props;
  
  // State
  const [selectedGuests, setSelectedGuests] = useState<Guest[]>([]);
  
  // Queries - only fetch if we don't have cached data
  const { data: savedGuests, isLoading: guestsLoading, error: guestsError } = useGuests();
  
  // Mutations
  const createGuestsBatchMutation = useCreateGuestsBatch();
  
  // Actions
  const createGuestsBatch = useCallback(async (guestDetails: GuestDetails[]) => {
    return await createGuestsBatchMutation.mutateAsync(guestDetails);
  }, [createGuestsBatchMutation]);
  
  const selectGuest = useCallback((guest: Guest) => {
    setSelectedGuests(prev => {
      // Check if guest is already selected
      if (prev.some(selected => selected.id === guest.id)) {
        return prev;
      }
      return [...prev, guest];
    });
  }, []);
  
  const unselectGuest = useCallback((guest: Guest) => {
    setSelectedGuests(prev => prev.filter(selected => selected.id !== guest.id));
  }, []);
  
  const clearSelectedGuests = useCallback(() => {
    setSelectedGuests([]);
  }, []);
  
  // Utility functions
  const isGuestSelected = useCallback((guest: Guest) => {
    return selectedGuests.some(selected => selected.id === guest.id);
  }, [selectedGuests]);
  
  const value: SearchProviderContext = {
    // Guests state
    savedGuests,
    guestsLoading,
    guestsError,
    
    // Guest selection state
    selectedGuests,
    
    // Actions
    createGuestsBatch,
    selectGuest,
    unselectGuest,
    clearSelectedGuests,
    
    // Utility functions
    isGuestSelected,
  };
  
  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearchContext() {
  return React.useContext(SearchContext);
}

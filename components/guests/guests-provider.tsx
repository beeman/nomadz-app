import {
    useCreateGuest,
    useCreateGuestsBatch,
    useDeleteGuest,
    useDeleteGuestsBatch,
    useGuests,
    useUpdateGuest
} from '@/components/guests/use-guests';
import { CreateGuestDto, DeleteGuestsBatchDto, Guest, GuestDetails, UpdateGuestDto } from '@/types/guest.types';
import React, { ReactNode, useCallback, useState } from 'react';

export interface GuestsProviderContext {
  // State
  guests: Guest[] | undefined;
  isLoading: boolean;
  error: any;
  
  // Actions
  createGuest: (data: CreateGuestDto) => Promise<Guest>;
  updateGuest: (id: string, data: UpdateGuestDto) => Promise<Guest>;
  deleteGuest: (id: string) => Promise<void>;
  createGuestsBatch: (guestDetails: GuestDetails[]) => Promise<Guest[]>;
  deleteGuestsBatch: (deleteData: DeleteGuestsBatchDto) => Promise<void>;
  
  // Utility functions
  getGuestById: (id: string) => Guest | undefined;
  getAdults: () => Guest[];
  getChildren: () => Guest[];
  
  // UI state
  selectedGuest: Guest | null;
  setSelectedGuest: (guest: Guest | null) => void;
}

const GuestsContext = React.createContext<GuestsProviderContext>({} as GuestsProviderContext);

export function GuestsProvider(props: { children: ReactNode }) {
  const { children } = props;
  
  // State
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  
  // Queries
  const { data: guests, isLoading, error } = useGuests();
  
  // Mutations
  const createGuestMutation = useCreateGuest();
  const updateGuestMutation = useUpdateGuest();
  const deleteGuestMutation = useDeleteGuest();
  const createGuestsBatchMutation = useCreateGuestsBatch();
  const deleteGuestsBatchMutation = useDeleteGuestsBatch();
  
  // Actions
  const createGuest = useCallback(async (data: CreateGuestDto) => {
    return await createGuestMutation.mutateAsync(data);
  }, [createGuestMutation]);
  
  const updateGuest = useCallback(async (id: string, data: UpdateGuestDto) => {
    return await updateGuestMutation.mutateAsync({ id, data });
  }, [updateGuestMutation]);
  
  const deleteGuest = useCallback(async (id: string) => {
    await deleteGuestMutation.mutateAsync(id);
  }, [deleteGuestMutation]);
  
  const createGuestsBatch = useCallback(async (guestDetails: GuestDetails[]) => {
    return await createGuestsBatchMutation.mutateAsync(guestDetails);
  }, [createGuestsBatchMutation]);
  
  const deleteGuestsBatch = useCallback(async (deleteData: DeleteGuestsBatchDto) => {
    await deleteGuestsBatchMutation.mutateAsync(deleteData);
  }, [deleteGuestsBatchMutation]);
  
  // Utility functions
  const getGuestById = useCallback((id: string) => {
    return guests?.find(guest => guest.id === id);
  }, [guests]);
  
  const getAdults = useCallback(() => {
    return guests?.filter(guest => !guest.isChild) || [];
  }, [guests]);
  
  const getChildren = useCallback(() => {
    return guests?.filter(guest => guest.isChild) || [];
  }, [guests]);
  
  const value: GuestsProviderContext = {
    // State
    guests,
    isLoading,
    error,
    
    // Actions
    createGuest,
    updateGuest,
    deleteGuest,
    createGuestsBatch,
    deleteGuestsBatch,
    
    // Utility functions
    getGuestById,
    getAdults,
    getChildren,
    
    // UI state
    selectedGuest,
    setSelectedGuest,
  };
  
  return (
    <GuestsContext.Provider value={value}>
      {children}
    </GuestsContext.Provider>
  );
}

export function useGuestsContext() {
  return React.useContext(GuestsContext);
}

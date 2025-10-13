import { GuestsList } from '@/components/guests/guests-list';
import { GuestsProvider } from '@/components/guests/guests-provider';
import { Guest } from '@/types/guest.types';
import React from 'react';

interface TripsSettingsDetailsProps {
  onEditGuest?: (guest: Guest) => void;
}

export function TripsSettingsDetails({ onEditGuest }: TripsSettingsDetailsProps) {
  return (
    <GuestsProvider>
      <GuestsList onEditGuest={onEditGuest} />
    </GuestsProvider>
  );
}

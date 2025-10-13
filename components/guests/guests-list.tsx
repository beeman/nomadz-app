import { AppDeleteConfirmationModal } from '@/components/app-delete-confirmation-modal';
import { AppAddEditGuestModal } from '@/components/guests/add-edit-guest-modal';
import { Guest } from '@/types/guest.types';
import { TrashIcon, UserIcon } from 'phosphor-react-native';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useGuestsContext } from './guests-provider';

interface GuestsListProps {
  onEditGuest?: (guest: Guest) => void;
  mode?: 'settings' | 'selection';
  selectedGuests?: Guest[];
  onGuestSelect?: (guest: Guest) => void;
  onGuestUnselect?: (guest: Guest) => void;
  className?: string;
  containerClassName?: string;
  itemClassName?: string;
  showTitle?: boolean;
  title?: string;
}

export function GuestsList({ 
  onEditGuest, 
  mode = 'settings',
  selectedGuests = [],
  onGuestSelect,
  onGuestUnselect,
  className = '',
  containerClassName = '',
  itemClassName = '',
  showTitle = true,
  title = 'saved guests',
}: GuestsListProps) {
  const { guests, isLoading, error, deleteGuest, createGuest, updateGuest } = useGuestsContext();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [guestToDelete, setGuestToDelete] = useState<Guest | null>(null);
  const [addEditModalOpen, setAddEditModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  const handleAddGuest = () => {
    setEditingGuest(null);
    setAddEditModalOpen(true);
  };

  const handleEditGuest = (guest: Guest) => {
    if (mode === 'settings') {
      setEditingGuest(guest);
      setAddEditModalOpen(true);
      onEditGuest?.(guest);
    } else if (mode === 'selection') {
      // Handle selection mode
      const isSelected = selectedGuests.some(selected => selected.id === guest.id);
      if (isSelected) {
        onGuestUnselect?.(guest);
      } else {
        onGuestSelect?.(guest);
      }
    }
  };

  const handleDeleteGuest = (guest: Guest) => {
    setGuestToDelete(guest);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (guestToDelete) {
      try {
        await deleteGuest(guestToDelete.id);
        setDeleteModalOpen(false);
        setGuestToDelete(null);
      } catch (error) {
        console.error('Failed to delete guest:', error);
        // TODO: Show error toast
      }
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setGuestToDelete(null);
  };

  const handleSaveGuest = async (data: any) => {
    try {
      if (editingGuest) {
        await updateGuest(editingGuest.id, data);
      } else {
        await createGuest(data);
      }
      setAddEditModalOpen(false);
      setEditingGuest(null);
    } catch (error) {
      console.error('Failed to save guest:', error);
      throw error; // Re-throw to let the modal handle the error
    }
  };

  const handleCloseAddEditModal = () => {
    setAddEditModalOpen(false);
    setEditingGuest(null);
  };

  const isGuestSelected = (guest: Guest) => {
    return selectedGuests.some(selected => selected.id === guest.id);
  };

  const renderGuestsList = () => {
    if (!guests || guests.length === 0) {
      return null;
    }

    const defaultContainerClasses = "mb-2";
    const defaultItemClasses = "flex-row items-center justify-between gap-x-4 bg-[#171717] border border-[#323232] rounded-lg px-5 py-4 mb-2";
    const defaultContentClasses = "flex-row flex-1 gap-4 items-center min-w-0";

    return (
      <View className={className}>
        {showTitle && (
          <View className="mb-2">
            <Text className="text-sm font-medium text-white">{title}</Text>
          </View>
        )}
        <ScrollView className={`${defaultContainerClasses} ${containerClassName}`}>
          {guests.map((guest) => (
            <TouchableOpacity
              key={guest.id}
              className={`${defaultItemClasses} ${itemClassName} flex flex-row`}
              onPress={() => handleEditGuest(guest)}
            >
              <View className={defaultContentClasses}>
                <View>
                  <UserIcon size={16} color="white" weight="fill" />
                </View>
                <View className='flex-1'>
                    <Text className="text-sm font-medium text-white">
                      {guest.firstName} {guest.lastName}
                    </Text>
                </View>
              </View>
              {mode === 'settings' && (
                <View className="flex-shrink-0">
                  <TouchableOpacity
                    className="p-1"
                    onPress={() => handleDeleteGuest(guest)}
                  >
                    <TrashIcon size={18} color="#DE4444" weight="fill" />
                  </TouchableOpacity>
                </View>
              )}
              {mode === 'selection' && (
                <View className="flex-shrink-0">
                  <View className="flex justify-center items-center w-3.5 h-3.5 rounded border border-white">
                    {isGuestSelected(guest) && (
                      <View className="w-2.5 h-2.5 bg-white rounded-sm" />
                    )}
                  </View>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center py-8">
        <Text className="text-white">Loading guests...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center py-8">
        <Text className="text-red-500">Error loading guests: {error.message}</Text>
      </View>
    );
  }

  if (mode === 'selection') {
    return (
      <View>
        {renderGuestsList()}
      </View>
    );
  }

  return (
    <View className="flex-1">
      <View className="px-4 max-h-full">
        {renderGuestsList()}

        {/* Add Guest Button */}
        <View className="items-center">
          <TouchableOpacity
            className="w-full border border-dashed border-[#626262] rounded-lg py-5 items-center"
            onPress={handleAddGuest}
          >
            <Text className="text-[#CDCDCD] text-sm">
              + add new guest info
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Delete Confirmation Modal */}
      <AppDeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Guest"
        message={`Are you sure you want to delete ${guestToDelete?.firstName} ${guestToDelete?.lastName}?`}
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Add/Edit Guest Modal */}
      <AppAddEditGuestModal
        isOpen={addEditModalOpen}
        onClose={handleCloseAddEditModal}
        onSave={handleSaveGuest}
        guest={editingGuest}
        isLoading={isLoading}
      />
    </View>
  );
}

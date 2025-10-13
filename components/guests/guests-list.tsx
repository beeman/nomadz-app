import { AppDeleteConfirmationModal } from '@/components/app-delete-confirmation-modal';
import { AppAddEditGuestModal } from '@/components/guests/add-edit-guest-modal';
import { Guest } from '@/types/guest.types';
import { TrashIcon, UserIcon } from 'phosphor-react-native';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useGuestsContext } from './guests-provider';

interface GuestsListProps {
  onEditGuest?: (guest: Guest) => void;
}

export function GuestsList({ onEditGuest }: GuestsListProps) {
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
    setEditingGuest(guest);
    setAddEditModalOpen(true);
    onEditGuest?.(guest);
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

  return (
    <View className="flex-1">
      <View className="px-4 max-h-full">
        {/* Guest List */}
        {guests && guests.length > 0 ? (
          <ScrollView className="mb-2">
            {guests.map((guest) => (
              <TouchableOpacity
                key={guest.id}
                className="flex-row items-center justify-between p-3 bg-[#151515] border border-[#323232] rounded-lg mb-2 gap-3"
                onPress={() => handleEditGuest(guest)}
              >
                <UserIcon size={16} color="white" weight='fill' />
                <View className="flex-1">
                  <Text className="text-white text-sm font-medium">
                    {guest.firstName} {guest.lastName}
                  </Text>
                </View>
                <TouchableOpacity
                  className="p-1"
                  onPress={() => handleDeleteGuest(guest)}
                >
                  <TrashIcon size={18} color="#DE4444" weight='fill' />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <View className="items-center py-8">
            <Text className="text-[#CDCDCD] text-sm">No guests added yet</Text>
          </View>
        )}

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

import { CreateGuestDto, Guest, UpdateGuestDto } from '@/types/guest.types';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface AppAddEditGuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateGuestDto | UpdateGuestDto) => Promise<void>;
  guest?: Guest | null; // null for add mode, Guest object for edit mode
  isLoading?: boolean;
}

export function AppAddEditGuestModal({
  isOpen,
  onClose,
  onSave,
  guest,
  isLoading = false,
}: AppAddEditGuestModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
  });

  const isEditMode = !!guest;

  useEffect(() => {
    if (guest) {
      setFormData({
        firstName: guest.firstName,
        lastName: guest.lastName,
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
      });
    }
  }, [guest]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): string | null => {
    if (!formData.firstName.trim()) {
      return 'First name is required';
    }
    if (!formData.lastName.trim()) {
      return 'Last name is required';
    }
    if (!/^[a-zA-Z\s']+$/.test(formData.firstName.trim())) {
      return 'First name can only contain letters, spaces and apostrophes';
    }
    if (!/^[a-zA-Z\s']+$/.test(formData.lastName.trim())) {
      return 'Last name can only contain letters, spaces and apostrophes';
    }
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      Alert.alert('Validation Error', validationError);
      return;
    }

    try {
      const submitData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        isChild: false,
        age: null,
        gender: null,
      };

      await onSave(submitData);
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
      });
      
      onClose();
    } catch (error) {
      console.error('Failed to save guest:', error);
      Alert.alert('Error', 'Failed to save guest. Please try again.');
    }
  };

  const canSave = formData.firstName.trim() && formData.lastName.trim() && !isLoading;

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}>
        <View style={{
          backgroundColor: '#151515',
          borderRadius: 16,
          padding: 24,
          borderWidth: 1,
          borderColor: '#323232',
          width: '100%',
          maxWidth: 360,
        }}>
          {/* Header with close button */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
          }}>
            <Text style={{
              color: 'white',
              fontSize: 22,
              fontWeight: '500',
            }}>
              {isEditMode ? 'Edit Guest' : 'Add Guest\'s Name'}
            </Text>
            <TouchableOpacity
              className="p-2"
              onPress={onClose}
            >
              <Text className="text-white text-lg font-semibold">
                ×
              </Text>
            </TouchableOpacity>
          </View>

          <View className="space-y-4">
            {/* Name Fields */}
            <View className="flex-row gap-2">
              <View className="flex-1">
                <TextInput
                  className="bg-[#151515] border border-[#323232] rounded-xl px-3 py-2.5 text-white text-sm"
                  placeholder="First name"
                  placeholderTextColor="#CDCDCD80"
                  value={formData.firstName}
                  onChangeText={(value) => handleInputChange('firstName', value)}
                  maxLength={50}
                />
              </View>
              <View className="flex-1">
                <TextInput
                  className="bg-[#151515] border border-[#323232] rounded-xl px-3 py-2.5 text-white text-sm"
                  placeholder="Last name"
                  placeholderTextColor="#CDCDCD80"
                  value={formData.lastName}
                  onChangeText={(value) => handleInputChange('lastName', value)}
                  maxLength={50}
                />
              </View>
            </View>

            {/* Save Button */}
            <View className="items-center mt-16">
              <TouchableOpacity
                className="w-32 py-3 rounded-lg bg-[#646464]"
                onPress={handleSubmit}
                disabled={!canSave || isLoading}
              >
                <Text className="text-white text-center text-sm font-medium">
                  {isLoading ? 'Saving...' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

interface AppDeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

export function AppDeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Confirmation',
  message = 'Are you sure you want to delete this item?',
  confirmText = 'Delete',
  cancelText = 'Cancel',
}: AppDeleteConfirmationModalProps) {
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
        padding: 0,
        height: '100%'
      }}>
        <View style={{
          backgroundColor: '#151515',
          borderRadius: 16,
          padding: 24,
          borderWidth: 1,
          borderColor: '#323232',
          minWidth: 300,
          maxWidth: 400,
        }}>
          <Text style={{
            color: 'white',
            fontSize: 18,
            fontWeight: '600',
            textAlign: 'center',
            marginBottom: 16,
          }}>
            {title}
          </Text>
          
          <Text style={{
            color: '#CDCDCD',
            fontSize: 14,
            textAlign: 'center',
            marginBottom: 24,
            lineHeight: 20,
          }}>
            {message}
          </Text>
          
          <View style={{
            flexDirection: 'row',
            gap: 12,
            justifyContent: 'center',
          }}>
            <TouchableOpacity
              style={{
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#626262',
              }}
              onPress={onClose}
            >
              <Text style={{
                color: '#CDCDCD',
                fontSize: 14,
                fontWeight: '500',
              }}>
                {cancelText}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 8,
                backgroundColor: '#DE4444',
              }}
              onPress={onConfirm}
            >
              <Text style={{
                color: 'white',
                fontSize: 14,
                fontWeight: '500',
              }}>
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

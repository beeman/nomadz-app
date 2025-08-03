import { AppText } from '@/components/app-text';
import { ClockIcon, MapIcon, UserOutlineIcon } from '@/components/icons/Icons';
import { Order } from '@/types/order.types';
import { format } from 'date-fns';
import React from 'react';
import { Image, View } from 'react-native';

interface TripCardProps {
  order: Order;
  showActions?: boolean;
  showCancel?: boolean;
}

export const TripCard: React.FC<TripCardProps> = ({
  order,
  showActions = true,
  showCancel = true,
}) => {
  const hotelData = order?.details?.hotel_data;

  if (!hotelData) {
    return null;
  }

  const checkIn = order?.details?.checkin_at ? new Date(order.details.checkin_at as string) : null;
  const checkOut = order?.details?.checkout_at ? new Date(order.details.checkout_at as string) : null;

  return (
    <View style={{
      backgroundColor: '#121212',
      borderRadius: 24,
      borderWidth: 1,
      borderColor: '#323232',
      overflow: 'hidden',
    }}>
      <View style={{ padding: 16 }}>
        {/* Hotel Image and Info */}
        <View style={{ flexDirection: 'row', marginBottom: 16 }}>
          <View style={{
            width: 80,
            height: 80,
            borderRadius: 16,
            overflow: 'hidden',
            marginRight: 16
          }}>
            {(hotelData as any).images?.[0]?.url && (
              <Image
                source={{ uri: (hotelData as any).images[0].url.replace('{size}', '80x80') }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            )}
          </View>

          <View style={{ flex: 1 }}>
                          <AppText style={{
                color: '#FFFFFF',
                fontSize: 16,
                fontWeight: '600',
                marginBottom: 8
              }}>
                {(hotelData as any).name}
              </AppText>

              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <MapIcon color="#BDBDBD" />
                <AppText style={{
                  color: '#BDBDBD',
                  fontSize: 12,
                  marginLeft: 8
                }}>
                  {(hotelData as any).region.name}, {(hotelData as any).region.country_name}
                </AppText>
              </View>
          </View>
        </View>

        {/* Room Details */}
        <View style={{ marginBottom: 16 }}>
          {order.details.rooms_data?.map((room, index) => (
            <View key={index} style={{ marginBottom: 12 }}>
              <AppText style={{
                color: '#FFFFFF',
                fontSize: 14,
                fontWeight: '600',
                marginBottom: 8
              }}>
                {room.room_name}
              </AppText>

              <View style={{ gap: 8 }}>
                {/* Check-in/out Info */}
                {hotelData?.check_in_time && (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <ClockIcon color="#BDBDBD" />
                    <View style={{ marginLeft: 8 }}>
                      <AppText style={{ color: '#BDBDBD', fontSize: 12 }}>
                        Check-in/out
                      </AppText>
                      <AppText style={{ color: '#FFFFFF', fontSize: 14 }}>
                        {hotelData?.check_in_time?.slice(0, 5)} / {hotelData?.check_out_time?.slice(0, 5)}
                      </AppText>
                    </View>
                  </View>
                )}

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <UserOutlineIcon color="#BDBDBD" />
                  <AppText style={{ color: '#FFFFFF', fontSize: 14, marginLeft: 8 }}>
                    {room.guest_data.adults_number} Adults
                    {room.guest_data.children_number > 0 &&
                      `, ${room.guest_data.children_number} Children`}
                  </AppText>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Booking Summary */}
        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 8,
          marginBottom: 16
        }}>
          <View style={{
            backgroundColor: '#414141',
            borderRadius: 20,
            paddingHorizontal: 12,
            paddingVertical: 8
          }}>
            <AppText style={{ color: '#FFFFFF', fontSize: 12 }}>
              staying duration - {order.details.nights} {order.details.nights === 1 ? 'night' : 'nights'}
            </AppText>
          </View>

          {checkIn && checkOut && (
            <View style={{
              backgroundColor: '#414141',
              borderRadius: 20,
              paddingHorizontal: 12,
              paddingVertical: 8
            }}>
              <AppText style={{ color: '#FFFFFF', fontSize: 12 }}>
                {format(checkIn, 'dd MMM yyyy')} - {format(checkOut, 'dd MMM yyyy')}
              </AppText>
            </View>
          )}

          <View style={{
            backgroundColor: '#414141',
            borderRadius: 20,
            paddingHorizontal: 12,
            paddingVertical: 8
          }}>
            <AppText style={{ color: '#FFFFFF', fontSize: 12 }}>
              total price ${order.payment?.amount}
            </AppText>
          </View>
        </View>
      </View>
    </View>
  );
}; 
import Loading from '@/components/Loading'
import { AppText } from '@/components/app-text'
import { AppView } from '@/components/app-view'
import { ChevronDownIcon } from '@/components/icons/Icons'
import { TripCard } from '@/components/trips/TripCard'
import { useTripsList } from '@/components/trips/trips-list-provider'
import { OrderStatuses } from '@/enums/OrderStatuses'
import { Order } from '@/types/order.types'
import * as React from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'

export function TripsFeatureList() {
  const { orders, isLoading } = useTripsList();

  const [groupedOrders, setGroupedOrders] = React.useState<{
    paid: Order[];
    completed: Order[];
    canceled: Order[];
    refused: Order[];
  }>({
    paid: [],
    completed: [],
    canceled: [],
    refused: []
  });

  const [expandedSections, setExpandedSections] = React.useState<{
    paid: boolean;
    completed: boolean;
    canceled: boolean;
    refused: boolean;
  }>({
    paid: false,
    completed: false,
    canceled: false,
    refused: false
  });

  React.useEffect(() => {
    if (!orders) {
      return;
    }

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const grouped = orders.reduce((acc, order) => {
      const checkinDate = order?.details?.checkin_at ? new Date(order.details.checkin_at as string) : null;
      if (checkinDate) {
        checkinDate.setHours(0, 0, 0, 0);
      }

      if (
        order.status === OrderStatuses.CANCELLATION_NOT_PAID || 
        order.status === OrderStatuses.CANCELLATION_PAID
      ) {
        acc.canceled.push(order);
      }
      else if (order.status === OrderStatuses.FINISHED) {
        if ((checkinDate || 0) < currentDate) {
          acc.completed.push(order);
        } else {
          acc.paid.push(order);
        }
      }

      return acc;
    }, {
      paid: [] as Order[],
      completed: [] as Order[],
      canceled: [] as Order[],
      refused: [] as Order[],
    });

    setGroupedOrders(grouped);
  }, [orders]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getVisibleOrders = (orders: Order[], section: keyof typeof expandedSections) => {
    return expandedSections[section] ? orders : orders.slice(0, 3);
  };

  const renderSection = (
    title: string,
    orders: Order[],
    section: keyof typeof expandedSections
  ) => {
    if (orders.length === 0) {
      return null;
    }

    const visibleOrders = getVisibleOrders(orders, section);
    const hasMore = orders.length > 3;

    return (
      <View style={{ marginBottom: 42 }}>
        <AppText variant="titleSmall" style={{ marginBottom: 12, color: '#FFFFFF', fontSize: 20 }}>
          {title}
        </AppText>
        <View style={{ gap: 16 }}>
          {visibleOrders.map(order => (
            <TripCard key={order.id} order={order} />
          ))}
        </View>
        {hasMore && (
          <TouchableOpacity
            onPress={() => toggleSection(section)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              marginTop: 16,
              alignSelf: 'flex-start'
            }}
          >
            <AppText style={{ color: '#8D98AA', fontSize: 14 }}>
              {expandedSections[section] ? 'show less' : 'show more'}
            </AppText>
            <ChevronDownIcon color="#8D98AA" style={{
              transform: [{ rotate: expandedSections[section] ? '180deg' : '0deg' }]
            }} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (isLoading) {
    return <Loading />;
  }

  const hasAnyOrders = Object.values(groupedOrders).some(orders => orders.length > 0);

  return (
    <ScrollView style={{ flex: 1 }}>
      <AppView>
        <View style={{ gap: 42 }}>
          {renderSection('paid bookings', groupedOrders.paid, 'paid')}
          {renderSection('completed', groupedOrders.completed, 'completed')}
          {renderSection('canceled', groupedOrders.canceled, 'canceled')}
          {renderSection('refused', groupedOrders.refused, 'refused')}

          {!hasAnyOrders && (
            <View style={{ 
              alignItems: 'center', 
              justifyContent: 'center',
              marginTop: 96,
              paddingHorizontal: 20
            }}>
              <AppText variant="titleLarge" style={{ 
                color: '#FFFFFF', 
                marginBottom: 8,
                textAlign: 'center'
              }}>
                no trips yet
              </AppText>
              <AppText style={{ 
                color: '#000000', 
                textAlign: 'center',
                fontSize: 16
              }}>
                time to start planning your next adventure!
              </AppText>
            </View>
          )}
        </View>
      </AppView>
    </ScrollView>
  );
}

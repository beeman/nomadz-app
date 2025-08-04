import { useAtom, useAtomValue } from 'jotai';
import {
  fetchUserOrdersAtom,
  userOrdersLoadingAtom,
  userOrdersErrorAtom,
  selectedOrderAtom,
  fetchOrderAtom
} from '../../storage/booking/order.storage';

export const useOrders = () => {
  const [orders, fetchOrders] = useAtom(fetchUserOrdersAtom);
  const isLoading = useAtomValue(userOrdersLoadingAtom);
  const error = useAtomValue(userOrdersErrorAtom);
  const [selectedOrder, setSelectedOrder] = useAtom(selectedOrderAtom);
  const [, fetchOrder] = useAtom(fetchOrderAtom);

  return {
    orders,
    fetchOrders,
    isLoading,
    error,
    selectedOrder,
    setSelectedOrder,
    fetchOrder
  };
}; 
import { atom } from 'jotai';
import { api } from '../../utils/api';
import { authenticatedUserAtom } from '../auth.storage';
import { Order } from '../../types/order.types';

// Atoms for storing orders data
export const userOrdersAtom = atom<Order[]>([]);
export const userOrdersLoadingAtom = atom<boolean>(false);
export const userOrdersErrorAtom = atom<string | null>(null);

// Atom for storing the selected order
export const selectedOrderAtom = atom<Order | null>(null);

// Atom to fetch user orders
export const fetchUserOrdersAtom = atom(
  (get) => get(userOrdersAtom),
  async (get, set) => {
    const userId = get(authenticatedUserAtom)?.id;

    if (!userId) {
      set(userOrdersErrorAtom, 'User not authenticated');
      return;
    }

    set(userOrdersLoadingAtom, true);
    set(userOrdersErrorAtom, null);

    try {
      const response = await api.get(`users/${userId}?include.orders`);
      set(userOrdersAtom, response.data.orders || []);
    } catch (error: any) {
      console.error('Failed to fetch the orders:', error);
      set(userOrdersErrorAtom, error.message);
      set(userOrdersAtom, []);
    } finally {
      set(userOrdersLoadingAtom, false);
    }
  }
);

// Atom to fetch a single order
export const fetchOrderAtom = atom(
  (get) => get(selectedOrderAtom),
  async (get, set, orderId: string) => {
    try {
      set(userOrdersLoadingAtom, true);
      set(userOrdersErrorAtom, null);
      
      const response = await api.get(`orders/${orderId}`);
      set(selectedOrderAtom, response.data);
    } catch (error: any) {
      console.error('Failed to fetch order:', error);
      set(userOrdersErrorAtom, error.message);
      set(selectedOrderAtom, null);
    } finally {
      set(userOrdersLoadingAtom, false);
    }
  }
); 
import { CreateGuestDto, CreateGuestsBatchDto, DeleteGuestsBatchDto, Guest, GuestDetails, UpdateGuestDto } from '@/types/guest.types';
import { api } from '@/utils/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Query keys
export const guestKeys = {
    all: ['guests'] as const,
    lists: () => [...guestKeys.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...guestKeys.lists(), { filters }] as const,
    details: () => [...guestKeys.all, 'detail'] as const,
    detail: (id: string) => [...guestKeys.details(), id] as const,
};

// Fetch all guests
export const useGuests = (queryParams?: Record<string, unknown>) => {
    return useQuery({
        queryKey: guestKeys.list(queryParams || {}),
        queryFn: async () => {
            const response = await api.get('guests', { params: queryParams });
            return response.data as Guest[];
        },
    });
};

// Fetch single guest
export const useGuest = (id: string) => {
    return useQuery({
        queryKey: guestKeys.detail(id),
        queryFn: async () => {
            const response = await api.get(`guests/${id}`);
            return response.data as Guest;
        },
        enabled: !!id,
    });
};

// Create guest mutation
export const useCreateGuest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (guestData: CreateGuestDto) => {
            const response = await api.post('guests', guestData);
            return response.data as Guest;
        },
        onSuccess: () => {
            // Invalidate and refetch guests list
            queryClient.invalidateQueries({ queryKey: guestKeys.lists() });
        },
    });
};

// Create guests batch mutation
export const useCreateGuestsBatch = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (guestDetails: GuestDetails[]) => {
            // Validate that guests data exists and has content
            if (!guestDetails || guestDetails.length === 0) {
                return [];
            }

            // Transform GuestDetails to CreateGuestDto format
            const guestsData: CreateGuestDto[] = guestDetails.map(guest => ({
                firstName: guest.first_name,
                lastName: guest.last_name,
                isChild: guest.is_child || false,
                age: guest.age || null,
                gender: guest.gender || null,
            }));

            // Get current guests to filter out duplicates
            const currentGuests = queryClient.getQueryData<Guest[]>(guestKeys.lists()) || [];
            const newGuests = guestsData.filter(guestData => {
                return !currentGuests.some(savedGuest =>
                    savedGuest.firstName.toLowerCase() === guestData.firstName.toLowerCase() &&
                    savedGuest.lastName.toLowerCase() === guestData.lastName.toLowerCase()
                );
            });

            if (newGuests.length === 0) {
                return [];
            }

            const batchData: CreateGuestsBatchDto = {
                guests: newGuests,
            };

            const response = await api.post('guests/batch', batchData);
            return response.data as Guest[];
        },
        onSuccess: () => {
            // Invalidate and refetch guests list
            queryClient.invalidateQueries({ queryKey: guestKeys.lists() });
        },
    });
};

// Update guest mutation
export const useUpdateGuest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UpdateGuestDto }) => {
            const response = await api.put(`guests/${id}`, data);
            return response.data as Guest;
        },
        onSuccess: (updatedGuest) => {
            // Update the specific guest in cache
            queryClient.setQueryData(guestKeys.detail(updatedGuest.id), updatedGuest);
            // Invalidate and refetch guests list
            queryClient.invalidateQueries({ queryKey: guestKeys.lists() });
        },
    });
};

// Delete guest mutation
export const useDeleteGuest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.delete(`guests/${id}`);
            return response.data;
        },
        onSuccess: (_, deletedId) => {
            // Remove the guest from cache
            queryClient.removeQueries({ queryKey: guestKeys.detail(deletedId) });
            // Invalidate and refetch guests list
            queryClient.invalidateQueries({ queryKey: guestKeys.lists() });
        },
    });
};

// Delete guests batch mutation
export const useDeleteGuestsBatch = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (deleteData: DeleteGuestsBatchDto) => {
            const response = await api.delete('guests/batch', { data: deleteData });
            return response.data;
        },
        onSuccess: (_, deleteData) => {
            // Remove deleted guests from cache
            deleteData.ids.forEach(id => {
                queryClient.removeQueries({ queryKey: guestKeys.detail(id) });
            });
            // Invalidate and refetch guests list
            queryClient.invalidateQueries({ queryKey: guestKeys.lists() });
        },
    });
};

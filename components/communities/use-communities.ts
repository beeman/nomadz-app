import { useQuery } from '@tanstack/react-query';
import { api } from '../../utils/api';
import { resolveUrl } from '../../utils/app.utils';

// React Query hook for fetching user communities
export const useUserCommunitiesQuery = (userId: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['user-communities', userId],
        queryFn: async () => {
            const response = await api.get(resolveUrl(`users/${userId}/communities`));
            return response.data;
        },
        enabled: enabled && !!userId,
    });
};

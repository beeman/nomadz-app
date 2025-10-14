import { useQuery } from '@tanstack/react-query';
import { api } from '../../utils/api';
import { resolveUrl } from '../../utils/app.utils';

// React Query hook for fetching user achievements
export const useUserAchievementsQuery = (userId: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['user-achievements', userId],
        queryFn: async () => {
            const response = await api.get(resolveUrl(`users/${userId}/achievements`));
            return response.data;
        },
        enabled: enabled && !!userId,
    });
};

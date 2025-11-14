import { useQuery } from '@tanstack/react-query';
import { AppConfig } from '../../constants/app-config';
import { api } from '../../utils/api';
import { resolveUrl } from '../../utils/app.utils';

// User score type
export interface UserScore {
    totalUsers: number;
    currentUserRank: number;
}

// React Query hook for fetching user score
export const useUserScoreQuery = (userId: string, enabled: boolean = true) => {
    return useQuery<number>({
        queryKey: ['user-score', userId],
        queryFn: async () => {
            const response = await api.get(resolveUrl(`users/${userId}/score`));
            return response.data;
        },
        enabled: enabled && !!userId,
    });
};

// React Query hook for fetching user with profile
export const useUserQuery = (userId: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['user', userId],
        queryFn: async () => {
            const response = await api.get(resolveUrl(`users/${userId}`, { include: { userProfile: true } }));

            // Transform the user data to include proper image URL
            if (response.data?.userProfile) {
                const userProfile = response.data.userProfile;
                const image = userProfile.image
                    ? `${AppConfig.imageBase}${userProfile.image}`
                    : require('@/assets/svgs/default-avatar.svg');

                return {
                    ...response.data,
                    userProfile: {
                        ...userProfile,
                        image,
                    },
                };
            }

            return response.data;
        },
        enabled: enabled && !!userId,
    });
};

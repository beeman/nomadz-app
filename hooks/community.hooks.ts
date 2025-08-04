import { useAtom, useAtomValue } from 'jotai';
import {
  selectedCommunityAtom,
  communitiesLoadingAtom,
  communityErrorsAtom,
  fetchCommunitiesAtom,
  createCommunityAtom,
  fetchCommunityAtom,
  updateCommunityAtom,
  deleteCommunityAtom,
  addCommunityMemberAtom,
  removeCommunityMemberAtom,
  fetchUserCommunitiesAtom,
} from '../storage/community.storage';
import { authenticatedUserAtom } from '../storage/auth.storage';
import { ActionCreatorOptions } from '../types/action.types';
import { orderBy } from 'lodash';

export const useCommunities = () => {
  const [communities, fetchCommunities] = useAtom(fetchCommunitiesAtom);
  const [userCommunities, fetchUserCommunities] = useAtom(fetchUserCommunitiesAtom);
  const [selectedCommunity] = useAtom(selectedCommunityAtom);
  const authenticatedUser = useAtomValue(authenticatedUserAtom);
  const isLoading = useAtomValue(communitiesLoadingAtom);
  const errors = useAtomValue(communityErrorsAtom);

  const [, createCommunity] = useAtom(createCommunityAtom);
  const [, fetchCommunity] = useAtom(fetchCommunityAtom);
  const [, updateCommunity] = useAtom(updateCommunityAtom);
  const [, deleteCommunity] = useAtom(deleteCommunityAtom);
  const [, addMember] = useAtom(addCommunityMemberAtom);
  const [, removeMember] = useAtom(removeCommunityMemberAtom);

  const fetchCommunityWithMembers = (id: string, options?: ActionCreatorOptions) => {
    return fetchCommunity(id, {
      ...options,
      queryParams: {
        include: {
          usersToCommunities: {
            include: {
              user: {
                include: {
                  userProfile: true,
                },
              },
            },
            orderBy: {
              user: {
                userProfile: {
                  experience: 'desc',
                },
              },
            },
          },
        },
      },
    });
  };

  const fetchCommunitiesWithMembers = (options?: ActionCreatorOptions) => {
    return fetchCommunities({
      ...options,
      queryParams: {
        include: {
          usersToCommunities: true,
        },
      },
    });
  };

  const fetchUserCommunitiesWithDetails = (options?: ActionCreatorOptions) => {
    if (!authenticatedUser?.id) return;

    return fetchUserCommunities(authenticatedUser.id, {
      ...options,
      queryParams: {
        include: {
          community: true,
        },
      },
    });
  };

  return {
    communities,
    userCommunities,
    selectedCommunity,
    isLoading,
    errors,
    fetchCommunities,
    fetchCommunitiesWithMembers,
    fetchUserCommunities,
    fetchUserCommunitiesWithDetails,
    createCommunity,
    fetchCommunity,
    fetchCommunityWithMembers,
    updateCommunity,
    deleteCommunity,
    addMember: (communityId: string, userId: string, options?: ActionCreatorOptions) =>
      addMember({ communityId, userId }, options),
    removeMember: (communityId: string, userId: string, options?: ActionCreatorOptions) =>
      removeMember({ communityId, userId }, options),
  };
};

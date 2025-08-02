import { atom } from 'jotai';
import { api } from '../utils/api';
import { HttpStatusCode } from 'axios';
import { ActionCreatorOptions } from '../types/action.types';
import { Community, UpdateCommunityDTO, UserToCommunity } from '../types/community.types';
import { authenticatedUserAtom } from './auth.storage';
import { resolveUrl } from '../utils/app.utils';

// Atoms for storing communities data
export const communitiesAtom = atom<Community[]>([]);
export const selectedCommunityAtom = atom<Community | null>(null);
export const communitiesLoadingAtom = atom<boolean>(false);

// Atoms for storing errors
export const communityErrorsAtom = atom({
  fetch: null,
  create: null,
  update: null,
  delete: null,
  addMember: null,
  removeMember: null,
});

// Add new atom for user's communities
export const userCommunitiesAtom = atom<(UserToCommunity & { community: Community })[]>([]);

// Fetch all communities
export const fetchCommunitiesAtom = atom(
  (get) => get(communitiesAtom),
  async (get, set, options?: ActionCreatorOptions & { queryParams?: any }) => {
    set(communitiesLoadingAtom, true);
    set(communityErrorsAtom, { ...get(communityErrorsAtom), fetch: null });

    try {
      const url = options?.queryParams
        ? resolveUrl('communities', options.queryParams)
        : 'communities';

      const response = await api.get(url);

      if (response.status === HttpStatusCode.Ok) {
        set(communitiesAtom, response.data);
        options?.onSuccess?.(response.data);
      }
    } catch (error: any) {
      options?.onError?.(error);
      set(communityErrorsAtom, { ...get(communityErrorsAtom), fetch: error?.response?.data });
    } finally {
      set(communitiesLoadingAtom, false);
    }
  }
);

// Create community
export const createCommunityAtom = atom(
  null,
  async (get, set, data: FormData, options?: ActionCreatorOptions) => {
    set(communityErrorsAtom, { ...get(communityErrorsAtom), create: null });
    const userId = get(authenticatedUserAtom)?.id;

    if (!userId) {
      const error = new Error('User not authenticated');
      options?.onError?.(error);
      return;
    }

    try {
      // First create the community
      const response = await api.post('communities', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === HttpStatusCode.Created) {
        // Then add the creator as a member
        const updateResponse = await api.post(`communities/${response.data.id}/members/${userId}`);

        // Add the member relationship to the community data
        const communityWithMember = {
          ...response.data,
          usersToCommunities: [updateResponse.data],
        };

        const currentUserCommunitiesAtom = get(userCommunitiesAtom);
        set(userCommunitiesAtom, [...currentUserCommunitiesAtom, communityWithMember]);
        options?.onSuccess?.(communityWithMember);
      }
    } catch (error: any) {
      options?.onError?.(error);
      set(communityErrorsAtom, { ...get(communityErrorsAtom), create: error?.response?.data });
    }
  }
);

// Fetch single community
export const fetchCommunityAtom = atom(
  null,
  async (get, set, id: string, options?: ActionCreatorOptions & { queryParams?: any }) => {
    set(communitiesLoadingAtom, true);
    set(communityErrorsAtom, { ...get(communityErrorsAtom), fetch: null });

    try {
      const url = options?.queryParams
        ? resolveUrl(`communities/${id}`, options.queryParams)
        : `communities/${id}`;

      const response = await api.get(url);

      if (response.status === HttpStatusCode.Ok) {
        // Update the selected community
        set(selectedCommunityAtom, response.data);
        
        // Update the community in the communities list if it exists
        const currentCommunities = get(communitiesAtom);
        set(communitiesAtom, currentCommunities.map(community =>
          community.id === id ? { ...community, ...response.data } : community
        ));
        
        // Update the community in userCommunities if it exists
        const currentUserCommunities = get(userCommunitiesAtom);
        set(userCommunitiesAtom, currentUserCommunities.map(userCommunity =>
          userCommunity.communityId === id 
            ? { ...userCommunity, community: { ...userCommunity.community, ...response.data } } 
            : userCommunity
        ));
        
        options?.onSuccess?.(response.data);
        return response.data;
      }
    } catch (error: any) {
      options?.onError?.(error);
      set(communityErrorsAtom, { ...get(communityErrorsAtom), fetch: error?.response?.data });
    } finally {
      set(communitiesLoadingAtom, false);
    }
  }
);

// Update community
export const updateCommunityAtom = atom(
  null,
  async (get, set, id: string, data: UpdateCommunityDTO, options?: ActionCreatorOptions) => {
    set(communityErrorsAtom, { ...get(communityErrorsAtom), update: null });

    try {
      const response = await api.put(`communities/${id}`, data);

      if (response.status === HttpStatusCode.Ok) {
        const currentCommunities = get(communitiesAtom);
        set(communitiesAtom, currentCommunities.map(community =>
          community.id === id ? { ...community, ...response.data } : community
        ));

        const currentSelectedCommunity = get(selectedCommunityAtom);
        set(selectedCommunityAtom, { ...currentSelectedCommunity, ...response.data });

        options?.onSuccess?.(response.data);
      }
    } catch (error: any) {
      options?.onError?.(error);
      set(communityErrorsAtom, { ...get(communityErrorsAtom), update: error?.response?.data });
    }
  }
);

// Delete community
export const deleteCommunityAtom = atom(
  null,
  async (get, set, id: string, options?: ActionCreatorOptions) => {
    set(communityErrorsAtom, { ...get(communityErrorsAtom), delete: null });

    try {
      const response = await api.delete(`communities/${id}`);

      if (response.status === HttpStatusCode.Ok) {
        const currentCommunities = get(communitiesAtom);
        set(communitiesAtom, currentCommunities.filter(community => community.id !== id));
        set(selectedCommunityAtom, null);
        options?.onSuccess?.(response.data);
      }
    } catch (error: any) {
      options?.onError?.(error);
      set(communityErrorsAtom, { ...get(communityErrorsAtom), delete: error?.response?.data });
    }
  }
);

// Add member to community
export const addCommunityMemberAtom = atom(
  null,
  async (get, set, { communityId, userId }: { communityId: string, userId: string }, options?: ActionCreatorOptions) => {
    set(communityErrorsAtom, { ...get(communityErrorsAtom), addMember: null });

    try {
      const response = await api.post(`communities/${communityId}/members/${userId}`);

      if (response.status === HttpStatusCode.Created) {
        options?.onSuccess?.(response.data);
      }
    } catch (error: any) {
      options?.onError?.(error);
      set(communityErrorsAtom, { ...get(communityErrorsAtom), addMember: error?.response?.data });
    }
  }
);

// Remove member from community
export const removeCommunityMemberAtom = atom(
  null,
  async (get, set, { communityId, userId }: { communityId: string, userId: string }, options?: ActionCreatorOptions) => {
    set(communityErrorsAtom, { ...get(communityErrorsAtom), removeMember: null });

    try {
      const response = await api.delete(`communities/${communityId}/members/${userId}`);

      if (response.status === HttpStatusCode.Ok) {
        options?.onSuccess?.(response.data);
      }
    } catch (error: any) {
      options?.onError?.(error);
      set(communityErrorsAtom, { ...get(communityErrorsAtom), removeMember: error?.response?.data });
    }
  }
);

// Add fetch user communities atom
export const fetchUserCommunitiesAtom = atom(
  (get) => get(userCommunitiesAtom),
  async (get, set, userId: string, options?: ActionCreatorOptions & { queryParams?: any }) => {
    set(communitiesLoadingAtom, true);
    set(communityErrorsAtom, { ...get(communityErrorsAtom), fetch: null });

    try {
      const url = options?.queryParams
        ? resolveUrl(`users/${userId}/communities`, options.queryParams)
        : `users/${userId}/communities`;

      const response = await api.get(url);

      if (response.status === HttpStatusCode.Ok) {
        set(userCommunitiesAtom, response.data);
        options?.onSuccess?.(response.data);
      }
    } catch (error: any) {
      options?.onError?.(error);
      set(communityErrorsAtom, { ...get(communityErrorsAtom), fetch: error?.response?.data });
    } finally {
      set(communitiesLoadingAtom, false);
    }
  }
); 
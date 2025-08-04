import { useAtom } from 'jotai';
import {
  fetchOneUserAtom,
  selectedUserAtom,
  updateUserAtom,
  userStorageErrorsAtom,
  topUsersByExperienceAtom,
  userLoadingAtom,
  applyToWhitelistAtom,
} from '../storage/user.storage';
import { User } from '../types/user.types';
import { ActionCreatorOptions } from '../types/action.types';

export const useUser = () => {
  const [user, setSelectedUserInStorage] = useAtom(selectedUserAtom);
  const [_user, fetchOneUser] = useAtom(fetchOneUserAtom);
  const [_updateUser, updateUser] = useAtom(updateUserAtom);
  const [errors] = useAtom(userStorageErrorsAtom);
  const [topUsers, fetchTopUsers] = useAtom(topUsersByExperienceAtom);
  const [isLoading] = useAtom(userLoadingAtom);
  const [_applyToWhitelist, applyToWhitelist] = useAtom(applyToWhitelistAtom);

  const fetchUserWithProfile = (id: User['id'], options?: ActionCreatorOptions) => {
    fetchOneUser(id, { include: { userProfile: true } }, options);
  };

  return {
    user,
    errors,
    updateUser,
    fetchOneUser,
    setSelectedUserInStorage,
    topUsers,
    fetchTopUsers,
    fetchUserWithProfile,
    isLoading,
    applyToWhitelist,
  };
};
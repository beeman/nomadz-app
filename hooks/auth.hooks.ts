import { useAtom } from 'jotai';
import {
  authenticatedUserAtom,
  loginPrivyAtom,
  registerPrivyAtom,
  fetchAuthenticatedUserAtom,
  logoutAtom,
  authErrorsAtom,
  readyAtom,
  registerWithCredentialsAtom,
  loginWithCredentialsAtom,
} from '../storage/auth.storage';

export const useAuth = () => {
  const [authenticatedUser, fetchAuthenticatedUser] = useAtom(fetchAuthenticatedUserAtom);
  const [_loginPrivy, loginPrivy] = useAtom(loginPrivyAtom);
  const [_loginWithCredentials, loginWithCredentials] = useAtom(loginWithCredentialsAtom);
  const [_registerPrivy, registerPrivy] = useAtom(registerPrivyAtom);
  const [_registerWithCredentials, registerWithCredentials] = useAtom(registerWithCredentialsAtom);
  const [_logout, logout] = useAtom(logoutAtom);
  const [_, setAuthenticatedUser] = useAtom(authenticatedUserAtom);
  const [errors] = useAtom(authErrorsAtom);
  const [ready] = useAtom(readyAtom);

  const incrementExperience = (xp: number) => {
    if (!authenticatedUser?.userProfile) {
      return;
    }
    const newProfile = {
      ...authenticatedUser.userProfile,
      experience: authenticatedUser.userProfile.experience + xp
    }
    setAuthenticatedUser({ ...authenticatedUser, userProfile: newProfile })
  }

  return {
    authenticatedUser,
    fetchAuthenticatedUser,
    loginPrivy,
    loginWithCredentials,
    registerPrivy,
    registerWithCredentials,
    logout,
    setAuthenticatedUser,
    incrementExperience,
    errors,
    ready,
  };
};
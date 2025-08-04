import { useNavigate, useLocation } from 'react-router-dom';
import { RoutePaths } from '../enums';

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const redirectToSignIn = () => {
    const redirectPath = location.pathname + location.search;
    navigate(`${RoutePaths.SIGN_IN}?redirect_to=${encodeURIComponent(redirectPath)}`);
  };

  return { redirectToSignIn };
}; 
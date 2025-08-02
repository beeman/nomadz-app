
import { useAtom } from 'jotai';
import { referralInfoAtom, referralInfoErrorAtom, fetchReferralInfoAtom } from '../../storage/referral/userReferralInfo';

export const useReferralInfo = () => {
  const [referralInfo, setReferralInfo] = useAtom(referralInfoAtom);
  const [referralError, setReferralError] = useAtom(referralInfoErrorAtom);
  const [, fetchReferralInfo] = useAtom(fetchReferralInfoAtom);

  return {
    referralInfo,
    referralError,
    fetchReferralInfo,
    setReferralInfo,
    setReferralError,
  };
};

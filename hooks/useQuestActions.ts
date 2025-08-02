import { useNavigate } from 'react-router-dom';
// import { useLinkAccount } from '@privy-io/react-auth';
import toastNotifications from '../utils/toastNotifications.utils';
import { AchievementType, RoutePaths } from '../enums';
import { useAuth, useQuests } from './index';
import { useReferralModals, useMintSoulboundModal } from './modals/questModals';
import { openInNewTab } from '../utils/app.utils';
import { QuestTags } from '../enums/Quests';

const automaticAccomplishQuestTags = [
  QuestTags.SubscribeToNomadz, QuestTags.Repost,
]

export const useQuestActions = () => {
  const navigate = useNavigate();
  // const { fetchQuestByTag } = useQuests();

  const { authenticatedUser } = useAuth();
  const { setIsInviteFriendModalOpen } = useReferralModals();
  const { setIsMintSoulboundModalOpen } = useMintSoulboundModal();

  const { accomplishQuest } = useQuests();

  // use this to link twitter directly on quest button click
  // const { linkTwitter } = useLinkAccount({
  //   onSuccess: () => {
  //     fetchQuestByTag(QuestTags.ConnectX, {
  //       onSuccess: quest => {
  //         if (quest.id) {
  //           toastNotifications.success('Successfully connected X ' + quest.id);
  //           accomplishQuest(quest.id);
  //         }
  //       },
  //       onError: () => {
  //         toastNotifications.error('Failed to connect X');
  //       },
  //     });
  //   },
  //   onError: error => {
  //     console.log(error);
  //     toastNotifications.error('Failed to connect X');
  //   },
  // });

  const navigateToSettingsSecurity = () => {
    navigate(`${RoutePaths.SETTINGS_SECURITY}`);
  };

  const questAction = async (id: string, tag: QuestTags) => {
    const userId = authenticatedUser?.id;
    if (!userId) return;

    const actions = {
      [QuestTags.ConnectX]: navigateToSettingsSecurity,
      [QuestTags.ConnectWallet]: navigateToSettingsSecurity,
      [QuestTags.ConnectTelegram]: navigateToSettingsSecurity,
      [QuestTags.InviteFriend]: () => setIsInviteFriendModalOpen(true),
      [QuestTags.MintSoulbound]: () => setIsMintSoulboundModalOpen(true),
      [QuestTags.SubscribeToNomadz]: () => openInNewTab('https://x.com/nomadz_co'),
      [QuestTags.Repost]: () => openInNewTab('https://x.com/intent/retweet?tweet_id=1914328119588303187'),
      [QuestTags.UploadAvatar]: () => navigate(RoutePaths.SETTINGS_PROFILE),
      [QuestTags.ApplyToWhitelist]: () => document.getElementById('apply-to-wallet-button')?.click(),
      [QuestTags.ClaimCrossroadsEvent]: () => navigate(`${RoutePaths.ACHIEVEMENTS}?type=${AchievementType.Event}&search=Crossroads`),
      [QuestTags.ClaimCountry]: () => navigate(`${RoutePaths.ACHIEVEMENTS}?type=${AchievementType.Country}`),
    };

    const action = actions[tag];
    console.log('quest action', action)
    if (action) {
      try {
        if (automaticAccomplishQuestTags.includes(tag)) {
          await accomplishQuest(id)
            .then(() => toastNotifications.success('Quest accomplished successfully'))
            .catch(() => toastNotifications.error('Failed to accomplish the quest'));
        }
        const res = await action();
        return res;
      } catch (error) {
        toastNotifications.error('Failed to accomplish quest');
      }
    }
  };

  return questAction;
};

import { useAtom } from "jotai";
import { inviteFriendModalAtom, mintSoulboundModalAtom } from "../../storage/modals/questModals";

export const useReferralModals = () => {
  const [isInviteFriendModalOpen, setIsInviteFriendModalOpen] = useAtom(inviteFriendModalAtom);

  return {
    isInviteFriendModalOpen,
    setIsInviteFriendModalOpen,
  }
}

export const useMintSoulboundModal = () => {
  const [isMintSoulboundModalOpen, setIsMintSoulboundModalOpen] = useAtom(mintSoulboundModalAtom);

  return {
    isMintSoulboundModalOpen,
    setIsMintSoulboundModalOpen,
  }
}
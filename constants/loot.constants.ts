import { Loot } from '../types/suitcase.types';

export const LOOT_METADATA: Record<Loot, {
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic';
}> = {
  [Loot.FivePercentBookingDiscount]: {
    name: '5% discount on booking',
    description: 'Get 5% off your next booking',
    icon: '/images/gamification/loots/percentage.png',
    rarity: 'common'
  },
  [Loot.FiftyXPBonus]: {
    name: '+50 XP bonus',
    description: 'Earn 50 extra experience points',
    icon: '/images/gamification/loots/xp.png',
    rarity: 'rare'
  },
  [Loot.SolanaEventDiscount]: {
    name: 'discount at solana event',
    description: 'Special discount for Solana events',
    icon: '/images/gamification/loots/solana-ticket.png',
    rarity: 'epic'
  },
  [Loot.TwentyFivePercentXPBoost]: {
    name: '25% XP boost',
    description: '25% boost to experience points',
    icon: '/images/gamification/loots/lightning.png',
    rarity: 'rare'
  }
};

export const RARITY_STYLES: Record<'common' | 'rare' | 'epic', { pill: string; circle: string }> = {
  common: {
    pill: 'bg-[#4BA5FF1A] text-white',
    circle: 'bg-[#4BA5FF] ring-4 ring-[#23476b]'
  },
  rare: {
    pill: 'bg-[#4BFFC31A] text-white',
    circle: 'bg-[#4BFFC3] ring-4 ring-[#246b52]'
  },
  epic: {
    pill: 'bg-[#784BFF1A] text-white',
    circle: 'bg-[#784BFF] ring-4 ring-[#34246a]'
  }
}; 
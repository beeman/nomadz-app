export enum SuitcaseRarities {
  Common = 'Common',
  Uncommon = 'Uncommon',
  Rare = 'Rare',
  Epic = 'Epic',
  Legendary = 'Legendary',
}

export enum Loot {
  FivePercentBookingDiscount = 'FivePercentBookingDiscount',
  FiftyXPBonus = 'FiftyXPBonus',
  SolanaEventDiscount = 'SolanaEventDiscount',
  TwentyFivePercentXPBoost = 'TwentyFivePercentXPBoost',
}

export type SuitcaseOpenTransaction = {
  id: string;
  loot: Loot;
  hash: string;
  suitcaseId: string;
  assetPublicKey: string | null;
  signature: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type OpenSuitcaseDto = {
  suitcaseOpenTransactionId: string;
  serializedTransaction: string;
  signedSerializedTransaction: string;
  signature: string;
};

export type Suitcase = {
  id: string;
  ownerId: string;
  rarity: SuitcaseRarities;
  suitcaseOpenTransactionId?: string | null;
  suitcaseOpenTransaction?: SuitcaseOpenTransaction | null;
  createdAt: Date;
  updatedAt: Date;
};

export type SuitcaseStorageErrors = {
  prepareOpenSuitcaseTransaction: string | null;
  openSuitcase: string | null;
  fetchUserSuitcases: string | null;
};

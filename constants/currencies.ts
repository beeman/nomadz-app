export interface Currency {
  code: string;
  name: string;
  char: string;
  flag: string;
}

export const CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', char: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', char: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', char: '£', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', char: '¥', flag: '🇯🇵' },
  { code: 'AUD', name: 'Australian Dollar', char: 'A$', flag: '🇦🇺' },
  { code: 'CAD', name: 'Canadian Dollar', char: 'C$', flag: '🇨🇦' },
  { code: 'CHF', name: 'Swiss Franc', char: 'Fr', flag: '🇨🇭' },
  { code: 'CNY', name: 'Chinese Yuan', char: '¥', flag: '🇨🇳' },
  { code: 'SGD', name: 'Singapore Dollar', char: 'S$', flag: '🇸🇬' },
  { code: 'NZD', name: 'New Zealand Dollar', char: 'NZ$', flag: '🇳🇿' },
]; 
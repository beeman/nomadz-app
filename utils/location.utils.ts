import { COUNTRIES } from "../constants/countries";

export const formatLocation = (location: { city?: string, country?: string, coordinates?: string }) => {
  const countryObj = COUNTRIES.find(c => {
    const country = location.country;

    if (!country) {
      return;
    }
    // Handle abbreviations and full names
    return c.name.toLowerCase() === country?.toLowerCase() || 
            c.name.toLowerCase().includes(country?.toLowerCase()) ||
            (country === 'UAE' && c.name === 'United Arab Emirates') ||
            (country === 'USA' && c.name === 'United States') ||
            (country === 'UK' && c.name === 'United Kingdom');
  });
  
  const locationParts = [
    location.city, 
    location.country, 
    countryObj?.flag
  ].filter(Boolean);
  
  return locationParts.join(', ');
};

export const formatPropertyRegion = (
  values?: (string | undefined | null)[] | null,
  defaultText: string = 'location not set'
): string => {
  if (!Array.isArray(values)) {
    return defaultText;
  }

  const filtered = values.filter(Boolean); // removes undefined, null, and empty strings

  return filtered.length > 0 ? filtered.join(', ') : defaultText;
};

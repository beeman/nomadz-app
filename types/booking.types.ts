export interface Location {
  center: {
    longitude: number;
    latitude: number;
  };
  iata: string | null;
  id: number;
  countryName: string;
  countryCode: string;
  name: string;
}

export interface PropertyCategory {
  name: string;
}

export interface CountryPreview {
  listings: number;
  countryName: string;
  countryCode: string;
}

export interface CityPreview {
  listings: number;
  name: string;
  countryName: string;
  countryCode: string;
  id: number;
}

export interface BookingSearchParams {
  checkin: string;
  checkout: string;
  regionId?: number | null;
  nameIncludes?: string | null;
  guests: {
    adults: number;
    children: number[];
  };
  // Optional parameters
  categories?: string[];
  sort?: GetApartmentsSort;
  limit?: number;
  page?: number;
  minPrice?: number;
  maxPrice?: number | null;
  latitude?: number;
  longitude?: number;
  hasFreeCancellation?: boolean;
}

export type PriceIntervalKey = 'month' | 'year' | 'day';

export interface FilterState {
  categories: string[];
  sort: GetApartmentsSort;
  priceRange: {
    min: number;
    max: number;
  };
  priceInterval: PriceIntervalKey;
}

export interface PreviewCountry {
  countryName: string;
  countryCode: string;
  listings: number;
}

export interface City {
  countryName: string;
  countryCode: string;
  center: {
    longitude: number;
    latitude: number;
  };
  iata: string | null;
  id: number;
  type: string;
  name: string;
}

export interface ApartmentCategory {
  name: string;
}

export interface ApartmentInfo {
  id: string;
  hid: number;
  name: string;
  category: string;
  address: string;
  checkInTime: string;
  checkOutTime: string;
  latitude: number;
  longitude: number;
  email: string | null;
  phone: string | null;
  postalCode: string | null;
  hotelChain: string | null;
  frontDescTimeStart: string | null;
  frontDescTimeEnd: string | null;
  descriptionStruct: ApartmentInfoDescriptionStructItem[];
  policyStruct: ApartmentInfoPolicyStructItem[];
  images: ApartmentInfoImagesItem[];
  amenityGroups: ApartmentInfoAmenityGroupsItem[];
  roomGroups: ApartmentInfoRoomGroupsItem[];
  serpFilters: string[];
  isGenderSpecificationRequired: boolean;
  deleted: boolean;
  isClosed: boolean;
  facts: ApartmentInfoFacts;
  starCertificate: any;
  paymentMethods: string[];
  keysPickup: ApartmentInfoKeysPickup;
  region: ApartmentInfoRegion | null;
  rating?: number | null;
  detailedRatings: ApartmentInfoDetailedRatings;
  reviews: ApartmentInfoReview[];
  pois: ApartmentInfoPoisItem[];
}

export interface ApartmentsItemInfo {
  id: string;
  hid: number;
  name: string;
  category: string;
  address: string;
  latitude: number;
  longitude: number;
  hotelChain: string | null;
  images: ApartmentInfoImagesItem[];
  region: Pick<ApartmentInfoRegion, 'countryName' | 'center' | 'name' | 'type'> | null;
  rating?: number | null;
  reviewsNumber: number | null;
  rates: any[];
  [key: string]: any;
}

export interface ApartmentInfoDescriptionStructItem {
  paragraphs: string[];
  title: string;
}

export interface ApartmentInfoPolicyStructItem {
  paragraphs: string[];
  title: string;
}

export interface ApartmentInfoImagesItem {
  url: string;
  categorySlug: string;
}

export interface ApartmentInfoAmenityGroupsItem {
  amenities: string[];
  nonFreeAmenities: string[];
  name: string;
}

export interface ApartmentInfoRoomGroupsItem {
  roomGroupId: number;
  images: string[];
  name: string;
  amenities: string[];
  details: ApartmentInfoRoomDetails;
  nameStruct: ApartmentInfoNameStruct;
}

export interface ApartmentInfoRoomDetails {
  class: number;
  quality: number;
  sex: number;
  bathroom: number;
  bedding: number;
  family: number;
  capacity: number;
  club: number;
  bedrooms: number;
  balcony: number;
  floor: number;
  view: number;
}

export interface ApartmentInfoDetailedRatings {
  cleanness: string | number | null;
  location: string | number | null;
  price: string | number | null;
  services: string | number | null;
  room: string | number | null;
  meal: string | number | null;
  wifi: string | number | null;
  hygiene: string | number | null;
}

export interface ApartmentInfoNameStruct {
  bathroom: string | null;
  beddingType: string | null;
  mainName: string | null;
}

export interface ApartmentInfoKeysPickup {
  type: string;
  phone: string | null;
  email: string | null;
  apartmentOfficeAddress: string | null;
  apartmentExtraInformation: string | null;
  isContactless: boolean;
}

export interface ApartmentInfoFacts {
  floorsNumber: number | null;
  roomsNumber: number | null;
  yearBuilt: number | null;
  yearRenovated: number | null;
  electricity: ApartmentInfoFactsElectricity;
}

export interface ApartmentInfoFactsElectricity {
  frequency: number[];
  voltage: number[];
  sockets: string[];
}

export interface ApartmentInfoRegion {
  countryName: string;
  countryCode: string;
  center: ApartmentInfoRegionCenter;
  iata: string | null;
  type: string;
  name: string;
}

export interface ApartmentInfoRegionCenter {
  longitude: number;
  latitude: number;
}

export interface ApartmentInfoReview {
  created: string;
  author: string;
  adults: number;
  children: number;
  nights: number;
  images: string[];
  detailed: ApartmentInfoDetailedRatings;
  rating: number | null;
  reviewPlus: string | null;
  reviewMinus: string | null;
  roomName: string | null;
  travellerType: string | null;
  tripType: string | null;
}

export interface ApartmentInfoPoisItem {
  name: string;
  type: string | null;
  subtype: string | null;
  distanceInMeters: number;
}

export interface ApartmentRatesResponse {
  rates: any[];
  [key: string]: any;
}

export interface GetApartmentCategoriesOptions {
  sort?: {
    [field: string]: number;
  };
  limit?: number;
  rand?: number;
}

export interface GetPreviewCountriesOptions {
  sort?: {
    [field: string]: number;
  };
  limit?: number;
  rand?: number;
}

export interface GetCitiesOptions {
  startWith?: string;
  sort?: {
    [field: string]: number;
  };
  limit?: number;
  rand?: number;
}

// export interface GetCityByIdOptions { }

// export interface GetApartmentInfoOptions {}

export interface GetApartmentRatesOptions {
  checkin: string;
  checkout: string;
  language: string;
  currency: string;
  guests: ApartmentGuests[];
}

export interface GetApartmentsOptions {
  regionId?: number;
  longitude?: number;
  latitude?: number;
  radius?: number;
  checkin: string;
  checkout: string;
  language: string;
  currency: string;
  guests: ApartmentGuests[];
  categories: string[];
  minPrice: number;
  maxPrice: number;
  sort?: GetApartmentsSort;
  page: number;
  limit: number;
}

export type GetRandomApartmentsOptions = Pick<
  GetApartmentsOptions,
  'limit' | 'language' | 'currency'
>;

export enum GetApartmentsSort {
  MostRelevant = 'most_relevant',
  PriceAscending = 'price_ascending',
  PriceDescending = 'price_descending',
  NearestToCityCenter = 'nearest_to_city_center',
  BestReviews = 'best_reviews',
}

export interface GuestDetails {
  first_name: string;
  last_name: string;
  is_child: boolean;
}

export interface ApartmentGuests {
  adults: number;
  children: number[];
  guestsDetails?: GuestDetails[];
}

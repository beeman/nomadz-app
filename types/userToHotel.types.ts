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

export type UserToHotel = {
  hid: number;
  userId: string;
  isSaved: boolean;
  createdAt: Date;
  updatedAt: Date;
  hotel?: ApartmentInfo;
}
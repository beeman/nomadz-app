import { Property } from '../data/mock/property';

export interface EventType {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  name: string;
  url: string;
  description: string;
  startDate: string;
  endDate: string;
  image: string;
  banner: string;
  locationLatitude: number;
  locationLongitude: number;
  locationCityName: string;
  locationCountryName: string;
  createdAt: string;
  updatedAt: string;
  eventType: EventType;
  hotels?: Property[];
}

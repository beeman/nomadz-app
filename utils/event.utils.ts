import { COUNTRIES } from "../constants/countries";
import { RoutePaths } from "../enums";
import { resolveUrl } from "./app.utils";
import { formatMonthYear } from "./date.utils";

export function groupEventsByYearAndMonth(events: { startDate: string }[]) {
  return events.reduce((acc, event) => {
    const { year, month } = formatMonthYear(event.startDate);

    if (!acc[year]) {
      acc[year] = {};
    }

    if (!acc[year][month]) {
      acc[year][month] = [];
    }

    acc[year][month].push(event);
    return acc;
  }, {} as Record<string, Record<string, typeof events>>);
}

export function getEventBookNearbyUrl(event: { id: string; startDate: string, endDate: string, locationLatitude: number, locationLongitude: number }) {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const formatLocalDate = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  const startDateObj = new Date(event.startDate);
  const endDateObj = new Date(event.endDate);

  let checkinDate: Date;
  let checkoutDate: Date;

  if (startDateObj.toISOString().slice(0, 10) === endDateObj.toISOString().slice(0, 10)) {
    // Same day: checkin = day before, checkout = day after
    checkinDate = new Date(startDateObj);
    checkinDate.setDate(checkinDate.getDate() - 1);

    checkoutDate = new Date(endDateObj);
    checkoutDate.setDate(checkoutDate.getDate() + 1);
  } else {
    // Different days: checkin = day before start, checkout = day after end
    checkinDate = new Date(startDateObj);
    checkinDate.setDate(checkinDate.getDate() - 1);

    checkoutDate = new Date(endDateObj);
    checkoutDate.setDate(checkoutDate.getDate() + 1);
  }

  const checkin = formatLocalDate(checkinDate);
  const checkout = formatLocalDate(checkoutDate);

  console.log('startDate', startDateObj, checkin)

  console.log('endDate', endDateObj, checkout)

  // Create the URL
  const staySearchUrl = resolveUrl(RoutePaths.STAYS, {
    checkin,
    checkout,
    latitude: event.locationLatitude.toString(),
    longitude: event.locationLongitude.toString(),
    radius: 5000, // 5km radius
    sort: 'best_reviews',
    event: event.id,
  });

  return staySearchUrl;
}

export function getEventBookNearbyParams(event: { startDate: string, endDate: string, locationLatitude: number, locationLongitude: number }) {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const formatLocalDate = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  const startDateObj = new Date(event.startDate);
  const endDateObj = new Date(event.endDate);

  let checkinDate: Date;
  let checkoutDate: Date;

  if (startDateObj.toISOString().slice(0, 10) === endDateObj.toISOString().slice(0, 10)) {
    // Same day: checkin = day before, checkout = day after
    checkinDate = new Date(startDateObj);
    checkinDate.setDate(checkinDate.getDate() - 1);

    checkoutDate = new Date(endDateObj);
    checkoutDate.setDate(checkoutDate.getDate() + 1);
  } else {
    // Different days: checkin = day before start, checkout = day after end
    checkinDate = new Date(startDateObj);
    checkinDate.setDate(checkinDate.getDate() - 1);

    checkoutDate = new Date(endDateObj);
    checkoutDate.setDate(checkoutDate.getDate() + 1);
  }

  const checkin = formatLocalDate(checkinDate);
  const checkout = formatLocalDate(checkoutDate);

  const searchParams = {
    checkin,
    checkout,
    latitude: event.locationLatitude,
    longitude: event.locationLongitude,
    radius: 5000, // 5km radius
    sort: 'best_reviews',
  };

  return searchParams;
}

export function sortEventsByStartDate(events: { startDate: string }[]) {
  return events.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
}

export function getCountryInfoByName(countryName: string): string {
  const country = COUNTRIES.find(c => c.name.toLowerCase() === countryName.toLowerCase());

  if (country) {
    return `${country.name}, ${country.flag}`;
  }

  return countryName; // Return the name if not found
}
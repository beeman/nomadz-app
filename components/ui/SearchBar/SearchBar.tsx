import DatePicker, { DateRange } from '@/components/ui/DatePicker';
import LocationInput from '@/components/ui/LocationInput';
import GuestNumberInput from '@/components/ui/SearchBar/GuestsInput';
import { useRoute } from '@react-navigation/native';
import { useState, useEffect } from 'react';

export default function SearchBar() {
  const route = useRoute<any>();
  const searchParams = route.params;

  const [locationInput, setLocationInput] = useState('');
  const [dateRange, setDateRange] = useState<DateRange>({
    dates: [null, null],
    range: 'exact'
  });

  // Keep dateRange in sync with URL search params
  // Convert between JS Date objects used by the date picker and ISO date strings (YYYY-MM-DD) used in URLs and API calls
  useEffect(() => {
    setDateRange({
      dates: [
        searchParams.checkin ? new Date(searchParams.checkin) : null,
        searchParams.checkout ? new Date(searchParams.checkout) : null
      ],
      range: 'exact'
    });
  }, [searchParams.checkin, searchParams.checkout]);

  // Handle location fetch for region search
  useEffect(() => {
    if (searchParams.regionId) {
      fetchLocation(searchParams.regionId);
    } else {
      setLocationInput('');
    }
  }, [searchParams.regionId]);

  // Update location input when selectedLocation changes
  useEffect(() => {
    if (selectedLocation && searchParams.regionId) {
      setLocationInput(selectedLocation.name);
    } else if (searchParams.nameIncludes) {
      setLocationInput(searchParams.nameIncludes);
    } else {
      setLocationInput('');
    }
  }, [selectedLocation, searchParams.regionId, searchParams.nameIncludes]);

  const handleLocationChange = (input: string, id?: number) => {
    if (id !== undefined) {
      // Clear name search when selecting a region
      updateSearchParams({ regionId: id, nameIncludes: null });
    }
    setLocationInput(input);
  };

  const handleNameSearchChange = (name: string) => {
    // Clear region search when using name search
    updateSearchParams({ nameIncludes: name, regionId: null });
    setLocationInput(name);
  };

  const handleDateRangeChange = (newDateRange: DateRange) => {
    setDateRange(newDateRange);
    const [start, end] = newDateRange.dates;
    if (start && end) {
      updateSearchParams({
        checkin: formatDateToISOString(start),
        checkout: formatDateToISOString(end)
      });
    }
  };

  const handleSearch = async () => {
    if (!searchParams.regionId && !searchParams.nameIncludes) {
      toastNotifications.info('Please, select a destination or enter a property name');
      return;
    }
    if (!searchParams.checkin || !searchParams.checkout) {
      toastNotifications.info('Please, select your travel dates');
      return;
    }

    const parsedParams = parseQueryParams(routerSearchParams.toString());
    const combinedParams = getCombinedParams();
    try {
      // Navigate to stays page with search params
      const searchUrl = resolveUrl(RoutePaths.STAYS, {
        ...parsedParams,
        ...combinedParams,
        regionId: searchParams.regionId,
        nameIncludes: searchParams.nameIncludes,
        checkin: searchParams.checkin,
        checkout: searchParams.checkout,
        guests: searchParams.guests,
      });

      navigate(searchUrl);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  // autocomplete dates if not set
  const autocompleteDates = () => {
    if (!searchParams.checkin && !searchParams.checkout) {
      const today = new Date();
      const checkinDate = new Date(today);
      checkinDate.setDate(today.getDate() + 5);
      const checkoutDate = new Date(today);
      checkoutDate.setDate(today.getDate() + 7);
      updateSearchParams({
        checkin: checkinDate.toISOString().slice(0, 10),
        checkout: checkoutDate.toISOString().slice(0, 10),
      });
    }
  };

  return (
    <div className='@container !p-1 rounded-full border-t border-[#707070] bg-gradient-1213'>
      <div className="flex items-center !p-2 bg-black rounded-full shadow-lg">
        <LocationInput
          value={locationInput}
          selectedId={searchParams.regionId || undefined}
          nameIncludes={searchParams.nameIncludes}
          onChange={handleLocationChange}
          onNameSearchChange={handleNameSearchChange}
          onSuggestionSelect={autocompleteDates}
          className='@[820px]:mr-[50px] mr-8 !max-w-[300px] w-full !min-w-[200px]'
          innerClassName='pr-4'
        />
        
        <DatePicker
          value={dateRange}
          minDate={new Date()}
          onChange={handleDateRangeChange}
          // buttonClassName='!w-24'
          className='!w-fit'
        />
        
        <GuestNumberInput 
          className='@[820px]:mx-[60px] @[800px]:mx-12 mx-8'
          guests={searchParams.guests}
          onGuestsChange={(newGuests) => updateSearchParams({ guests: newGuests })}
        />
        
        <button
          onClick={handleSearch}
          className="mr-1 flex items-center ml-auto py-2.5 space-x-1.5 text-black rounded-full px-[38px] shadow-[0px_1.28px_0.64px_0px_#FFFFFF40_inset,0px_-2.56px_1.28px_0px_#00000040_inset,0px_0px_0.64px_2.56px_#FFFFFF1A,0px_0px_96.16px_0px_#79B9ED52] bg-[radial-gradient(50%_50%_at_50%_50%,#FFFFFF_0%,#E0E0E0_100%)]"
        >
          <span className='text-sm'>search</span>
          <span>🔎</span>
        </button>
      </div>
    </div>
  );
} 
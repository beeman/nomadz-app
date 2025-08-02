import { useState, useEffect } from 'react';
import { useEvents, useSearchParams } from '../../hooks';
import { useSearchParams as useRouterSearchParams } from 'react-router-dom';
import { XMarkIcon, ChevronDownCircleIcon, SparklesIcon, CalendarDatesIcon } from '../icons/Icons';
import GuestNumberInput from './GuestsInput';
import LocationInput from '../ui/LocationInput';
import { useNavigate } from 'react-router-dom';
import { RoutePaths } from '../../enums/RoutePaths';
import { resolveUrl, parseQueryParams } from '../../utils/app.utils';
import { useLocation } from '../../hooks';
import { formatDateToISOString } from '../../utils/date.utils';
import Modal from '../ui/Modal';
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/custom-datepicker.css";
import DatePicker, { DateRange } from '../ui/DatePicker';
import { SORT_OPTIONS } from '../../constants/booking.constants';
import { bookingsService } from '../../services/bookings';
import { GetApartmentsSort, PropertyCategory } from '../../types/booking.types';
import PriceRange from '../ui/PriceRange';
import { priceDistribution } from '../../data/mock/priceDistribution';
import toastNotifications from '../../utils/toastNotifications.utils';
import EventCard from '../Stays/EventCard';

export default function SearchBarMobile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { searchParams, updateSearchParams, getCombinedParams } = useSearchParams();
  const { selectedLocation, fetchLocation } = useLocation();
  const { filterParams, updateFilterParams } = useSearchParams();
  const { selectedEvent } = useEvents();

  const [locationInput, setLocationInput] = useState('');
  const [dateRange, setDateRange] = useState<DateRange>({
    dates: [null, null],
    range: 'exact'
  });
  const navigate = useNavigate();
  const [routerSearchParams] = useRouterSearchParams();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [propertyCategories, setPropertyCategories] = useState<PropertyCategory[]>([]);
  const [parsedParams, setParsedParams] = useState<any>(null);

  // Initialize dates from search params
  useEffect(() => {
    setDateRange({
      dates: [
        searchParams.checkin ? new Date(searchParams.checkin) : null,
        searchParams.checkout ? new Date(searchParams.checkout) : null
      ],
      range: 'exact'
    });
  }, [searchParams.checkin, searchParams.checkout]);

  // Keep location in sync with URL search params
  useEffect(() => {
    const parsedParams = parseQueryParams(routerSearchParams.toString());

    if (searchParams.regionId && parsedParams.regionId) {
      fetchLocation(searchParams.regionId);
    }
    if (!parsedParams.regionId && !parsedParams.nameIncludes) {
      setLocationInput('');
    }
  }, [searchParams.regionId, searchParams.nameIncludes]);

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

  // Add property categories fetch effect
  useEffect(() => {
    const fetchPropertyTypes = async () => {
      try {
        const categories = await bookingsService.getPropertyTypes();
        setPropertyCategories(categories);
      } catch (error) {
        console.error('Failed to fetch property types:', error);
      }
    };

    fetchPropertyTypes();
  }, []);

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

  const isValidDateRange = (start: Date | null, end: Date | null): boolean => {
    if (!start || !end) return true;
    
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= 30;
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

  const renderDayContents = (day: number) => {
    return (
      <div className="react-datepicker__day-inner">
        {day}
      </div>
    );
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
      const searchUrl = resolveUrl(RoutePaths.STAYS, {
        ...parsedParams,
        ...combinedParams,
        regionId: searchParams.regionId,
        nameIncludes: searchParams.nameIncludes,
        checkin: searchParams.checkin,
        checkout: searchParams.checkout,
        guests: searchParams.guests,
      });

      setIsModalOpen(false);
      navigate(searchUrl);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const togglePropertyType = (type: string) => {
    if (type === 'all') {
      const allCategoryNames = propertyCategories.map(cat => cat.name);
      const areAllSelected = allCategoryNames.every(name => filterParams.categories?.includes(name));
      
      updateFilterParams({
        categories: areAllSelected ? [] : allCategoryNames
      });
    } else {
      updateFilterParams({
        categories: filterParams.categories?.includes(type)
          ? filterParams.categories.filter(t => t !== type)
          : [...(filterParams.categories || []), type]
      });
    }
  };

  const handlePriceRangeChange = (range: { min: number; max: number | null }) => {
    updateFilterParams({
      minPrice: range.min,
      maxPrice: range.max
    });
  };

  const setSortOption = (option: GetApartmentsSort) => {
    updateFilterParams({
      sort: option
    });
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

  useEffect(() => {
    setParsedParams(parseQueryParams(routerSearchParams.toString()));
  }, [routerSearchParams])

  return (
    <>
      {/* Search Bar Button */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="w-full !p-1 rounded-full bg-gradient-1213 border-gradient-gray"
      >
        <div className='flex items-center px-4 py-3 bg-black border border-[#555555] rounded-full'>
          <SparklesIcon className="mr-3 text-white" />
          <span className="text-sm text-[#B7B7B7]">
            {locationInput || "what's your destination?"}
          </span>
        </div>
      </button>

      {/* Search Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="w-full max-w-[400px] mx-4 fixed inset-0 z-200 bg-black h-[95dvh] mt-[5dvh] rounded-t-3xl border border-[#292929]"
        overlayClassName="!z-200"
      >
        <div className="flex overflow-y-auto flex-col p-6 h-full no-scrollbar">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-xl font-medium text-white">what's your destination?</p>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="p-1.5 rounded-full bg-[#292929]"
            >
              <XMarkIcon className="text-white size-3" />
            </button>
          </div>

          {/* Location Input */}
          <div className="mb-6">
            <div className='rounded-full border-gradient-gray'>
              <div className='p-1 rounded-full bg-gradient-1213'>
                <LocationInput
                  value={locationInput}
                  selectedId={searchParams.regionId || undefined}
                  nameIncludes={searchParams.nameIncludes}
                  onChange={handleLocationChange}
                  onNameSearchChange={handleNameSearchChange}
                  onSuggestionSelect={autocompleteDates}
                  className="w-full"
                  backgroundColor='bg-black'
                  // activeBackgroundColor='bg-black'
                />
              </div>
            </div>
          </div>

          {/* Date Picker */}
          <div className="mb-6">
            <div className='border-gradient-gray rounded-[16px]'>
              <DatePicker
                value={dateRange}
                onChange={handleDateRangeChange}
                minDate={new Date()}
                className="w-full !px-6 !py-4 border-gradient-gray rounded-2xl bg-gradient-1213"
                buttonClassName='w-full'
                monthsShown={1}
                icon={<CalendarDatesIcon />}
              />
            </div>
          </div>

          {/* Guests Input */}
          <div className="mb-6">
            <div className='border-gradient-gray rounded-[32px]'>
              <GuestNumberInput 
                guests={searchParams.guests}
                onGuestsChange={(newGuests) => updateSearchParams({ guests: newGuests })}
                className="w-full [&>*>p]:text-left bg-gradient-1213 rounded-[32px] !px-6 !py-1.5"
                // dropdownPosition="top"
              />
            </div>
          </div>

          {/* Event Card */}
          {selectedEvent && selectedEvent.id === parsedParams?.event && (
            <div className='border-gradient-gray rounded-[20px] mb-6'>
              <div className='!p-1 bg-gradient-1213 rounded-[20px]'>
                <EventCard event={selectedEvent} className='' />
              </div>
            </div>
          )}

          {/* Filter Sections */}
          <div className="mb-6 space-y-4">
            {/* Property Type Section */}
            <div className="border-gradient-gray rounded-[32px]">
              <div className="bg-gradient-1213 rounded-[32px] overflow-hidden">
                <button
                  onClick={() => toggleSection('propertyType')}
                  className="flex justify-between items-center px-6 py-3 w-full text-white"
                >
                  <span>property type</span>
                  <ChevronDownCircleIcon 
                    className={`size-4 transform transition-transform ${openSection === 'propertyType' ? 'rotate-180' : ''}`}
                  />
                </button>
                {openSection === 'propertyType' && (
                  <div className="px-6 pb-4">
                    <div className="flex flex-wrap gap-2">
                      {propertyCategories.map(category => (
                        <button
                          key={category.name}
                          onClick={() => togglePropertyType(category.name)}
                          className={`
                            px-4 py-1.5 rounded-full text-white text-xs border border-[#ffffff80]
                            ${filterParams.categories?.includes(category.name) ? 'bg-[#FFFFFF1F]' : 'bg-[#1B1B1B]'}
                          `}
                        >
                          {category.name.replace(/_/g, ' ').toLowerCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Price Range Section */}
            <div className="border-gradient-gray rounded-[32px]">
              <div className="bg-gradient-1213 rounded-[32px] overflow-hidden">
                <button
                  onClick={() => toggleSection('price')}
                  className="flex justify-between items-center px-6 py-3 w-full text-white"
                >
                  <span>Price range</span>
                  <ChevronDownCircleIcon 
                    className={`size-4 transform transition-transform ${openSection === 'price' ? 'rotate-180' : ''}`}
                  />
                </button>
                {openSection === 'price' && (
                  <div className="px-6 pb-4">
                    <PriceRange
                      distribution={priceDistribution}
                      onChange={handlePriceRangeChange}
                      initialRange={{
                        min: filterParams.minPrice ?? 0,
                        max: filterParams.maxPrice ?? null,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Sort Section */}
            <div className="border-gradient-gray rounded-[32px]">
              <div className="bg-gradient-1213 rounded-[32px] overflow-hidden">
                <button
                  onClick={() => toggleSection('sort')}
                  className="flex justify-between items-center px-6 py-3 w-full text-white"
                >
                  <span>sort by</span>
                  <ChevronDownCircleIcon 
                    className={`size-4 transform transition-transform ${openSection === 'sort' ? 'rotate-180' : ''}`}
                  />
                </button>
                {openSection === 'sort' && (
                  <div className="px-6 pb-4">
                    {Object.entries(SORT_OPTIONS).map(([key, label]) => (
                      <button
                        key={key}
                        className={`
                          w-full px-4 py-2 text-left text-xs hover:bg-[#292929] transition-colors
                          ${filterParams.sort === key ? 'text-white bg-[#292929]' : 'text-[#A9A9A9]'}
                        `}
                        onClick={() => setSortOption(key as GetApartmentsSort)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Free Cancellation Section */}
            <div className="border-gradient-gray rounded-[32px]">
              <div className="bg-gradient-1213 rounded-[32px] overflow-hidden">
                <button
                  onClick={() => toggleSection('cancellation')}
                  className="flex justify-between items-center px-6 py-3 w-full text-white"
                >
                  <span>free cancellation</span>
                  <ChevronDownCircleIcon 
                    className={`size-4 transform transition-transform ${openSection === 'cancellation' ? 'rotate-180' : ''}`}
                  />
                </button>
                {openSection === 'cancellation' && (
                  <div className="px-6 pb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[#A9A9A9] text-xs">Show only properties with free cancellation</span>
                      <button
                        onClick={() => updateFilterParams({ hasFreeCancellation: !filterParams.hasFreeCancellation })}
                        className={`
                          w-12 h-6 rounded-full transition-colors duration-200
                          ${filterParams.hasFreeCancellation ? 'bg-white' : 'bg-[#292929]'}
                        `}
                      >
                        <div
                          className={`
                            w-5 h-5 rounded-full bg-black transition-transform duration-200
                            ${filterParams.hasFreeCancellation ? 'translate-x-6' : 'translate-x-1'}
                          `}
                        />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleSearch}
            className="w-full py-2.5 mt-auto text-white bg-[#363636] rounded-full"
          >
            continue
          </button>
        </div>
      </Modal>
    </>
  );
} 
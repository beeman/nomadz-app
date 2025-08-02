import { useState, useCallback, useEffect, useRef } from 'react';
import { MapPinIcon, MapPinFilledIcon, XMarkIcon, LoadingIcon } from '../icons/Icons';
import { HomeModernIcon } from '@heroicons/react/24/outline';
import { useApartments } from '../../hooks/booking/apartment.hooks';
import Dropdown from './Dropdown';
import debounce from 'lodash/debounce';
import { useSearchParams } from '../../hooks/searchParams.hooks';
import { useNavigate } from 'react-router-dom';
import { RoutePaths } from '../../enums/RoutePaths';
import { resolveUrl } from '../../utils/app.utils';

interface LocationInputProps {
  value: string;
  selectedId?: number;
  nameIncludes?: string | null;
  onChange: (input: string, id?: number) => void;
  onNameSearchChange?: (name: string) => void;
  className?: string;
  innerClassName?: string;
  activeBackgroundColor?: string;
  backgroundColor?: string;
  onSuggestionSelect?: () => void;
}

interface SearchSuggestion {
  center?: {
    longitude: number;
    latitude: number;
  };
  iata?: string;
  id: number | string;
  countryName?: string;
  countryCode?: string;
  name: string;
  listings?: number;
  searchEntityType: 'region' | 'apartment';
  firstSearchInputOccurence: number;
  searchInputMatchScore: number;
  region?: {
    id: number;
    countryCode: string;
    iata: string | null;
    name: string;
    type: string;
    type_v2: string;
  };
  hid?: number;
  category?: string;
  address?: string;
  hotelChain?: string;
}

export default function LocationInput({ 
  value, 
  selectedId, 
  nameIncludes,
  onChange, 
  onNameSearchChange,
  className = '', 
  innerClassName = '', 
  activeBackgroundColor = 'bg-[#272727]', 
  backgroundColor = '',
  onSuggestionSelect
}: LocationInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { searchSuggestions, fetchSearchSuggestions } = useApartments();
  const { searchParams } = useSearchParams();
  const navigate = useNavigate();
  const [suggestionSelected, setSuggestionSelected] = useState(false);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.select();
    }
  }, [isOpen]);

  // Update suggestions when searchSuggestions atom changes
  useEffect(() => {
    setSuggestions(searchSuggestions || []);
    setIsLoading(false);
  }, [searchSuggestions]);

  const fetchSuggestions = useCallback(
    debounce(async (searchTerm: string) => {
      if (!searchTerm || searchTerm.trim().length === 0) {
        setSuggestions([]);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        await fetchSearchSuggestions(searchTerm);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [fetchSearchSuggestions]
  );

  const handleInputChange = (input: string) => {
    onChange(input);
    fetchSuggestions(input);
  };

  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    if (typeof onSuggestionSelect === 'function') {
      onSuggestionSelect();
    }
    setSuggestionSelected(true);
    if (suggestion.searchEntityType === 'region') {
      // For regions, use the existing location selection logic
      onChange(suggestion.name, suggestion.id as number);
    } else if (suggestion.searchEntityType === 'apartment') {
      // For hotels/apartments, use nameIncludes logic
      onChange(suggestion.name);
      if (onNameSearchChange) {
        onNameSearchChange(suggestion.name);
      }
      // Redirect logic for property
      const hid = suggestion.hid || suggestion.id;
      if (hid) {
        // Use searchParams if set, otherwise defaults
        let checkin = searchParams.checkin;
        let checkout = searchParams.checkout;
        let guests = searchParams.guests;
        const today = new Date();
        if (!checkin) {
          const checkinDate = new Date(today);
          checkinDate.setDate(today.getDate() + 5);
          checkin = checkinDate.toISOString().slice(0, 10);
        }
        if (!checkout) {
          const checkoutDate = new Date(today);
          checkoutDate.setDate(today.getDate() + 7);
          checkout = checkoutDate.toISOString().slice(0, 10);
        }
        if (!guests || typeof guests !== 'object' || !('adults' in guests)) {
          guests = { adults: 1, children: [] };
        }
        const url = resolveUrl(RoutePaths.PROPERTY.replace(':id', String(hid)), {
          checkin,
          checkout,
          guests,
        });
        navigate(url);
      }
    }
    setIsOpen(false);
  };

  // When dropdown closes and no suggestion was selected, treat input as userIncludes
  useEffect(() => {
    if (!isOpen) {
      // Only set if input is non-empty and no suggestion was selected
      if (!suggestionSelected && value && value.trim() !== '') {
        onNameSearchChange?.(value);
      }
      // Reset for next open
      setSuggestionSelected(false);
    }
  }, [isOpen]);

  const getIcon = (suggestion: SearchSuggestion) => {
    return suggestion.searchEntityType === 'region' 
      ? <MapPinIcon className="w-4 h-4 text-[#A9A9A9]" />
      : <HomeModernIcon className="w-4 h-4 text-[#A9A9A9]" />;
  };

  const getSubtitle = (suggestion: SearchSuggestion) => {
    if (suggestion.searchEntityType === 'region') {
      return suggestion.countryName;
    } else {
      return suggestion.address || suggestion.category;
    }
  };

  const showPlaceholder = !isOpen && !value;

  return (
    <View className={`relative text-white rounded-full ${className}`}>
      <View
        className={`flex items-center pl-4 py-2 border cursor-pointer w-full !min-w-48 relative z-10 ${
          (isOpen && suggestions.length) || isLoading ? 'rounded-t-3xl border-transparent' : 'border-[#555555] rounded-3xl'
        } ${innerClassName} ${(isOpen || value) ? activeBackgroundColor : backgroundColor}`}
        onClick={() => setIsOpen(true)}
      >
        <MapPinIcon className="w-5 h-5 mr-3 text-[#A9A9A9] shrink-0" />
        
        <View className={`relative flex-grow`}>
          <input
            ref={inputRef}
            type="text"
            className={`w-full text-base bg-transparent outline-none`}
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
          />
        </View>
          
        {showPlaceholder && (
          <View className="flex absolute inset-0 left-12 items-center pointer-events-none font-secondary">
            </Text className="text-sm text-[#E6E6E6] font-medium max-md:hidden">search destination</Text>
            </Text className="text-sm text-[#E6E6E6] font-medium md:hidden">search destination</Text>
          </View>
        )}

        {value && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onChange('');
              if (onNameSearchChange) {
                onNameSearchChange('');
              }
              inputRef.current?.focus();
              setIsOpen(true);
            }}
            className="p-1.5 ml-0.5 mr-1 rounded-full right-4 hover:bg-black/40"
          >
            <XMarkIcon className="w-2.5 h-2.5 text-white" />
          </Button>
        )}
      </View>

      {/* Search Suggestions Dropdown */}
      <Dropdown 
        isOpen={isOpen && suggestions.length > 0 || isLoading}
        onClose={() => setIsOpen(false)}
        className="w-full bg-[#303030] rounded-b-lg shadow-lg max-h-[364px] overflow-y-auto !mt-0"
      >
        {isLoading && (
          <View className="flex justify-center items-center px-4 py-6">
            <LoadingIcon className='animate-spin size-6' />
          </View>
        )}
        {!isLoading && suggestions.length === 0 && (
          <View className="flex justify-center items-center px-4 py-6 text-[#A9A9A9] text-sm">
            No locations found
          </View>
        )}
        {!isLoading && suggestions.map((suggestion) => (
          <View
            key={`${suggestion.searchEntityType}-${suggestion.id}`}
            className="flex items-center px-4 py-2 gap-x-3 cursor-pointer hover:bg-[#444444]"
            onClick={() => handleSuggestionSelect(suggestion)}
          >
            <View className='!w-4'>
              {getIcon(suggestion)}
            </View>
            <View className="flex flex-col truncate">
              <Text className="text-sm">{suggestion.name}</Text>
              <Text className="text-xs text-gray-400">{getSubtitle(suggestion)}</Text>
            </View>
          </View>
        ))}
      </Dropdown>
    </View>
  );
} 
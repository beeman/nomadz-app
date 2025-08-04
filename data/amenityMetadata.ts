import { FC } from 'react'
import { InfoCircleIcon, SnowflakeIcon, WiFiIcon } from '../components/icons/Icons'

import {
  ArrowPathIcon,
  ArrowsRightLeftIcon,
  BanknotesIcon,
  BeakerIcon,
  BellIcon,
  BoltIcon,
  BuildingOfficeIcon,
  BuildingStorefrontIcon,
  CameraIcon,
  ComputerDesktopIcon,
  CurrencyDollarIcon,
  FireIcon,
  GiftIcon,
  GlobeAltIcon,
  HeartIcon,
  HomeIcon,
  KeyIcon,
  LockClosedIcon,
  NewspaperIcon,
  NoSymbolIcon,
  PhoneArrowUpRightIcon,
  PrinterIcon,
  ShieldCheckIcon,
  SparklesIcon,
  Square3Stack3DIcon,
  TicketIcon,
  TrophyIcon,
  TruckIcon,
  TvIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'

interface AmenityMetadata {
  description: string
  icon: FC
}

/**
 * Metadata for property amenities including descriptions and icons.
 * Used to display amenity details consistently across the application.
 */
export const AMENITY_METADATA: Record<string, AmenityMetadata> = {
  // General amenities
  'Air conditioning': {
    description: 'Enjoy a comfortable stay with climate control',
    icon: SnowflakeIcon,
  },
  Heating: {
    description: 'Stay cozy with adjustable heating system',
    icon: FireIcon,
  },
  WiFi: {
    description: 'Stay connected with free high-speed internet',
    icon: WiFiIcon,
  },
  Parking: {
    description: 'Free on-site parking for your convenience',
    icon: HomeIcon,
  },
  'Reception desk': {
    description: 'Front desk service for your needs',
    icon: BuildingOfficeIcon,
  },
  'Express check-in/check-out': {
    description: 'Quick and efficient check-in and check-out process',
    icon: KeyIcon,
  },
  'Private check-in/check-out': {
    description: 'Personalized private check-in and check-out service',
    icon: KeyIcon,
  },
  'Elevator/lift': {
    description: 'Easy access to all floors',
    icon: ArrowsRightLeftIcon,
  },
  ATM: {
    description: 'Convenient on-site ATM access',
    icon: BanknotesIcon,
  },
  'Currency exchange': {
    description: 'Currency exchange service available',
    icon: CurrencyDollarIcon,
  },
  'Gift shop': {
    description: 'Browse our on-site gift shop',
    icon: GiftIcon,
  },
  Garden: {
    description: 'Beautiful garden area for relaxation',
    icon: SparklesIcon,
  },
  Terrace: {
    description: 'Outdoor terrace for relaxation',
    icon: HomeIcon,
  },
  'Electric car charging': {
    description: 'Charging stations for electric vehicles',
    icon: BoltIcon,
  },

  // Safety & Security
  'Security guard': {
    description: '24/7 security personnel on premises',
    icon: ShieldCheckIcon,
  },
  'Fire Extinguisher': {
    description: 'Safety equipment readily available',
    icon: FireIcon,
  },
  'Smoke-free property': {
    description: 'Entirely smoke-free environment',
    icon: NoSymbolIcon,
  },
  CCTV: {
    description: 'Security cameras in common areas',
    icon: CameraIcon,
  },
  Safe: {
    description: 'In-room safe for your valuables',
    icon: LockClosedIcon,
  },

  // Room amenities
  TV: {
    description: 'Flat-screen TV with cable channels',
    icon: TvIcon,
  },
  'Television in lobby': {
    description: 'Entertainment available in common areas',
    icon: TvIcon,
  },
  Minibar: {
    description: 'Well-stocked minibar in your room',
    icon: BeakerIcon,
  },
  'Room service': {
    description: '24-hour room service available',
    icon: BellIcon,
  },
  Hairdryer: {
    description: 'Hairdryer provided in bathroom',
    icon: BoltIcon,
  },
  Iron: {
    description: 'Iron and ironing board available',
    icon: SparklesIcon,
  },

  // Dining amenities
  Restaurant: {
    description: 'On-site restaurant with diverse menu',
    icon: BuildingStorefrontIcon,
  },
  Bar: {
    description: 'Enjoy drinks at our stylish bar',
    icon: BeakerIcon,
  },
  Breakfast: {
    description: 'Fresh breakfast served daily',
    icon: Square3Stack3DIcon,
  },
  Kitchen: {
    description: 'Fully equipped kitchen for meal preparation',
    icon: HomeIcon,
  },
  'Coffee/tea': {
    description: 'Complimentary coffee and tea facilities',
    icon: BeakerIcon,
  },

  // Wellness amenities
  'Fitness facilities': {
    description: 'Modern fitness center equipment',
    icon: TrophyIcon,
  },
  'Swimming pool': {
    description: 'Indoor swimming pool',
    icon: SparklesIcon,
  },
  Spa: {
    description: 'Relaxing spa treatments available',
    icon: HeartIcon,
  },
  Sauna: {
    description: 'Rejuvenating sauna facilities',
    icon: FireIcon,
  },

  // Business amenities
  'Business center': {
    description: 'Fully equipped business center',
    icon: ComputerDesktopIcon,
  },
  'Conference Hall': {
    description: 'Meeting and event spaces available',
    icon: UserGroupIcon,
  },
  'Fax and copy machine': {
    description: 'Business services including fax and copy',
    icon: PrinterIcon,
  },

  // Additional amenities
  Laundry: {
    description: 'Laundry and dry-cleaning service',
    icon: ArrowPathIcon,
  },
  'Concierge services': {
    description: 'Helpful concierge for local recommendations',
    icon: PhoneArrowUpRightIcon,
  },
  'Luggage storage': {
    description: 'Secure luggage storage available',
    icon: Square3Stack3DIcon,
  },
  Newspapers: {
    description: 'Daily newspapers available',
    icon: NewspaperIcon,
  },
  'Ticket assistance': {
    description: 'Help with booking tickets and tours',
    icon: TicketIcon,
  },
  'Tour desk': {
    description: 'Assistance with tour bookings and information',
    icon: GlobeAltIcon,
  },
  'Vending machine': {
    description: '24/7 access to snacks and beverages',
    icon: BuildingStorefrontIcon,
  },
  'Shared lounge': {
    description: 'Comfortable common area for relaxation',
    icon: UserGroupIcon,
  },
  'Designated smoking area': {
    description: 'Dedicated area for smokers',
    icon: NoSymbolIcon,
  },
  'Facilities for disabled guests': {
    description: 'Accessible accommodations and facilities',
    icon: HeartIcon,
  },
  'Airport shuttle': {
    description: 'Convenient transportation to/from airport',
    icon: TruckIcon,
  },
  'Bicycle rental': {
    description: 'Explore the area on two wheels',
    icon: InfoCircleIcon,
  },
  'Car rental': {
    description: 'Vehicle rental service available',
    icon: TruckIcon,
  },
}

export const DEFAULT_AMENITY_METADATA: AmenityMetadata = {
  description: 'Additional amenity for your comfort',
  icon: InfoCircleIcon,
}

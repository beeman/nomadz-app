import googleMapStyles from '@/styles/google_map.styles'
import { Libraries } from '@react-google-maps/api'

export const defaultMapOptions: google.maps.MapOptions = {
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  clickableIcons: false,
  zoomControl: true,
  gestureHandling: 'greedy',
  styles: googleMapStyles,
}

export const mapLoaderOptions = {
  id: 'google-map-script',
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  libraries: ['geometry'] as Libraries,
}

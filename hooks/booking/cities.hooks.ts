import { useAtom, useSetAtom } from 'jotai';
import { fetchLocationByRegionId, selectedLocationAtom } from '../../storage/booking/cities.storage';

export const useLocation = () => {
  const [selectedLocation, setSelectedLocation] = useAtom(selectedLocationAtom);
  const fetchLocation = useSetAtom(fetchLocationByRegionId);

  return {
    selectedLocation,
    setSelectedLocation,
    fetchLocation,
  };
};
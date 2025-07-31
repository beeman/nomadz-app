import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useState } from 'react';

const containerStyle: React.CSSProperties = {
  width: 'auto',
  height: window.innerWidth >= 1024 ? '100%' : 'calc(100dvh - 208px)',
  minHeight: '300px',
  borderRadius: '14px',
  border: '1px solid #292929',
};

interface PropertiesMapProps {
  properties: ApartmentsItemInfo[];
  isLoading: boolean;
  onRefetchNeeded?: number;
}

/**
 * PropertiesMap component displays an interactive Google Map with property locations.
 * Each property is represented by a clickable price button overlay that, when clicked,
 * reveals a detailed property card. This allows users to browse and explore properties
 * directly on the map interface, seeing both their geographical location and key details.
 * 
 * The map dynamically loads properties within the current viewport bounds and updates
 * as the user pans/zooms. Property cards adapt their position based on the button's 
 * placement and proximity to map edges to maintain visibility.
 */
function PropertiesMap({ properties, isLoading, onRefetchNeeded }: PropertiesMapProps) {
  const { isLoaded } = useJsApiLoader(mapLoaderOptions);
  
  const { selectedLocation } = useLocation();
  const { getCombinedParams } = useSearchParams();
  const { fetchBookingApartments } = useApartments();
  
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [openPropertyId, setOpenPropertyId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [routerSearchParams] = useRouterSearchParams();
  
  const initialCenter = React.useMemo(() => {
    const parsedParams = parseQueryParams(routerSearchParams.toString());
    
    return {
      center: {
        lat: Number(parsedParams.latitude) || selectedLocation?.center.latitude || 38.7223,
        lng: Number(parsedParams.longitude) || selectedLocation?.center.longitude || -9.1393
      },
      zoom: Number(parsedParams.zoom) || 12
    };
  }, [selectedLocation, routerSearchParams]);

  const [mapCenter, setMapCenter] = useState(initialCenter.center);
  const [mapZoom, setMapZoom] = useState(initialCenter.zoom);

  const parsedParams = parseQueryParams(routerSearchParams.toString());
  
  const handleBoundsChanged = useCallback(
    debounce(() => {
      fetchData()
    }, 500),
    [map, getCombinedParams, fetchBookingApartments]
  );

  const onLoad = React.useCallback((map: google.maps.Map): void => {
    setMap(map);
    
    // Add listener for when map is fully initialized
    const listener = map.addListener('idle', () => {
      // Remove listener after first execution
      listener.remove();
      
      if (!properties.length) {
        // Small delay to ensure bounds are properly set
        setTimeout(() => {
          const bounds = map.getBounds();
          const center = map.getCenter();
          const ne = bounds?.getNorthEast();
            
          if (bounds && center && ne) {
            const radius = google.maps.geometry.spherical.computeDistanceBetween(
              center,
              new google.maps.LatLng(ne.lat(), ne.lng())
            );

            const currentParams = getCombinedParams();
            delete currentParams.regionId;
              
            if (!Math.round(radius)) return;

            console.log('fetch from onLoad', currentParams)
            fetchBookingApartments({
              ...currentParams,
              latitude: center.lat(),
              longitude: center.lng(),
              radius: Math.round(radius)
            });
          }
        }, 100); // Small delay to let bounds settle
      }
    });
  }, [getCombinedParams, fetchBookingApartments]);

  const onUnmount = React.useCallback((): void => {
    setMap(null);
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      setMapCenter({
        lat: selectedLocation.center.latitude,
        lng: selectedLocation.center.longitude
      });
    }
  }, [selectedLocation]);

  useEffect(() => {
    return () => {
      handleBoundsChanged.cancel();
    };
  }, []);
  
  const fetchData = async () => {
    if (map) {
      const center = map.getCenter();
      const bounds = map.getBounds();
      const ne = bounds?.getNorthEast();
      const zoom = map.getZoom();
      
      if (center && bounds && ne) {
        // Update URL with current map center coordinates and zoom
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('latitude', center.lat().toString());
        searchParams.set('longitude', center.lng().toString());
        searchParams.set('zoom', zoom?.toString() || '12');
        window.history.replaceState(null, '', `?${searchParams.toString()}`);
        
        const radius = google.maps.geometry.spherical.computeDistanceBetween(
          center,
          new google.maps.LatLng(ne.lat(), ne.lng())
        );

        const { regionId, ...fetchParams} = parsedParams
        
        if (Math.round(radius)) {
          console.log('fetch from fetchData')
          await fetchBookingApartments({
            ...fetchParams,
            latitude: center.lat(),
            longitude: center.lng(),
            radius: Math.round(radius)
          });
        }
      }
    }
  };

  const handleMapClick = () => {
    if (!isDragging) {
      setOpenPropertyId(null);
    }
  };

  useEffect(() => {
    if (onRefetchNeeded) {
      fetchData();
    }
  }, [onRefetchNeeded, map]);
  
  if (!isLoaded) return (
    <View className='flex items-center justify-center w-full h-full'>
      <LoadingIcon className='size-6 animate-spin' />
    </View>
  );

  return (
    <View className="relative w-full h-full" onClick={handleMapClick}>
      {mapCenter && <GoogleMap
        mapContainerStyle={containerStyle}
        options={defaultMapOptions}
        center={mapCenter}
        zoom={mapZoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => {
          handleBoundsChanged();
          setTimeout(() => setIsDragging(false), 0);
        }}
        onZoomChanged={handleBoundsChanged}
      >
        {properties.slice(0, 48).map((property) => (
          <OverlayViewF
            key={property.hid}
            position={{ lat: property.latitude, lng: property.longitude }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <PropertyMapButton 
              property={property} 
              isOpen={openPropertyId === property?.hid.toString()}
              onClick={() => setOpenPropertyId(property?.hid.toString())}
              map={map}
            />
          </OverlayViewF>
        ))}
      </GoogleMap>}
      
      {isLoading && (
        <View className="absolute px-4 py-2 text-sm text-white -translate-x-1/2 rounded-full bg-black/80 top-4 left-1/2">
          Loading properties...
        </View>
      )}
    </View>
  );
}

export default React.memo(PropertiesMap);
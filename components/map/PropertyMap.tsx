import googleMapStyles from '@/styles/google_map.styles'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import MapView, { Marker } from 'react-native-maps'

interface PropertyMapProps {
  latitude: number
  longitude: number
}

/**
 * PropertyMap component displays a single property location on a native map.
 * It centers the map on the provided coordinates and shows a marker at that location.
 */
export default function PropertyMap({ latitude, longitude }: PropertyMapProps) {
  return (
    <View style={styles.container}>
      <MapView
        provider="google"
        style={styles.map}
        customMapStyle={googleMapStyles}
        zoomControlEnabled={true}
        rotateEnabled={false}
        scrollEnabled={true}
        zoomEnabled={true}
        showsUserLocation={false}
        showsMyLocationButton={false}
        toolbarEnabled={false}
        initialCamera={{ center: { latitude, longitude }, zoom: 14, heading: 0, pitch: 0 }}
      >
        <Marker coordinate={{ longitude, latitude }} />
      </MapView>
      {/* <GoogleMaps.View
        style={styles.map}
        colorScheme={}
        uiSettings={{
          zoomControlsEnabled: true,
          rotationGesturesEnabled: false,
          scrollGesturesEnabled: true,
          zoomGesturesEnabled: true,
          myLocationButtonEnabled: false,
          mapToolbarEnabled: false,
        }}
        cameraPosition={{
          coordinates: {
            latitude,
            longitude,
          },
        }}
        markers={[{ coordinates: { latitude, longitude } }]}
      /> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 11,
    borderTopRightRadius: 11,
    overflow: 'hidden',
    width: '100%',
    height: '100%',
  },
  map: {
    flex: 1,
  },
})

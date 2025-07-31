import { GoogleMaps } from 'expo-maps'
import React from 'react'
import { StyleSheet, View } from 'react-native'

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
      <GoogleMaps.View
        style={styles.map}
        cameraPosition={{
          coordinates: {
            latitude,
            longitude,
          },
        }}
        markers={[{ coordinates: { latitude, longitude } }]}
        // customMapStyle={googleMapStyles}
        // zoomControlEnabled={true}
        // zoomEnabled={true}
        // scrollEnabled={true}
        // rotateEnabled={false}
        // showsUserLocation={false}
        // showsMyLocationButton={false}
        // toolbarEnabled={false}
      />
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

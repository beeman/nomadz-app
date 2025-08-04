import React, { FC, PropsWithChildren, useEffect, useRef } from 'react'
import { Animated, Easing } from 'react-native'

export interface SpinnerProps extends PropsWithChildren {
  duration?: number
}

const Spinner: FC<SpinnerProps> = ({ children, ...props }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: props.duration || 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start()
  }, [rotateAnim])

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  return <Animated.View style={{ transform: [{ rotate: spin }] }}>{children}</Animated.View>
}

export default Spinner

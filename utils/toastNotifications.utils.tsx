import React, { createContext, FC, PropsWithChildren, useContext, useEffect, useRef, useState } from 'react'
import { Animated, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Svg, { Circle, G, Path } from 'react-native-svg'
import { ToastConfigParams } from 'react-native-toast-message'
import { v4 as uuidv4 } from 'uuid'

type ToastType = 'success' | 'error' | 'info'

interface CustomToastProps extends Partial<ToastConfigParams<any>> {
  type: ToastType
  title: string
  message: string
}

const CheckIconSvg = () => (
  <Svg width="12" height="10" viewBox="0 0 12 10" fill="none">
    <Path
      d="M1.33398 5.66699L4.00065 8.33366L10.6673 1.66699"
      stroke="#C5FFD7"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)

const XIconSvg = () => (
  <Svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <Path d="M8.99997 1.00003L1 9M0.999966 1L8.99993 8.99997" stroke="#FFF2F2" strokeWidth="2" strokeLinecap="round" />
  </Svg>
)

const InfoIconSvg = () => (
  <Svg width="19" height="18" viewBox="0 0 19 18" fill="none">
    <G>
      <Path
        d="M9.5 12V9M9.5 6H9.5075M17 9C17 13.1421 13.6421 16.5 9.5 16.5C5.35786 16.5 2 13.1421 2 9C2 4.85786 5.35786 1.5 9.5 1.5C13.6421 1.5 17 4.85786 17 9Z"
        stroke="#CFEDFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
  </Svg>
)

const config = {
  success: {
    background: '#0a0a0a',
    iconBg: '#19A055',
    Icon: CheckIconSvg,
  },
  error: {
    background: '#0a0a0a',
    iconBg: '#FF5858',
    Icon: XIconSvg,
  },
  info: {
    background: '#0a0a0a',
    iconBg: '#1A7EBC',
    Icon: InfoIconSvg,
  },
}

const RoutePaths = {
  BUG_REPORTS: 'your_bug_report_url',
}

const BugIcon = () => (
  <Svg width="14" height="12" viewBox="0 0 14 12" fill="none">
    <Circle cx="7" cy="6" r="5.5" stroke="#FF5858" strokeWidth="1" />
    <Path d="M7 3V6M7 9H7.0075" stroke="#FF5858" strokeWidth="1" strokeLinecap="round" />
  </Svg>
)

const ToastContext = createContext<any>(null)
export const useToasts = () => useContext(ToastContext)

export const ToastProvider: FC<PropsWithChildren> = ({ children }) => {
  const [toasts, setToasts] = useState<any[]>([])

  const showToast = (type: ToastType, title: string, message: string) => {
    const id = uuidv4()
    setToasts((prev) => [...prev, { id, type, title, message }])

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 3000)
  }

  const hideToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  useEffect(() => {
    setToastHandler(showToast)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <View pointerEvents="box-none" className="flex flex-col gap-3" style={styles.toastContainer}>
        {toasts.slice(0, 5).map(({ id, type, title, message }) => (
          <CustomToast key={id} type={type} title={title} message={message} hide={() => hideToast(id)} />
        ))}
      </View>
    </ToastContext.Provider>
  )
}

export function CustomToast({ type, title, message, hide }: CustomToastProps) {
  const opacity = useRef(new Animated.Value(0)).current
  const translateX = useRef(new Animated.Value(300)).current // start offscreen right
  const [visible, setVisible] = useState(true)

  const { background, iconBg, Icon } = config[type]

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  const onClose = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false)
      hide?.()
    })
  }

  const handleReportBug = () => {
    Linking.openURL('https://example.com/bug-reports?open=true')
  }

  if (!visible) return null

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          transform: [{ translateX }],
          backgroundColor: background,
        },
      ]}
    >
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        {type === 'error' && (
          <TouchableOpacity onPress={handleReportBug} style={styles.reportBugContainer}>
            <BugIcon />
            <Text style={styles.reportBugText}>Report bug</Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity onPress={onClose} style={[styles.closeButton, { backgroundColor: iconBg }]}>
        <Icon />
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderRadius: 16,
    minWidth: 360,
    borderWidth: 1,
    borderColor: '#282828',
    position: 'relative',
  },
  toastContainer: {
    elevation: 10,
    position: 'absolute',
    top: 40,
    width: '100%',
    alignItems: 'center',
    zIndex: 9999,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'Geist-SemiBold',
    fontSize: 16,
    lineHeight: 22.4,
    color: 'white',
  },
  message: {
    fontFamily: 'Geist-Regular',
    fontSize: 12,
    lineHeight: 19.2,
    color: 'white',
  },
  reportBugContainer: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportBugText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '500',
    textDecorationLine: 'underline',
    color: '#FF5858',
  },
  closeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    width: 32,
    height: 32,
    borderWidth: 0,
  },
})

type ToastHandler = (type: ToastType, title: string, message: string) => void

let toastHandler: ToastHandler | null = null

export const setToastHandler = (handler: ToastHandler) => {
  toastHandler = handler
}

const toastNotifications = {
  success: (title: string, details: string = '') => {
    if (toastHandler) {
      toastHandler('success', title, details)
    } else {
      console.warn('Toast handler is not set')
    }
  },
  error: (title: string, details: string = '') => {
    if (toastHandler) {
      toastHandler('error', title, details)
    } else {
      console.warn('Toast handler is not set')
    }
  },
  info: (title: string, details: string = '') => {
    if (toastHandler) {
      toastHandler('info', title, details)
    } else {
      console.warn('Toast handler is not set')
    }
  },
}

export default toastNotifications

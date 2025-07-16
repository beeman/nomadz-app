import 'react-native-get-random-values'
import '@ethersproject/shims'
import { Buffer } from 'buffer'
import { getRandomValues as expoCryptoGetRandomValues } from 'expo-crypto'
import 'fast-text-encoding'

global.Buffer = Buffer

// getRandomValues polyfill
class Crypto {
  getRandomValues = expoCryptoGetRandomValues
}

const webCrypto = typeof crypto !== 'undefined' ? crypto : new Crypto()

;(() => {
  if (typeof crypto === 'undefined') {
    Object.defineProperty(window, 'crypto', {
      configurable: true,
      enumerable: true,
      get: () => webCrypto,
    })
  }
})()

/** @type {import('tailwindcss').Config} */
const containerQueries = require('@tailwindcss/container-queries')

module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ['components/**/*.{js,jsx,ts,tsx}', 'app/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        'primary-thin': ['Epilogue_100Thin', 'sans-serif'],
        'primary-extralight': ['Epilogue_200ExtraLight', 'sans-serif'],
        'primary-light': ['Epilogue_300Light', 'sans-serif'],
        primary: ['Epilogue_400Regular', 'sans-serif'],
        'primary-medium': ['Epilogue_500Medium', 'sans-serif'],
        'primary-semibold': ['Epilogue_600SemiBold', 'sans-serif'],
        'primary-bold': ['Epilogue_700Bold', 'sans-serif'],
        'primary-extrabold': ['Epilogue_800ExtraBold', 'sans-serif'],
        'primary-black': ['Epilogue_900Black', 'sans-serif'],
        sans: ['Epilogue_400Regular', 'sans-serif'],
        'sans-medium': ['Epilogue_500Medium', 'sans-serif'],
        'sans-bold': ['Epilogue_700Bold', 'sans-serif'],
        secondary: ['Epilogue', 'sans-serif'],
        sherman: ['Sherman', 'sans-serif'],
        geist: ['Geist', 'sans-serif'],
        glory: ['Glory', 'sans-serif'],
        ocr: ['Ocr', 'sans-serif'],
      },
      colors: {
        primary: '#646cff',
        'alert-red': '#FF5858',
        'alert-green': '#96FFA4',
      },
      screens: {
        '3xl': '1860px',
      },
      backgroundImage: {
        'gradient-1213': 'linear-gradient(to bottom right, #121212 0%, #131313 100%)',
      },
      boxShadow: {
        'inner-bottom': 'inset 0 -2.56px 1.28px rgba(0, 0, 0, 0.25)',
      },
      zIndex: {
        100: '100',
        200: '200',
      },
    },
  },
  plugins: [containerQueries],
} /** @type {import('tailwindcss').Config} */

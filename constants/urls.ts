import { RoutePaths } from "../enums"

const baseUrl: string = import.meta.env.VITE_ENV === 'production' ? import.meta.env.VITE_FRONTEND_URL : import.meta.env.VITE_FRONTEND_URL_DEV

export const Urls = {
  Referral: `${baseUrl}${RoutePaths.SIGN_UP}`,
}
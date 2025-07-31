export enum Routes {
  Search = 'search',
  ApartmentDetails = 'search/:id',
}

export type RootStackParamList = {
  Profile: { userId: string }
  Home: undefined
  [Routes.ApartmentDetails]: { id: string }
}

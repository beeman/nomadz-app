export interface BillingAddress {
  id: string;
  userBillingProfileId: string;
  fullName: string;
  state: string;
  country: string;
  city: string;
  street: string;
  postalCode: string;
}

export interface CreateBillingAddressDTO {
  userBillingProfileId: string;
  fullName: string;
  state: string;
  country: string;
  city: string;
  street: string;
  postalCode: string;
}

export interface UpdateBillingAddressDTO {
  fullName?: string;
  state?: string;
  country?: string;
  city?: string;
  street?: string;
  postalCode?: string;
}

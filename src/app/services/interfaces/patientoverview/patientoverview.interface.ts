export interface Patient {
  id: number;
  userid: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isActive: boolean;
  address: Address; // nested AddressDto
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
}

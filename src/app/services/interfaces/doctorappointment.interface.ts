export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  patient:Patient;
  appointmentTime: string;  // LocalDateTime is usually serialized as an ISO string
  status: string;
  visitInfo: VisitInfo;   // Reference to VisitInfo interface
}

export interface VisitInfo {
  id: number;
  appointmentId: number;
  checkInTime: string;   // LocalDateTime is usually serialized as an ISO string
  checkOutTime: string;  // LocalDateTime is usually serialized as an ISO string
  notes: string;
}

export interface Patient {
  id: number;
  userid: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: Address; // nested AddressDto
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
}

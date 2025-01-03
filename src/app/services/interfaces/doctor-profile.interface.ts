// doctor-profile.interface.ts
import {Validators} from '@angular/forms';

export interface DoctorAvailability {
  availableDays: string;        // e.g., "Mon,Fri,Tues,Wed,Thurs,Sat"
  availableFrom: string;        // e.g., "09:00"
  availableUntil: string;       // e.g., "17:00"
}



export interface Doctor {
  id: number;
  userid: number;
  email: string;
  firstName: string;
  lastName: string;
  specialization: string;
  phone: string;
  isActive: boolean;
  availability: DoctorAvailability;
}

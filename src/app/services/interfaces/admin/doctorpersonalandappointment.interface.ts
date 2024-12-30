// doctor-profile.interface.ts
import {Validators} from '@angular/forms';
import {Appointment} from '../doctorappointment.interface';
import {DoctorAvailability} from '../doctor-profile.interface';



export interface Doctorpersonalandappointment {
  id: number;
  userid: number;
  firstName: string;
  lastName: string;
  appointment:Appointment[];
  availability:DoctorAvailability;
}

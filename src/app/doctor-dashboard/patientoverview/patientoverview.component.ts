import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Appointment, Patient} from '../../services/interfaces/doctorappointment.interface';
import { Diagnosis, FamilyHistory, Prescription } from '../../services/interfaces/medicalrecords/medicalrecords.interface';
import { PatientoverviewService } from '../../services/patientoverview/patientoverview.service';
import { AppointmentService } from '../../services/patientoverview/appointmentshare.service';
import { Subscription } from 'rxjs';
import { MatCard, MatCardContent, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import {MatList, MatListItem, MatListModule} from '@angular/material/list';
import { CommonModule, DatePipe } from '@angular/common';
import {MatIconButton} from '@angular/material/button';
import {MatFormField, MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule, MatLabel} from '@angular/material/input';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {LoadingComponent} from '../../loading/loading.component';
import {MatSidenavContainer, MatSidenavModule} from '@angular/material/sidenav';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import {MatToolbar} from '@angular/material/toolbar';

@Component({
  selector: 'patientoverview',
  templateUrl: './patientoverview.component.html',
  standalone: true,
  imports: [
    MatSidenavModule, CommonModule, MatLabel, MatCardSubtitle, MatCardTitle, MatExpansionPanelTitle,
    MatExpansionPanelHeader,
    MatCard,
    MatIcon,
    MatCardContent,
    MatTabGroup,
    MatTab,
    MatList,
    MatListItem,
    ReactiveFormsModule,
    DatePipe,
    MatIconButton,
    MatFormField, MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatNativeDateModule, LoadingComponent, MatSidenavContainer, MatExpansionPanel, MatAccordion, MatExpansionPanelTitle, MatToolbar,
  ],
  styleUrls: ['./patientoverview.component.css']
})
export class PatientoverviewComponent implements OnInit, OnDestroy {

  selectedAppointment: Appointment | null | undefined;
  patientDetails: Patient | undefined;

  familyHistory: FamilyHistory[] = [];
  prescriptions: Prescription[] = [];
  diagnoses: Diagnosis[] = [];
  appointmentvisitinfo: Appointment[]=[];

  familyHistoryForm: FormGroup;
  prescriptionForm: FormGroup;
  diagnosisForm: FormGroup;

  visitNotesForm: FormGroup;


  familyHistoryLoaded: boolean = false;
  appointmentvisitinfoLoaded: boolean=false;
  prescriptionsLoaded: boolean = false;
  diagnosesLoaded: boolean = false;

  private subscriptions: Subscription = new Subscription();
  activeTab: number = 0;

  private _errorMessage: string = '';
  timeoutHandle: any;

  // Getter for errorMessage
  get errorMessage(): string {
    return this._errorMessage;
  }

  // Setter for errorMessage
  set errorMessage(value: string) {
    this._errorMessage = value;

    if (value) {
      // Clear any existing timeout to avoid multiple timers
      clearTimeout(this.timeoutHandle);

      // Set a timeout to clear the message after 4 seconds
      this.timeoutHandle = setTimeout(() => {
        this._errorMessage = '';
      }, 5000);
    }
  }

  constructor(
    private appointmentshareservice: AppointmentService,
    private patientoverviewService: PatientoverviewService,
    private fb: FormBuilder
  ) {
    this.visitNotesForm = this.fb.group({
      checkInTime: [''],
      checkOutTime: [''],
      notes: ['',[Validators.required]],
    });
    this.familyHistoryForm = this.fb.group({
      condition: ['',[Validators.required]],
      relationship: ['',[Validators.required]]
    });
    this.prescriptionForm = this.fb.group({
      medicationName: ['',[Validators.required]],
      dosage: ['',[Validators.required]],
      instructions:[''],
      frequency: ['']
    });
    this.diagnosisForm = this.fb.group({
      condition: ['',[Validators.required]],
      symptoms: [''],
      diagnosticNotes: ['',[Validators.required]]
    });
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.appointmentshareservice.selectedAppointment$.subscribe({
        next: (appointment) => {
          this.selectedAppointment = appointment;
        },
        error: (error) => this.errorMessage='Error Getting the Appointment Details'
      })
    );
    this.patientDetails=this.selectedAppointment?.patient;

    }

  onBackButtonClick(): void {
    // Clear selected appointment and patient overview flag
    this.appointmentshareservice.clearSelectedAppointment();
    this.appointmentshareservice.clearShowPatientOverview();
    this.familyHistoryLoaded = false;
    this.prescriptionsLoaded = false;
    this.appointmentvisitinfoLoaded=false;
    this.diagnosesLoaded = false;
    this.familyHistory = [];
    this.prescriptions = [];
    this.diagnoses = [];
    this.appointmentvisitinfo=[]
    this.patientDetails = undefined;
  }


  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  resetForms() {
    this.familyHistoryForm.reset();
    this.prescriptionForm.reset();
    this.diagnosisForm.reset();
  }

   selectTab(tabnumber: number): void {

    const tabIndex = tabnumber;
    this.activeTab = tabIndex;
    const patientId = this.selectedAppointment?.patientId;
    if (!patientId) return;
    this.resetForms();
    switch (tabIndex) {
      case 1: // Family History
        this.familyHistoryLoaded=false;
          this.subscriptions.add(
            this.patientoverviewService.getPatientFamilyHistory(patientId).subscribe({
              next: (data) => {
                this.familyHistory = data;
              },
              error: (error) => this.errorMessage='Error fetching family history'
            })
          );
        this.familyHistoryLoaded = true;

        break;
      case 2: // Prescription
        this.prescriptionsLoaded=false;
          this.subscriptions.add(
            this.patientoverviewService.getPatientPrescriptions(patientId).subscribe({
              next: (data) => {
                this.prescriptions = data;
              },
              error: (error) => this.errorMessage='Error fetching prescriptions'
            })
          );
        this.prescriptionsLoaded = true;


        break;
      case 3: // Diagnosis
        this.diagnosesLoaded=false;
          this.subscriptions.add(
            this.patientoverviewService.getPatientDiagnosis(patientId).subscribe({
              next: (data) => {
                this.diagnoses = data;

              },
              error: (error) => this.errorMessage='Error fetching diagnoses'
            })
          );
        this.diagnosesLoaded = true;
        break;
        case 4: //patient visit info
        this.appointmentvisitinfoLoaded=false;
        this.subscriptions.add(
          this.patientoverviewService.getPatientPreviousVisits(patientId).subscribe({
            next: (data) => {
              this.appointmentvisitinfo = data.map(appointment => ({
                ...appointment,
                visitInfo: {
                  ...appointment.visitInfo,
                  checkInTime: this.convertToDate(appointment.visitInfo?.checkInTime),
                  checkOutTime: this.convertToDate(appointment.visitInfo?.checkOutTime),
                },
              }));

            },
            error: (error) => this.errorMessage='Error fetching previous visit info'
          })
        );
          this.appointmentvisitinfoLoaded = true;
        break;
    }
  }

  submitFamilyHistory(): void {
    const patientId = this.selectedAppointment?.patientId;
    if (patientId) {
      const familyHistoryData = {
        ...this.familyHistoryForm.value,
        patientId: patientId
      };
      this.subscriptions.add(
        this.patientoverviewService.addFamilyHistory(familyHistoryData).subscribe({
          next: () => this.selectTab(1),
          error: (error) => this.errorMessage='Error submitting Family History'
        })
      );
    }
    this.familyHistoryForm.reset();
  }

  submitPrescription(): void {
    const patientId = this.selectedAppointment?.patientId;
    if (patientId) {
      const prescriptionData = {
        ...this.prescriptionForm.value,
        patientId: patientId
      };
      this.subscriptions.add(
        this.patientoverviewService.addPrescription(prescriptionData).subscribe({
          next: () => this.selectTab(2),
          error: (error) => this.errorMessage='Error submitting prescription'
        })
      );
    }
    this.prescriptionForm.reset();
  }

  submitDiagnosis(): void {
    const patientId = this.selectedAppointment?.patientId;
    if (patientId) {
      const diagnosisData = {
        ...this.diagnosisForm.value,
        patientId: patientId
      };
      this.subscriptions.add(
        this.patientoverviewService.addDiagnosis(diagnosisData).subscribe({
          next: () => this.selectTab(3),
          error: (error) => this.errorMessage='Error submitting diagnosis'
        })
      );
    }
    this.diagnosisForm.reset();
  }
  submitVisitNotes():void {
    const appoinmentid = this.selectedAppointment?.id;

    if (appoinmentid) {
      const visitnotesData = {
        ...this.visitNotesForm.value,
        appointmentId:appoinmentid
      };
      this.subscriptions.add(
        this.patientoverviewService.addVisitInfo(visitnotesData).subscribe({
          next: () => this.selectTab(4),
          error: (error) => this.errorMessage='Error submitting visit info'
        })
      );
    }
      this.visitNotesForm.reset();
  }


  private convertToDate(time: string | null): string{
    if (!time) return 'Not Available';

    const [hours, minutes, seconds] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert 0 or 12-hour to 12-hour clock
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  }

  protected capitalizeEachWord(value: string | undefined): string | undefined {
    if (!value) return value;
    return value.replace(/\b\w/g, char => char.toUpperCase());
  }

}

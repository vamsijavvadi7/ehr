
export interface Diagnosis {
  id?: number;
  patientId: number;
  condition?: string;
  symptoms?: string;
  diagnosticNotes?: string;
}

export interface FamilyHistory {
  id?: number;
  patientId: number;
  condition?: string;
  relationship?: string; // E.g., "Father", "Mother"
}

export interface Prescription {
  id?: number;
  patientId: number;
  medicationName?: string;
  dosage?: string;
  frequency?: string;
  instructions?: string;
}

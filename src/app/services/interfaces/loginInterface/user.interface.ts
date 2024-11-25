export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
  createdAt: string;  // Using string type for date in ISO format
  updatedAt: string;  // Same as above
  lastLogin: string | null;  // Nullable, can be string or null
  isActive: boolean;
}

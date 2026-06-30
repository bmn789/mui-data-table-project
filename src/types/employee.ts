export interface Address {
  city: string;
  state: string;
  country: string;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  role: string;
  salary: number;
  joinDate: string; // ISO format string (e.g. YYYY-MM-DD)
  isActive: boolean;
  skills: string[];
  address: Address;
  projects: number;
  lastReview: string; // ISO format string (e.g. YYYY-MM-DD)
  performanceRating: number; // e.g. 1.0 to 5.0
}

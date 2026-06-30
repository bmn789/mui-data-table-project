export interface User {
  id: string;
  name: string;
  email: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  role: string;
  country: string;
}

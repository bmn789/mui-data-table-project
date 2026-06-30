export interface Transaction {
  id: string;
  description: string;
  amount: number;
  paymentMethod: 'Card' | 'Bank' | 'UPI';
  isRefunded: boolean;
  createdAt: string;
  status: string;
  userId: string;
}

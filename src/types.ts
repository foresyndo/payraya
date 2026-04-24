export type TransactionType = 'transfer' | 'topup' | 'payment' | 'income';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  title: string;
  category: string;
  date: string;
  recipientId?: string;
  recipientName?: string;
  senderName?: string;
  bankName?: string;
  accountNumber?: string;
  senderAccountNumber?: string;
  note?: string;
  status: 'success' | 'failed' | 'pending';
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  balance: number;
  pin: string;
  isPaylaterActive?: boolean;
  paylaterLimit?: number;
  isBiometricEnabled?: boolean;
}

export type NotificationType = 'promo' | 'update' | 'transaction';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  date: string;
  isRead: boolean;
  imageUrl?: string;
  actionUrl?: string;
}

export type Screen = 'auth' | 'login' | 'register' | 'home' | 'transfer' | 'topup' | 'payment' | 'history' | 'profile' | 'deposito' | 'emoney' | 'paylater' | 'loan' | 'withdraw' | 'notifications' | 'qr';

export const COLORS = {
  primary: '#003A8F', // Navy Blue
  secondary: '#FFC107', // Golden Yellow
  background: '#F5F7FA', // Light Gray
  text: '#1F2937', // Dark Gray
  success: '#10B981',
  error: '#EF4444',
  muted: '#9CA3AF'
};

export const DUMMY_TRANSACTIONS = [
  {
    id: '1',
    userId: 'u1',
    type: 'income',
    amount: 5000000,
    title: 'Gaji Bulanan',
    category: 'Payroll',
    date: '2026-04-19T08:00:00Z',
    status: 'success'
  },
  {
    id: '2',
    userId: 'u1',
    type: 'payment',
    amount: 150000,
    title: 'Listrik PLN',
    category: 'Utilities',
    date: '2026-04-18T10:30:00Z',
    status: 'success'
  },
  {
    id: '3',
    userId: 'u1',
    type: 'transfer',
    amount: 250000,
    title: 'Transfer ke Budi',
    category: 'Social',
    date: '2026-04-17T15:45:00Z',
    status: 'success'
  }
];

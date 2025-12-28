// Mock data for the Tax Filing Portal

export type UserRole = 'client' | 'employee' | 'fbr';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  cnic: string;
  phone?: string;
  avatar?: string;
}

export interface TaxReturn {
  id: string;
  clientId: string;
  clientName: string;
  taxYear: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'objection';
  submittedDate?: string;
  totalIncome: number;
  totalTax: number;
  documents: File;
  lastUpdated: string;
}

export interface InfoRequest {
  id: string;
  clientId: string;
  clientName: string;
  returnId: string;
  subject: string;
  status: 'pending' | 'responded';
  createdAt: string;
  messages: {
    sender: string;
    message: string;
    timestamp: string;
    attachments?: string[];
  }[];
}

export interface Bill {
  id: string;
  clientId: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  items: {
    name: string;
    amount: number;
  }[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string;
}

// Current user (changes based on role selection)
export const mockUsers: Record<UserRole, User> = {
  client: {
    id: 'c1',
    name: 'Ahmed Hassan',
    email: 'ahmed.hassan@email.com',
    role: 'client',
    cnic: '35201-1234567-8',
    phone: '+92 300 1234567',
  },
  employee: {
    id: 'e1',
    name: 'Sara Khan',
    email: 'sara.khan@taxfirm.com',
    role: 'employee',
    cnic: '35201-9876543-2',
  },
  fbr: {
    id: 'f1',
    name: 'Officer Imran Ali',
    email: 'imran.ali@fbr.gov.pk',
    role: 'fbr',
    cnic: '35201-5555555-5',
  },
};

export const mockTaxReturns: TaxReturn[] = [
  {
    id: 'TR-2024-001',
    clientId: 'c1',
    clientName: 'Ahmed Hassan',
    taxYear: '2024',
    status: 'submitted',
    submittedDate: '2024-12-15',
    totalIncome: 2500000,
    totalTax: 125000,
    documents: 8,
    lastUpdated: '2024-12-15',
  },
  {
    id: 'TR-2023-001',
    clientId: 'c1',
    clientName: 'Ahmed Hassan',
    taxYear: '2023',
    status: 'approved',
    submittedDate: '2023-12-10',
    totalIncome: 2200000,
    totalTax: 110000,
    documents: 7,
    lastUpdated: '2024-01-20',
  },
  {
    id: 'TR-2024-002',
    clientId: 'c2',
    clientName: 'Fatima Zahra',
    taxYear: '2024',
    status: 'under_review',
    submittedDate: '2024-12-10',
    totalIncome: 1800000,
    totalTax: 90000,
    documents: 5,
    lastUpdated: '2024-12-18',
  },
  {
    id: 'TR-2024-003',
    clientId: 'c3',
    clientName: 'Muhammad Ali',
    taxYear: '2024',
    status: 'draft',
    totalIncome: 3200000,
    totalTax: 0,
    documents: 2,
    lastUpdated: '2024-12-19',
  },
  {
    id: 'TR-2024-004',
    clientId: 'c4',
    clientName: 'Aisha Malik',
    taxYear: '2024',
    status: 'objection',
    submittedDate: '2024-11-20',
    totalIncome: 4500000,
    totalTax: 280000,
    documents: 12,
    lastUpdated: '2024-12-10',
  },
];

export const mockInfoRequests: InfoRequest[] = [
  {
    id: 'IR-001',
    clientId: 'c1',
    clientName: 'Ahmed Hassan',
    returnId: 'TR-2024-001',
    subject: 'Salary Certificate Required',
    status: 'pending',
    createdAt: '2024-12-18',
    messages: [
      {
        sender: 'Sara Khan',
        message: 'Please provide your latest salary certificate from your employer for the tax year 2024.',
        timestamp: '2024-12-18 10:30 AM',
      },
    ],
  },
  {
    id: 'IR-002',
    clientId: 'c2',
    clientName: 'Fatima Zahra',
    returnId: 'TR-2024-002',
    subject: 'Bank Statement Clarification',
    status: 'responded',
    createdAt: '2024-12-15',
    messages: [
      {
        sender: 'Sara Khan',
        message: 'We need clarification on the transaction dated 15th March 2024 in your bank statement.',
        timestamp: '2024-12-15 09:00 AM',
      },
      {
        sender: 'Fatima Zahra',
        message: 'That was a refund from a cancelled online purchase. I have attached the relevant documentation.',
        timestamp: '2024-12-16 02:15 PM',
        attachments: ['refund_receipt.pdf'],
      },
    ],
  },
];

export const mockBills: Bill[] = [
  {
    id: 'BILL-001',
    clientId: 'c1',
    description: 'Tax Filing Services - FY 2024',
    amount: 35000,
    dueDate: '2024-12-31',
    status: 'pending',
    items: [
      { name: 'Tax Return Preparation', amount: 25000 },
      { name: 'Document Review', amount: 5000 },
      { name: 'Consultation Fee', amount: 5000 },
    ],
  },
  {
    id: 'BILL-002',
    clientId: 'c1',
    description: 'Tax Filing Services - FY 2023',
    amount: 30000,
    dueDate: '2023-12-31',
    status: 'paid',
    items: [
      { name: 'Tax Return Preparation', amount: 22000 },
      { name: 'Document Review', amount: 5000 },
      { name: 'Consultation Fee', amount: 3000 },
    ],
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    title: 'Information Request',
    message: 'New information request from tax officer regarding your 2024 return.',
    type: 'warning',
    read: false,
    createdAt: '2024-12-18',
  },
  {
    id: 'n2',
    title: 'Return Submitted',
    message: 'Your tax return for 2024 has been successfully submitted.',
    type: 'success',
    read: true,
    createdAt: '2024-12-15',
  },
  {
    id: 'n3',
    title: 'Payment Due',
    message: 'Your service fee payment of Rs. 35,000 is due on December 31, 2024.',
    type: 'info',
    read: false,
    createdAt: '2024-12-14',
  },
];

export const taxYears = ['2024', '2023', '2022', '2021', '2020'];

export const incomeCategories = [
  'Salary',
  'Business Income',
  'Rental Income',
  'Capital Gains',
  'Agricultural Income',
  'Foreign Income',
  'Other Income',
];

export const deductionCategories = [
  'Zakat',
  'Donations',
  'Health Insurance',
  'Education Expenses',
  'Profit on Debt',
  'Other Deductions',
];

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getStatusColor = (status: TaxReturn['status']): string => {
  const colors = {
    draft: 'status-draft',
    submitted: 'status-submitted',
    under_review: 'status-review',
    approved: 'status-approved',
    rejected: 'status-rejected',
    objection: 'status-pending',
  };
  return colors[status];
};

export const getStatusLabel = (status: TaxReturn['status']): string => {
  const labels = {
    draft: 'Draft',
    submitted: 'Submitted',
    under_review: 'Under Review',
    approved: 'Approved',
    rejected: 'Rejected',
    objection: 'Objection Raised',
  };
  return labels[status];
};

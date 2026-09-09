import { z } from 'zod';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'AED' | 'SAR' | 'CAD';

export interface Business {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  industry: string;
  logo: string;
  currency: CurrencyCode;
  taxId: string;
  address: string;
  country: string;
  fiscalYearStart: string;
  valuation: number;
  monthlyRevenue: number;
  cashBalance: number;
  ownerEquityPercentage: number;
  createdAt: string;
}

export type RoleType = 'OWNER' | 'ADMIN' | 'MANAGER' | 'MEMBER' | 'VIEWER';

export interface BusinessMembership {
  id: string;
  businessId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar: string;
  role: RoleType;
  department: string;
  joinedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  title: string;
  globalRole: 'SUPER_OWNER' | 'EXECUTIVE' | 'FINANCE_LEAD' | 'AUDITOR' | 'EMPLOYEE';
  employeeId?: string;
  businessId?: string;
  department?: string;
}

export interface Partner {
  id: string;
  businessId: string;
  name: string;
  email: string;
  role: string;
  equityPercentage: number;
  sharesCount: number;
  capitalContributed: number;
  profitSharePercentage: number;
  votingRights: boolean;
  distributionDue: number;
  status: 'ACTIVE' | 'EXITED';
  payoutHistory: {
    id: string;
    date: string;
    amount: number;
    note: string;
  }[];
}

export type LeadStage = 'LEAD_IN' | 'DISCOVERY' | 'PROPOSAL' | 'NEGOTIATION' | 'WON' | 'LOST';

export interface Lead {
  id: string;
  businessId: string;
  title: string;
  contactName: string;
  company: string;
  email: string;
  phone: string;
  stage: LeadStage;
  value: number;
  probability: number;
  assignedTo: string;
  expectedClose: string;
  notes: string;
  createdAt: string;
}

export interface Client {
  id: string;
  businessId: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PROSPECT';
  totalBilled: number;
  outstandingBalance: number;
  projectsCount: number;
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  businessId: string;
  clientId: string;
  clientName: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  status: InvoiceStatus;
  paymentMethod?: string;
  notes?: string;
  paidAt?: string;
}

export interface Quotation {
  id: string;
  quoteNumber: string;
  businessId: string;
  clientId: string;
  clientName: string;
  issueDate: string;
  expiryDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  total: number;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'DECLINED' | 'CONVERTED';
  notes?: string;
}

export interface Milestone {
  id: string;
  title: string;
  done: boolean;
  dueDate: string;
}

export interface Project {
  id: string;
  businessId: string;
  clientId: string;
  clientName: string;
  title: string;
  description: string;
  budget: number;
  spent: number;
  progress: number;
  status: 'PLANNING' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED';
  startDate: string;
  endDate: string;
  leaderName: string;
  milestones: Milestone[];
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Task {
  id: string;
  businessId: string;
  projectId?: string;
  projectTitle?: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  dueDate: string;
  createdAt: string;
}

export type Department =
  | 'ENGINEERING'
  | 'PRODUCT'
  | 'DESIGN'
  | 'SALES'
  | 'MARKETING'
  | 'OPERATIONS'
  | 'FINANCE'
  | 'HR'
  | 'LEGAL'
  | 'CUSTOMER_SUCCESS'
  | 'EXECUTIVE';

export type PayFrequency = 'MONTHLY' | 'BIWEEKLY';

export interface Employee {
  id: string;
  businessId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department: Department;
  salary: number;
  payFrequency: PayFrequency;
  hireDate: string;
  status: 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED';
  bankAccount: string;
}

export interface PayrollRun {
  id: string;
  businessId: string;
  period: string;
  runDate: string;
  totalGross: number;
  totalTax: number;
  totalNet: number;
  status: 'DRAFT' | 'APPROVED' | 'PAID';
  employeesCount: number;
}

export interface LeaveRequest {
  id: string;
  businessId: string;
  employeeId: string;
  employeeName: string;
  type: 'VACATION' | 'SICK' | 'PERSONAL';
  startDate: string;
  endDate: string;
  days: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export type ExpenseCategory =
  | 'PAYROLL'
  | 'SOFTWARE'
  | 'RENT'
  | 'MARKETING'
  | 'COGS'
  | 'LEGAL'
  | 'TRAVEL'
  | 'OFFICE'
  | 'EQUIPMENT'
  | 'OTHER';

export interface Expense {
  id: string;
  businessId: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  vendor: string;
  date: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  paidBy: string;
  taxDeductible: boolean;
  notes?: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  businessId: string;
  vendor: string;
  itemsSummary: string;
  total: number;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'FULFILLED' | 'CANCELLED';
  requestDate: string;
}

export interface BankAccount {
  id: string;
  businessId: string;
  bankName: string;
  accountNumber: string;
  accountType: 'OPERATING' | 'TREASURY' | 'MERCHANT' | 'PAYROLL';
  balance: number;
  currency: CurrencyCode;
}

export interface InventoryItem {
  id: string;
  businessId: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  unitCost: number;
  retailPrice: number;
  reorderPoint: number;
  warehouse: string;
  lastRestocked: string;
}

// Personal Finance ("Manage Everything You Own")
export interface PersonalAsset {
  id: string;
  title: string;
  category: 'REAL_ESTATE' | 'CASH_BANK' | 'STOCK_PORTFOLIO' | 'CRYPTO' | 'VEHICLE' | 'PRECIOUS_METALS' | 'OTHER';
  valuation: number;
  notes?: string;
  institution?: string;
  lastUpdated: string;
}

export interface PersonalLiability {
  id: string;
  title: string;
  category: 'MORTGAGE' | 'AUTO_LOAN' | 'CREDIT_LINE' | 'PRIVATE_NOTE' | 'OTHER';
  remainingBalance: number;
  monthlyPayment: number;
  interestRate: number;
  lender: string;
}

export interface PersonalIncomeDraw {
  id: string;
  businessId?: string;
  businessName?: string;
  source: string;
  amount: number;
  type: 'DIVIDEND' | 'SALARY' | 'PROFIT_DISTRIBUTION' | 'RENTAL' | 'CAPITAL_GAIN';
  date: string;
  status: 'COMPLETED' | 'SCHEDULED';
}

export interface VaultDocument {
  id: string;
  businessId?: string;
  isPersonal: boolean;
  title: string;
  category: 'CONTRACT' | 'LEGAL' | 'TAX' | 'FINANCIAL' | 'PITCH_DECK' | 'LICENSE' | 'PERSONAL_ESTATE';
  size: string;
  uploadDate: string;
  fileType: string;
  fileUrl?: string;
}

export interface Message {
  id: string;
  businessId?: string;
  channel: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  businessId?: string;
  title: string;
  message: string;
  type: 'WARNING' | 'INFO' | 'SUCCESS' | 'ALERT';
  read: boolean;
  timestamp: string;
  targetTab?: string;
}

export interface AuditLog {
  id: string;
  businessId?: string;
  businessName?: string;
  user: string;
  action: string;
  entity: string;
  timestamp: string;
  ipAddress: string;
}

// Zod validation schemas for API & form hygiene
export const BusinessSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  industry: z.string().min(2, 'Industry is required'),
  currency: z.enum(['USD', 'EUR', 'GBP', 'AED', 'SAR', 'CAD']),
  valuation: z.number().nonnegative(),
  taxId: z.string().optional(),
  country: z.string().default('United States')
});

export const InvoiceItemSchema = z.object({
  description: z.string().min(1, 'Description required'),
  quantity: z.number().positive(),
  unitPrice: z.number().nonnegative(),
  amount: z.number()
});

export const ExpenseSchema = z.object({
  title: z.string().min(2, 'Title required'),
  amount: z.number().positive('Amount must be positive'),
  category: z.string(),
  vendor: z.string().min(1, 'Vendor required'),
  date: z.string()
});

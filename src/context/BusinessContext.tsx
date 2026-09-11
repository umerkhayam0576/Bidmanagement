import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Business,
  BusinessMembership,
  UserProfile,
  Partner,
  Lead,
  LeadStage,
  Client,
  Invoice,
  InvoiceStatus,
  Quotation,
  Project,
  Task,
  TaskStatus,
  Employee,
  PayrollRun,
  LeaveRequest,
  Expense,
  PurchaseOrder,
  BankAccount,
  InventoryItem,
  PersonalAsset,
  PersonalLiability,
  PersonalIncomeDraw,
  VaultDocument,
  Message,
  AppNotification,
  AuditLog,
  CurrencyCode,
  Bid,
  BidStage,
  RFI,
  RfiStatus,
  Deliverable,
  DeliverableStatus,
  ResponseRecord,
  MaterialCostItem,
  LaborCostItem,
  AttendanceRecord
} from '../types';
import {
  initialBusinesses,
  initialMemberships,
  initialUserProfiles,
  initialPartners,
  initialLeads,
  initialClients,
  initialInvoices,
  initialQuotations,
  initialProjects,
  initialTasks,
  initialEmployees,
  initialPayrollRuns,
  initialLeaveRequests,
  initialExpenses,
  initialPurchaseOrders,
  initialBankAccounts,
  initialInventory,
  initialPersonalAssets,
  initialPersonalLiabilities,
  initialIncomeDraws,
  initialVaultDocuments,
  initialMessages,
  initialNotifications,
  initialAuditLogs
} from '../data/mockData';
import {
  initialBids,
  initialRfis,
  initialDeliverables,
  initialResponses,
  initialMaterialCosts,
  initialLaborCosts,
  initialAttendanceRecords
} from '../data/engineeringBiddingData';

export type NavigationTab =
  | 'overview'
  | 'bid-board'
  | 'rfis'
  | 'deliverables'
  | 'responses'
  | 'pricing-hub'
  | 'attendance'
  | 'personal-wealth'
  | 'partners'
  | 'crm'
  | 'clients'
  | 'billing'
  | 'projects'
  | 'hr-payroll'
  | 'finance'
  | 'inventory'
  | 'reports'
  | 'documents'
  | 'messages'
  | 'audit-logs'
  | 'settings';

export const DEFAULT_ROLE_PERMISSIONS: Record<string, NavigationTab[]> = {
  ENGINEERING: ['overview', 'bid-board', 'rfis', 'deliverables', 'responses', 'pricing-hub', 'attendance', 'projects', 'hr-payroll', 'finance', 'clients', 'messages', 'documents'],
  SALES: ['overview', 'bid-board', 'pricing-hub', 'attendance', 'crm', 'clients', 'billing', 'projects', 'hr-payroll', 'finance', 'messages', 'documents'],
  HR: ['overview', 'attendance', 'hr-payroll', 'clients', 'documents', 'messages', 'finance', 'projects'],
  OPERATIONS: ['overview', 'bid-board', 'rfis', 'deliverables', 'responses', 'pricing-hub', 'attendance', 'projects', 'inventory', 'clients', 'documents', 'messages', 'finance', 'hr-payroll'],
  FINANCE: ['overview', 'pricing-hub', 'finance', 'billing', 'hr-payroll', 'reports', 'clients', 'documents', 'messages', 'attendance'],
  MARKETING: ['overview', 'bid-board', 'crm', 'projects', 'clients', 'messages', 'documents', 'hr-payroll', 'finance', 'attendance'],
  PRODUCT: ['overview', 'rfis', 'deliverables', 'pricing-hub', 'attendance', 'projects', 'clients', 'messages', 'documents', 'hr-payroll', 'finance'],
  DESIGN: ['overview', 'deliverables', 'rfis', 'attendance', 'projects', 'clients', 'messages', 'documents', 'hr-payroll', 'finance'],
  LEGAL: ['overview', 'bid-board', 'documents', 'clients', 'messages', 'hr-payroll', 'finance', 'audit-logs', 'attendance'],
  CUSTOMER_SUCCESS: ['overview', 'deliverables', 'responses', 'crm', 'clients', 'messages', 'projects', 'hr-payroll', 'finance', 'attendance'],
  EXECUTIVE: ['overview', 'bid-board', 'rfis', 'deliverables', 'responses', 'pricing-hub', 'attendance', 'crm', 'clients', 'billing', 'projects', 'hr-payroll', 'finance', 'inventory', 'reports', 'documents', 'messages', 'audit-logs', 'partners'],
  CLIENT: ['overview', 'projects', 'billing', 'deliverables', 'rfis', 'messages'],
  GENERAL: ['overview', 'bid-board', 'rfis', 'deliverables', 'responses', 'pricing-hub', 'attendance', 'projects', 'hr-payroll', 'finance', 'clients', 'messages', 'documents']
};

interface BusinessContextType {
  businesses: Business[];
  activeBusinessId: string | 'CONSOLIDATED';
  activeBusiness: Business | null;
  userProfiles: UserProfile[];
  currentUser: UserProfile;
  isEmployee: boolean;
  isClient: boolean;
  isHr: boolean;
  isFinance: boolean;
  isExecutive: boolean;
  currentEmployee: Employee | null;
  currentClient: Client | null;
  portalType: 'EXECUTIVE' | 'EMPLOYEE' | 'CLIENT' | 'HR' | 'FINANCE';
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  switchBusiness: (id: string | 'CONSOLIDATED') => void;
  switchUser: (id: string) => void;
  registerEmployee: (employee: Omit<Employee, 'id'>, switchImmediately?: boolean) => Employee;
  addBusiness: (data: Omit<Business, 'id' | 'createdAt'>) => void;
  updateBusiness: (id: string, updates: Partial<Business>) => void;
  formatCurrency: (amount: number, currency?: CurrencyCode) => string;

  // Permissions Manager
  rolePermissions: Record<string, NavigationTab[]>;
  employeePermissions: Record<string, NavigationTab[]>;
  toggleRolePermission: (role: string, module: NavigationTab) => void;
  setRolePermissions: (role: string, modules: NavigationTab[]) => void;
  toggleEmployeePermission: (employeeId: string, module: NavigationTab) => void;
  setEmployeePermissions: (employeeId: string, modules: NavigationTab[]) => void;
  resetRolePermissions: (role?: string) => void;
  resetEmployeePermissions: (employeeId: string) => void;
  hasTabPermission: (tab: NavigationTab, employeeIdOrRole?: string) => boolean;
  getEffectivePermissions: (employeeIdOrRole?: string) => NavigationTab[];

  // Domain state filtered by activeBusinessId (or consolidated)
  filteredPartners: Partner[];
  filteredLeads: Lead[];
  filteredClients: Client[];
  filteredInvoices: Invoice[];
  filteredQuotations: Quotation[];
  filteredProjects: Project[];
  filteredTasks: Task[];
  filteredEmployees: Employee[];
  filteredPayrollRuns: PayrollRun[];
  filteredLeaveRequests: LeaveRequest[];
  filteredExpenses: Expense[];
  filteredPurchaseOrders: PurchaseOrder[];
  filteredBankAccounts: BankAccount[];
  filteredInventory: InventoryItem[];
  filteredDocuments: VaultDocument[];
  filteredMessages: Message[];

  // Mutations
  addPartner: (partner: Omit<Partner, 'id' | 'payoutHistory'>) => void;
  recordPartnerPayout: (partnerId: string, amount: number, note: string) => void;
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  updateLeadStage: (leadId: string, stage: LeadStage) => void;
  convertLeadToClient: (leadId: string) => void;
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'totalBilled' | 'outstandingBalance' | 'projectsCount'>) => void;
  addInvoice: (invoice: Omit<Invoice, 'id'>) => void;
  updateInvoiceStatus: (invoiceId: string, status: InvoiceStatus) => void;
  addQuotation: (quotation: Omit<Quotation, 'id'>) => void;
  convertQuotationToInvoice: (quotationId: string) => void;
  addProject: (project: Omit<Project, 'id' | 'spent' | 'progress'>) => void;
  toggleMilestone: (projectId: string, milestoneId: string) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  triggerPayrollRun: (period: string) => void;
  submitLeaveRequest: (req: Omit<LeaveRequest, 'id' | 'status'>) => void;
  approveLeaveRequest: (requestId: string) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  approveExpense: (expenseId: string) => void;
  addPurchaseOrder: (po: Omit<PurchaseOrder, 'id'>) => void;
  addBankAccount: (account: Omit<BankAccount, 'id'>) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'lastRestocked'>) => void;
  restockItem: (itemId: string, addQuantity: number) => void;

  // Personal Wealth
  personalAssets: PersonalAsset[];
  personalLiabilities: PersonalLiability[];
  personalIncomeDraws: PersonalIncomeDraw[];
  addPersonalAsset: (asset: Omit<PersonalAsset, 'id' | 'lastUpdated'>) => void;
  updatePersonalAsset: (id: string, updates: Partial<PersonalAsset>) => void;
  addPersonalLiability: (liability: Omit<PersonalLiability, 'id'>) => void;
  addPersonalIncomeDraw: (draw: Omit<PersonalIncomeDraw, 'id'>) => void;
  calculateNetWorth: () => {
    totalPersonalAssets: number;
    totalBusinessEquityValue: number;
    totalAssets: number;
    totalLiabilities: number;
    netWorth: number;
  };

  // Documents & Comms
  vaultDocuments: VaultDocument[];
  addVaultDocument: (doc: Omit<VaultDocument, 'id' | 'uploadDate'>) => void;
  messages: Message[];
  sendMessage: (text: string, channel: string) => void;
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  dismissNotification: (id: string) => void;
  auditLogs: AuditLog[];
  addAuditLog: (action: string, entity: string, businessId?: string) => void;

  // Engineering, Bidding & Employee Operations Hub
  bids: Bid[];
  addBid: (bid: Omit<Bid, 'id' | 'createdAt'>) => void;
  updateBidStage: (bidId: string, stage: BidStage) => void;
  deleteBid: (bidId: string) => void;

  rfis: RFI[];
  addRfi: (rfi: Omit<RFI, 'id' | 'createdAt' | 'responseCount'>) => void;
  updateRfiStatus: (rfiId: string, status: RfiStatus) => void;

  deliverables: Deliverable[];
  addDeliverable: (deliverable: Omit<Deliverable, 'id'>) => void;
  updateDeliverableStatus: (deliverableId: string, status: DeliverableStatus) => void;
  updateDeliverableProgress: (deliverableId: string, progress: number) => void;

  responses: ResponseRecord[];
  addResponse: (response: Omit<ResponseRecord, 'id'>) => void;
  updateResponseActionStatus: (responseId: string, status: 'PENDING_ACTION' | 'IN_PROGRESS' | 'RESOLVED') => void;

  materialCosts: MaterialCostItem[];
  addMaterialCost: (item: Omit<MaterialCostItem, 'id' | 'lastUpdated'>) => void;
  laborCosts: LaborCostItem[];
  addLaborCost: (item: Omit<LaborCostItem, 'id' | 'lastUpdated'>) => void;

  attendanceRecords: AttendanceRecord[];
  isClockedIn: boolean;
  clockInTime: string | null;
  clockIn: (mode?: 'ON_SITE' | 'OFFICE' | 'REMOTE' | 'FIELD') => void;
  clockOut: () => void;

  // AI Modal
  isAiAdvisorOpen: boolean;
  setIsAiAdvisorOpen: (open: boolean) => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

function getStored<T>(key: string, defaultValue: T): T {
  try {
    const saved = localStorage.getItem(`refay_${key}`);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`refay_${key}`, JSON.stringify(value));
  } catch {
    // Ignore storage quota
  }
}

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [businesses, setBusinesses] = useState<Business[]>(() => getStored('businesses', initialBusinesses));
  const [activeBusinessId, setActiveBusinessId] = useState<string | 'CONSOLIDATED'>(() =>
    getStored('activeBizId', 'biz_apex')
  );
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>(() =>
    getStored('userProfiles', initialUserProfiles)
  );
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => getStored('currentUser', initialUserProfiles[0]));
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');

  // Entities state
  const [partners, setPartners] = useState<Partner[]>(() => getStored('partners', initialPartners));
  const [leads, setLeads] = useState<Lead[]>(() => getStored('leads', initialLeads));
  const [clients, setClients] = useState<Client[]>(() => getStored('clients', initialClients));
  const [invoices, setInvoices] = useState<Invoice[]>(() => getStored('invoices', initialInvoices));
  const [quotations, setQuotations] = useState<Quotation[]>(() => getStored('quotations', initialQuotations));
  const [projects, setProjects] = useState<Project[]>(() => getStored('projects', initialProjects));
  const [tasks, setTasks] = useState<Task[]>(() => getStored('tasks', initialTasks));
  const [employees, setEmployees] = useState<Employee[]>(() => getStored('employees', initialEmployees));
  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>(() => getStored('payrollRuns', initialPayrollRuns));
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => getStored('leaveRequests', initialLeaveRequests));
  const [expenses, setExpenses] = useState<Expense[]>(() => getStored('expenses', initialExpenses));
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => getStored('purchaseOrders', initialPurchaseOrders));
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(() => getStored('bankAccounts', initialBankAccounts));
  const [inventory, setInventory] = useState<InventoryItem[]>(() => getStored('inventory', initialInventory));
  const [personalAssets, setPersonalAssets] = useState<PersonalAsset[]>(() => getStored('personalAssets', initialPersonalAssets));
  const [personalLiabilities, setPersonalLiabilities] = useState<PersonalLiability[]>(() => getStored('personalLiabilities', initialPersonalLiabilities));
  const [personalIncomeDraws, setPersonalIncomeDraws] = useState<PersonalIncomeDraw[]>(() => getStored('personalIncomeDraws', initialIncomeDraws));
  const [vaultDocuments, setVaultDocuments] = useState<VaultDocument[]>(() => getStored('vaultDocs', initialVaultDocuments));
  const [messages, setMessages] = useState<Message[]>(() => getStored('messages', initialMessages));
  const [notifications, setNotifications] = useState<AppNotification[]>(() => getStored('notifications', initialNotifications));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => getStored('auditLogs', initialAuditLogs));
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState<boolean>(false);

  // Engineering, Bidding & Attendance State
  const [bids, setBids] = useState<Bid[]>(() => getStored('bids', initialBids));
  const [rfis, setRfis] = useState<RFI[]>(() => getStored('rfis', initialRfis));
  const [deliverables, setDeliverables] = useState<Deliverable[]>(() => getStored('deliverables', initialDeliverables));
  const [responses, setResponses] = useState<ResponseRecord[]>(() => getStored('responses', initialResponses));
  const [materialCosts, setMaterialCosts] = useState<MaterialCostItem[]>(() => getStored('materialCosts', initialMaterialCosts));
  const [laborCosts, setLaborCosts] = useState<LaborCostItem[]>(() => getStored('laborCosts', initialLaborCosts));
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => getStored('attendanceRecords', initialAttendanceRecords));
  const [isClockedIn, setIsClockedIn] = useState<boolean>(() => getStored('isClockedIn', true));
  const [clockInTime, setClockInTime] = useState<string | null>(() => getStored('clockInTime', '08:00 AM'));

  // Permissions Manager State
  const [rolePermissions, setRolePermissionsState] = useState<Record<string, NavigationTab[]>>(() =>
    getStored('rolePermissions', DEFAULT_ROLE_PERMISSIONS)
  );
  const [employeePermissions, setEmployeePermissionsState] = useState<Record<string, NavigationTab[]>>(() =>
    getStored('employeePermissions', {})
  );

  // Sync to storage
  useEffect(() => setStored('businesses', businesses), [businesses]);
  useEffect(() => setStored('activeBizId', activeBusinessId), [activeBusinessId]);
  useEffect(() => setStored('userProfiles', userProfiles), [userProfiles]);
  useEffect(() => setStored('currentUser', currentUser), [currentUser]);
  useEffect(() => setStored('partners', partners), [partners]);
  useEffect(() => setStored('leads', leads), [leads]);
  useEffect(() => setStored('clients', clients), [clients]);
  useEffect(() => setStored('invoices', invoices), [invoices]);
  useEffect(() => setStored('quotations', quotations), [quotations]);
  useEffect(() => setStored('projects', projects), [projects]);
  useEffect(() => setStored('tasks', tasks), [tasks]);
  useEffect(() => setStored('employees', employees), [employees]);
  useEffect(() => setStored('payrollRuns', payrollRuns), [payrollRuns]);
  useEffect(() => setStored('leaveRequests', leaveRequests), [leaveRequests]);
  useEffect(() => setStored('expenses', expenses), [expenses]);
  useEffect(() => setStored('purchaseOrders', purchaseOrders), [purchaseOrders]);
  useEffect(() => setStored('bankAccounts', bankAccounts), [bankAccounts]);
  useEffect(() => setStored('inventory', inventory), [inventory]);
  useEffect(() => setStored('personalAssets', personalAssets), [personalAssets]);
  useEffect(() => setStored('personalLiabilities', personalLiabilities), [personalLiabilities]);
  useEffect(() => setStored('personalIncomeDraws', personalIncomeDraws), [personalIncomeDraws]);
  useEffect(() => setStored('vaultDocs', vaultDocuments), [vaultDocuments]);
  useEffect(() => setStored('messages', messages), [messages]);
  useEffect(() => setStored('notifications', notifications), [notifications]);
  useEffect(() => setStored('auditLogs', auditLogs), [auditLogs]);
  useEffect(() => setStored('rolePermissions', rolePermissions), [rolePermissions]);
  useEffect(() => setStored('employeePermissions', employeePermissions), [employeePermissions]);
  useEffect(() => setStored('bids', bids), [bids]);
  useEffect(() => setStored('rfis', rfis), [rfis]);
  useEffect(() => setStored('deliverables', deliverables), [deliverables]);
  useEffect(() => setStored('responses', responses), [responses]);
  useEffect(() => setStored('materialCosts', materialCosts), [materialCosts]);
  useEffect(() => setStored('laborCosts', laborCosts), [laborCosts]);
  useEffect(() => setStored('attendanceRecords', attendanceRecords), [attendanceRecords]);
  useEffect(() => setStored('isClockedIn', isClockedIn), [isClockedIn]);
  useEffect(() => setStored('clockInTime', clockInTime), [clockInTime]);

  const activeBusiness = useMemo(() => {
    if (activeBusinessId === 'CONSOLIDATED') return null;
    return businesses.find((b) => b.id === activeBusinessId) || businesses[0] || null;
  }, [businesses, activeBusinessId]);

  const formatCurrency = (amount: number, customCurrency?: CurrencyCode): string => {
    const code = customCurrency || activeBusiness?.currency || 'USD';
    const symbolMap: Record<CurrencyCode, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      AED: 'AED ',
      SAR: 'SAR ',
      CAD: 'CA$'
    };
    const symbol = symbolMap[code] || '$';
    return `${symbol}${Math.round(amount).toLocaleString()}`;
  };

  const addAuditLog = (action: string, entity: string, targetBizId?: string) => {
    const bizId = targetBizId || (activeBusinessId !== 'CONSOLIDATED' ? activeBusinessId : undefined);
    const targetBiz = businesses.find((b) => b.id === bizId);
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      businessId: bizId,
      businessName: targetBiz ? targetBiz.name : 'Personal / Platform System',
      user: currentUser.name,
      action,
      entity,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ipAddress: '192.168.1.104'
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const isEmployee = currentUser.globalRole === 'EMPLOYEE';
  const isClient = currentUser.globalRole === 'CLIENT';
  const isHr =
    currentUser.globalRole === 'HR_MANAGER' ||
    (currentUser.globalRole === 'EMPLOYEE' && currentUser.department === 'HR');
  const isFinance = currentUser.globalRole === 'FINANCE_LEAD';
  const isExecutive = currentUser.globalRole === 'SUPER_OWNER' || currentUser.globalRole === 'EXECUTIVE';

  const currentEmployee = useMemo(() => {
    if (!isEmployee && !isHr) return null;
    if (currentUser.employeeId) {
      const found = employees.find((e) => e.id === currentUser.employeeId);
      if (found) return found;
    }
    const byEmail = employees.find((e) => e.email.toLowerCase() === currentUser.email.toLowerCase());
    if (byEmail) return byEmail;
    const byName = employees.find(
      (e) => `${e.firstName} ${e.lastName}`.trim().toLowerCase() === currentUser.name.toLowerCase()
    );
    if (byName) return byName;
    return null;
  }, [isEmployee, isHr, currentUser, employees]);

  const currentClient = useMemo(() => {
    if (!isClient) return null;
    if (currentUser.clientId) {
      const found = clients.find((c) => c.id === currentUser.clientId);
      if (found) return found;
    }
    const byEmail = clients.find((c) => c.email.toLowerCase() === currentUser.email.toLowerCase());
    if (byEmail) return byEmail;
    return clients[0] || null;
  }, [isClient, currentUser, clients]);

  const portalType = useMemo((): 'EXECUTIVE' | 'EMPLOYEE' | 'CLIENT' | 'HR' | 'FINANCE' => {
    if (isClient) return 'CLIENT';
    if (isHr) return 'HR';
    if (isEmployee) return 'EMPLOYEE';
    if (isFinance) return 'FINANCE';
    return 'EXECUTIVE';
  }, [isClient, isHr, isEmployee, isFinance]);

  // Permissions Manager Methods
  const getEffectivePermissions = (employeeIdOrRole?: string): NavigationTab[] => {
    if (isClient) {
      return ['overview', 'projects', 'billing', 'deliverables', 'rfis', 'messages'];
    }
    if (isHr) {
      return ['overview', 'hr-payroll', 'attendance', 'clients', 'documents', 'messages'];
    }
    if (!employeeIdOrRole) {
      if (!isEmployee) {
        return [
          'overview',
          'personal-wealth',
          'partners',
          'crm',
          'clients',
          'billing',
          'projects',
          'hr-payroll',
          'finance',
          'inventory',
          'reports',
          'documents',
          'messages',
          'audit-logs',
          'settings',
          'bid-board',
          'rfis',
          'deliverables',
          'responses',
          'pricing-hub',
          'attendance'
        ];
      }
      const empId = currentUser.employeeId || currentUser.id;
      if (employeePermissions[empId]) {
        return employeePermissions[empId];
      }
      const dept = currentEmployee?.department || currentUser.department || 'GENERAL';
      return rolePermissions[dept] || DEFAULT_ROLE_PERMISSIONS[dept] || DEFAULT_ROLE_PERMISSIONS['GENERAL'];
    }

    if (employeePermissions[employeeIdOrRole]) {
      return employeePermissions[employeeIdOrRole];
    }
    if (rolePermissions[employeeIdOrRole]) {
      return rolePermissions[employeeIdOrRole];
    }
    const emp = employees.find((e) => e.id === employeeIdOrRole || e.email === employeeIdOrRole);
    if (emp) {
      if (employeePermissions[emp.id]) {
        return employeePermissions[emp.id];
      }
      const dept = emp.department || 'GENERAL';
      return rolePermissions[dept] || DEFAULT_ROLE_PERMISSIONS[dept] || DEFAULT_ROLE_PERMISSIONS['GENERAL'];
    }
    return DEFAULT_ROLE_PERMISSIONS[employeeIdOrRole] || DEFAULT_ROLE_PERMISSIONS['GENERAL'];
  };

  const hasTabPermission = (tab: NavigationTab, employeeIdOrRole?: string): boolean => {
    if (isClient) {
      return ['overview', 'projects', 'billing', 'deliverables', 'rfis', 'messages'].includes(tab);
    }
    if (isHr) {
      return ['overview', 'hr-payroll', 'attendance', 'clients', 'documents', 'messages'].includes(tab);
    }
    if (!employeeIdOrRole && !isEmployee) return true;
    const allowed = getEffectivePermissions(employeeIdOrRole);
    return allowed.includes(tab);
  };

  const toggleRolePermission = (role: string, module: NavigationTab) => {
    setRolePermissionsState((prev) => {
      const currentList = prev[role] || DEFAULT_ROLE_PERMISSIONS[role] || DEFAULT_ROLE_PERMISSIONS['GENERAL'];
      const exists = currentList.includes(module);
      const updated = exists ? currentList.filter((m) => m !== module) : [...currentList, module];
      addAuditLog(`Permissions Manager: Toggled module '${module}' for role '${role}' to ${!exists ? 'ENABLED' : 'DISABLED'}`, 'Security & RBAC');
      return {
        ...prev,
        [role]: updated
      };
    });
  };

  const setRolePermissions = (role: string, modules: NavigationTab[]) => {
    setRolePermissionsState((prev) => ({
      ...prev,
      [role]: modules
    }));
    addAuditLog(`Permissions Manager: Set module permissions for role '${role}'`, 'Security & RBAC');
  };

  const toggleEmployeePermission = (employeeId: string, module: NavigationTab) => {
    setEmployeePermissionsState((prev) => {
      const currentList = prev[employeeId] || getEffectivePermissions(employeeId);
      const exists = currentList.includes(module);
      const updated = exists ? currentList.filter((m) => m !== module) : [...currentList, module];
      const emp = employees.find((e) => e.id === employeeId);
      const empName = emp ? `${emp.firstName} ${emp.lastName}` : employeeId;
      addAuditLog(`Permissions Manager: Toggled module '${module}' for employee '${empName}' to ${!exists ? 'ENABLED' : 'DISABLED'}`, 'Security & RBAC');
      return {
        ...prev,
        [employeeId]: updated
      };
    });
  };

  const setEmployeePermissions = (employeeId: string, modules: NavigationTab[]) => {
    setEmployeePermissionsState((prev) => ({
      ...prev,
      [employeeId]: modules
    }));
    addAuditLog(`Permissions Manager: Set custom module permissions for employee '${employeeId}'`, 'Security & RBAC');
  };

  const resetRolePermissions = (role?: string) => {
    if (role) {
      setRolePermissionsState((prev) => ({
        ...prev,
        [role]: DEFAULT_ROLE_PERMISSIONS[role] || DEFAULT_ROLE_PERMISSIONS['GENERAL']
      }));
      addAuditLog(`Permissions Manager: Reset permissions for role '${role}' to defaults`, 'Security & RBAC');
    } else {
      setRolePermissionsState(DEFAULT_ROLE_PERMISSIONS);
      addAuditLog('Permissions Manager: Reset all role permissions to factory defaults', 'Security & RBAC');
    }
  };

  const resetEmployeePermissions = (employeeId: string) => {
    setEmployeePermissionsState((prev) => {
      const next = { ...prev };
      delete next[employeeId];
      return next;
    });
    addAuditLog(`Permissions Manager: Cleared custom overrides for employee '${employeeId}'`, 'Security & RBAC');
  };

  const switchBusiness = (id: string | 'CONSOLIDATED') => {
    setActiveBusinessId(id);
    const target = id === 'CONSOLIDATED' ? 'All Holdings Consolidated' : businesses.find((b) => b.id === id)?.name;
    addAuditLog(`Switched active context to ${target}`, 'Session / Navigation');
  };

  const switchUser = (id: string) => {
    const user = userProfiles.find((u) => u.id === id);
    if (user) {
      setCurrentUser(user);
      if (user.globalRole === 'CLIENT') {
        if (user.businessId) {
          setActiveBusinessId(user.businessId);
        }
        setActiveTab('overview');
      } else if (user.globalRole === 'EMPLOYEE') {
        if (user.businessId) {
          setActiveBusinessId(user.businessId);
        } else {
          const emp = employees.find((e) => e.id === user.employeeId || e.email === user.email);
          if (emp) setActiveBusinessId(emp.businessId);
        }
        // Redirect to overview (which hosts the employee portal dashboard)
        setActiveTab('overview');
      } else if (user.globalRole === 'HR_MANAGER') {
        if (user.businessId) {
          setActiveBusinessId(user.businessId);
        }
        setActiveTab('overview');
      }
      addAuditLog(`Switched user profile to ${user.name} (${user.title})`, 'Authentication');
    }
  };

  const addBusiness = (data: Omit<Business, 'id' | 'createdAt'>) => {
    const id = `biz_${Date.now()}`;
    const newBiz: Business = {
      ...data,
      id,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setBusinesses((prev) => [...prev, newBiz]);
    setActiveBusinessId(id);
    addAuditLog(`Created new business entity: ${newBiz.name}`, 'Business Onboarding', id);
  };

  const updateBusiness = (id: string, updates: Partial<Business>) => {
    setBusinesses((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
    addAuditLog(`Updated profile for business ID ${id}`, 'Business Settings', id);
  };

  // Filtered queries
  const isAll = activeBusinessId === 'CONSOLIDATED';
  const filterByBiz = <T extends { businessId?: string }>(items: T[]): T[] => {
    if (isAll) return items;
    return items.filter((item) => item.businessId === activeBusinessId);
  };

  const filteredPartners = useMemo(() => filterByBiz(partners), [partners, activeBusinessId]);
  const filteredLeads = useMemo(() => filterByBiz(leads), [leads, activeBusinessId]);
  const filteredClients = useMemo(() => filterByBiz(clients), [clients, activeBusinessId]);
  const filteredInvoices = useMemo(() => filterByBiz(invoices), [invoices, activeBusinessId]);
  const filteredQuotations = useMemo(() => filterByBiz(quotations), [quotations, activeBusinessId]);
  const filteredProjects = useMemo(() => filterByBiz(projects), [projects, activeBusinessId]);
  const filteredTasks = useMemo(() => filterByBiz(tasks), [tasks, activeBusinessId]);
  const filteredEmployees = useMemo(() => filterByBiz(employees), [employees, activeBusinessId]);
  const filteredPayrollRuns = useMemo(() => filterByBiz(payrollRuns), [payrollRuns, activeBusinessId]);
  const filteredLeaveRequests = useMemo(() => filterByBiz(leaveRequests), [leaveRequests, activeBusinessId]);
  const filteredExpenses = useMemo(() => filterByBiz(expenses), [expenses, activeBusinessId]);
  const filteredPurchaseOrders = useMemo(() => filterByBiz(purchaseOrders), [purchaseOrders, activeBusinessId]);
  const filteredBankAccounts = useMemo(() => filterByBiz(bankAccounts), [bankAccounts, activeBusinessId]);
  const filteredInventory = useMemo(() => filterByBiz(inventory), [inventory, activeBusinessId]);
  const filteredDocuments = useMemo(() => {
    if (isAll) return vaultDocuments;
    return vaultDocuments.filter((d) => d.businessId === activeBusinessId || d.isPersonal);
  }, [vaultDocuments, activeBusinessId, isAll]);
  const filteredMessages = useMemo(() => {
    if (isAll) return messages;
    return messages.filter((m) => m.businessId === activeBusinessId || !m.businessId);
  }, [messages, activeBusinessId, isAll]);

  // Mutations
  const addPartner = (partnerData: Omit<Partner, 'id' | 'payoutHistory'>) => {
    const newPartner: Partner = {
      ...partnerData,
      id: `ptn_${Date.now()}`,
      payoutHistory: []
    };
    setPartners((prev) => [...prev, newPartner]);
    addAuditLog(`Added partner ${newPartner.name} with ${newPartner.equityPercentage}% equity`, 'Cap Table', newPartner.businessId);
  };

  const recordPartnerPayout = (partnerId: string, amount: number, note: string) => {
    setPartners((prev) =>
      prev.map((p) => {
        if (p.id === partnerId) {
          const payout = {
            id: `pay_${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            amount,
            note
          };
          return {
            ...p,
            distributionDue: Math.max(0, p.distributionDue - amount),
            payoutHistory: [payout, ...p.payoutHistory]
          };
        }
        return p;
      })
    );
    addAuditLog(`Distributed ${formatCurrency(amount)} payout to partner ID ${partnerId}`, 'Cap Table / Finance');
  };

  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt'>) => {
    const newLead: Lead = {
      ...leadData,
      id: `lead_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setLeads((prev) => [newLead, ...prev]);
    addAuditLog(`Created new sales lead: ${newLead.title} (${newLead.company})`, 'Sales & CRM', newLead.businessId);
  };

  const updateLeadStage = (leadId: string, stage: LeadStage) => {
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, stage } : l)));
    addAuditLog(`Updated lead #${leadId} stage to ${stage}`, 'Sales & CRM');
  };

  const convertLeadToClient = (leadId: string) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;
    const newClient: Client = {
      id: `cli_${Date.now()}`,
      businessId: lead.businessId,
      name: lead.contactName,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      address: 'Contact Address Pending',
      status: 'ACTIVE',
      totalBilled: 0,
      outstandingBalance: 0,
      projectsCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setClients((prev) => [...prev, newClient]);
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, stage: 'WON' } : l)));
    addAuditLog(`Converted deal "${lead.title}" into active Client: ${newClient.company}`, 'Sales & CRM', lead.businessId);
  };

  const addClient = (clientData: Omit<Client, 'id' | 'createdAt' | 'totalBilled' | 'outstandingBalance' | 'projectsCount'>) => {
    const newClient: Client = {
      ...clientData,
      id: `cli_${Date.now()}`,
      totalBilled: 0,
      outstandingBalance: 0,
      projectsCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setClients((prev) => [...prev, newClient]);
    addAuditLog(`Added client ${newClient.company} (${newClient.name})`, 'Clients', newClient.businessId);
  };

  const addInvoice = (invoiceData: Omit<Invoice, 'id'>) => {
    const newInv: Invoice = {
      ...invoiceData,
      id: `inv_${Date.now()}`
    };
    setInvoices((prev) => [newInv, ...prev]);
    // update client outstanding balance
    setClients((prev) =>
      prev.map((c) =>
        c.id === newInv.clientId
          ? {
              ...c,
              totalBilled: c.totalBilled + newInv.total,
              outstandingBalance: c.outstandingBalance + (newInv.status !== 'PAID' ? newInv.total : 0)
            }
          : c
      )
    );
    addAuditLog(`Issued Invoice #${newInv.invoiceNumber} for ${formatCurrency(newInv.total)}`, 'Billing', newInv.businessId);
  };

  const updateInvoiceStatus = (invoiceId: string, status: InvoiceStatus) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === invoiceId) {
          const wasPaid = inv.status === 'PAID';
          const isNowPaid = status === 'PAID';
          if (!wasPaid && isNowPaid) {
            setClients((cPrev) =>
              cPrev.map((c) =>
                c.id === inv.clientId ? { ...c, outstandingBalance: Math.max(0, c.outstandingBalance - inv.total) } : c
              )
            );
          }
          return {
            ...inv,
            status,
            paidAt: isNowPaid ? new Date().toISOString().split('T')[0] : inv.paidAt
          };
        }
        return inv;
      })
    );
    addAuditLog(`Updated invoice #${invoiceId} status to ${status}`, 'Billing');
  };

  const addQuotation = (quoteData: Omit<Quotation, 'id'>) => {
    const newQuote: Quotation = {
      ...quoteData,
      id: `qte_${Date.now()}`
    };
    setQuotations((prev) => [newQuote, ...prev]);
    addAuditLog(`Created Quotation #${newQuote.quoteNumber} for ${formatCurrency(newQuote.total)}`, 'Billing', newQuote.businessId);
  };

  const convertQuotationToInvoice = (quotationId: string) => {
    const qte = quotations.find((q) => q.id === quotationId);
    if (!qte) return;
    const newInv: Invoice = {
      id: `inv_${Date.now()}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      businessId: qte.businessId,
      clientId: qte.clientId,
      clientName: qte.clientName,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: qte.items,
      subtotal: qte.subtotal,
      taxRate: qte.taxRate,
      taxAmount: (qte.subtotal * qte.taxRate) / 100,
      discountAmount: 0,
      total: qte.total,
      status: 'SENT',
      notes: qte.notes || 'Converted from approved quotation.'
    };
    setInvoices((prev) => [newInv, ...prev]);
    setQuotations((prev) => prev.map((q) => (q.id === quotationId ? { ...q, status: 'CONVERTED' } : q)));
    addAuditLog(`Converted Quote #${qte.quoteNumber} to Invoice #${newInv.invoiceNumber}`, 'Billing', qte.businessId);
  };

  const addProject = (projectData: Omit<Project, 'id' | 'spent' | 'progress'>) => {
    const newPrj: Project = {
      ...projectData,
      id: `prj_${Date.now()}`,
      spent: 0,
      progress: 0
    };
    setProjects((prev) => [...prev, newPrj]);
    setClients((prev) =>
      prev.map((c) => (c.id === newPrj.clientId ? { ...c, projectsCount: c.projectsCount + 1 } : c))
    );
    addAuditLog(`Created project "${newPrj.title}" with budget ${formatCurrency(newPrj.budget)}`, 'Projects', newPrj.businessId);
  };

  const toggleMilestone = (projectId: string, milestoneId: string) => {
    setProjects((prev) =>
      prev.map((prj) => {
        if (prj.id === projectId) {
          const updatedMilestones = prj.milestones.map((m) =>
            m.id === milestoneId ? { ...m, done: !m.done } : m
          );
          const doneCount = updatedMilestones.filter((m) => m.done).length;
          const progress = updatedMilestones.length > 0 ? Math.round((doneCount / updatedMilestones.length) * 100) : 0;
          return {
            ...prj,
            milestones: updatedMilestones,
            progress
          };
        }
        return prj;
      })
    );
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `tsk_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTasks((prev) => [newTask, ...prev]);
    addAuditLog(`Assigned new task "${newTask.title}" to ${newTask.assignee}`, 'Tasks & Workflows', newTask.businessId);
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status } : t)));
    addAuditLog(`Moved task #${taskId} to ${status}`, 'Tasks & Workflows');
  };

  const registerEmployee = (
    empData: Omit<Employee, 'id'>,
    switchImmediately: boolean = true
  ): Employee => {
    const newEmp: Employee = {
      ...empData,
      id: `emp_${Date.now()}`
    };
    setEmployees((prev) => [...prev, newEmp]);

    const newProfile: UserProfile = {
      id: `usr_emp_${newEmp.id}`,
      name: `${newEmp.firstName} ${newEmp.lastName}`.trim(),
      email: newEmp.email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      title: newEmp.role,
      globalRole: 'EMPLOYEE',
      employeeId: newEmp.id,
      businessId: newEmp.businessId,
      department: newEmp.department
    };

    setUserProfiles((prev) => {
      if (prev.some((p) => p.id === newProfile.id || (p.email && p.email === newProfile.email))) {
        return prev;
      }
      return [...prev, newProfile];
    });

    addAuditLog(`Registered employee ${newEmp.firstName} ${newEmp.lastName} (${newEmp.role})`, 'HR & Workforce', newEmp.businessId);

    if (switchImmediately) {
      setCurrentUser(newProfile);
      setActiveBusinessId(newEmp.businessId);
      setActiveTab('overview');
    }

    return newEmp;
  };

  const addEmployee = (empData: Omit<Employee, 'id'>) => {
    registerEmployee(empData, false);
  };

  const triggerPayrollRun = (period: string) => {
    const targetBizId = activeBusinessId !== 'CONSOLIDATED' ? activeBusinessId : businesses[0].id;
    const bizEmployees = employees.filter((e) => e.businessId === targetBizId && e.status === 'ACTIVE');
    const totalGross = bizEmployees.reduce((sum, e) => sum + e.salary / 12, 0);
    const totalTax = totalGross * 0.25;
    const totalNet = totalGross - totalTax;

    const newRun: PayrollRun = {
      id: `pr_${Date.now()}`,
      businessId: targetBizId,
      period,
      runDate: new Date().toISOString().split('T')[0],
      totalGross,
      totalTax,
      totalNet,
      status: 'APPROVED',
      employeesCount: bizEmployees.length
    };
    setPayrollRuns((prev) => [newRun, ...prev]);
    addAuditLog(`Processed payroll run for ${period} (${formatCurrency(totalGross)} gross)`, 'HR & Payroll', targetBizId);
  };

  const submitLeaveRequest = (req: Omit<LeaveRequest, 'id' | 'status'>) => {
    const newReq: LeaveRequest = {
      ...req,
      id: `lr_${Date.now()}`,
      status: 'PENDING'
    };
    setLeaveRequests((prev) => [newReq, ...prev]);
    addAuditLog(`Submitted leave request for ${newReq.employeeName}`, 'HR & Payroll', newReq.businessId);
  };

  const approveLeaveRequest = (requestId: string) => {
    setLeaveRequests((prev) => prev.map((r) => (r.id === requestId ? { ...r, status: 'APPROVED' } : r)));
    addAuditLog(`Approved leave request #${requestId}`, 'HR & Payroll');
  };

  const rejectLeaveRequest = (requestId: string) => {
    setLeaveRequests((prev) => prev.map((r) => (r.id === requestId ? { ...r, status: 'REJECTED' } : r)));
    addAuditLog(`Rejected leave request #${requestId}`, 'HR & Payroll');
  };

  const addExpense = (expData: Omit<Expense, 'id'>) => {
    const newExp: Expense = {
      ...expData,
      id: `exp_${Date.now()}`
    };
    setExpenses((prev) => [newExp, ...prev]);
    addAuditLog(`Logged expense "${newExp.title}" for ${formatCurrency(newExp.amount)}`, 'Finance', newExp.businessId);
  };

  const approveExpense = (expenseId: string) => {
    setExpenses((prev) => prev.map((e) => (e.id === expenseId ? { ...e, status: 'APPROVED' } : e)));
    addAuditLog(`Approved expense #${expenseId}`, 'Finance');
  };

  const addPurchaseOrder = (poData: Omit<PurchaseOrder, 'id'>) => {
    const newPo: PurchaseOrder = {
      ...poData,
      id: `po_${Date.now()}`
    };
    setPurchaseOrders((prev) => [newPo, ...prev]);
    addAuditLog(`Created Purchase Order #${newPo.poNumber} for ${newPo.vendor}`, 'Finance / Purchasing', newPo.businessId);
  };

  const addBankAccount = (accData: Omit<BankAccount, 'id'>) => {
    const newAcc: BankAccount = {
      ...accData,
      id: `ba_${Date.now()}`
    };
    setBankAccounts((prev) => [...prev, newAcc]);
    addAuditLog(`Connected bank account: ${newAcc.bankName} (${newAcc.accountType})`, 'Treasury', newAcc.businessId);
  };

  const addInventoryItem = (itemData: Omit<InventoryItem, 'id' | 'lastRestocked'>) => {
    const newItem: InventoryItem = {
      ...itemData,
      id: `inv_item_${Date.now()}`,
      lastRestocked: new Date().toISOString().split('T')[0]
    };
    setInventory((prev) => [...prev, newItem]);
    addAuditLog(`Registered inventory SKU ${newItem.sku}: ${newItem.name}`, 'Inventory', newItem.businessId);
  };

  const restockItem = (itemId: string, addQuantity: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: item.quantity + addQuantity,
              lastRestocked: new Date().toISOString().split('T')[0]
            }
          : item
      )
    );
    addAuditLog(`Restocked SKU item #${itemId} (+${addQuantity} units)`, 'Inventory');
  };

  // Personal Wealth
  const addPersonalAsset = (asset: Omit<PersonalAsset, 'id' | 'lastUpdated'>) => {
    const newAsset: PersonalAsset = {
      ...asset,
      id: `pa_${Date.now()}`,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setPersonalAssets((prev) => [...prev, newAsset]);
    addAuditLog(`Registered personal asset: ${newAsset.title} (${formatCurrency(newAsset.valuation)})`, 'Personal Wealth');
  };

  const updatePersonalAsset = (id: string, updates: Partial<PersonalAsset>) => {
    setPersonalAssets((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, ...updates, lastUpdated: new Date().toISOString().split('T')[0] } : a
      )
    );
    addAuditLog(`Updated personal asset valuation #${id}`, 'Personal Wealth');
  };

  const addPersonalLiability = (liability: Omit<PersonalLiability, 'id'>) => {
    const newLiab: PersonalLiability = {
      ...liability,
      id: `pl_${Date.now()}`
    };
    setPersonalLiabilities((prev) => [...prev, newLiab]);
    addAuditLog(`Added personal liability: ${newLiab.title} (${formatCurrency(newLiab.remainingBalance)})`, 'Personal Wealth');
  };

  const addPersonalIncomeDraw = (draw: Omit<PersonalIncomeDraw, 'id'>) => {
    const newDraw: PersonalIncomeDraw = {
      ...draw,
      id: `pid_${Date.now()}`
    };
    setPersonalIncomeDraws((prev) => [newDraw, ...prev]);
    addAuditLog(`Recorded personal dividend/income draw of ${formatCurrency(newDraw.amount)} from ${newDraw.source}`, 'Personal Wealth');
  };

  const calculateNetWorth = () => {
    const totalPersonalAssets = personalAssets.reduce((sum, a) => sum + a.valuation, 0);
    // User's business equity value = sum of (business.valuation * (business.ownerEquityPercentage / 100))
    const totalBusinessEquityValue = businesses.reduce((sum, b) => {
      return sum + (b.valuation * b.ownerEquityPercentage) / 100;
    }, 0);
    const totalAssets = totalPersonalAssets + totalBusinessEquityValue;
    const totalLiabilities = personalLiabilities.reduce((sum, l) => sum + l.remainingBalance, 0);
    const netWorth = totalAssets - totalLiabilities;

    return {
      totalPersonalAssets,
      totalBusinessEquityValue,
      totalAssets,
      totalLiabilities,
      netWorth
    };
  };

  // Documents & Comms
  const addVaultDocument = (doc: Omit<VaultDocument, 'id' | 'uploadDate'>) => {
    const newDoc: VaultDocument = {
      ...doc,
      id: `doc_${Date.now()}`,
      uploadDate: new Date().toISOString().split('T')[0]
    };
    setVaultDocuments((prev) => [newDoc, ...prev]);
    addAuditLog(`Uploaded document to secure vault: ${newDoc.title}`, 'Vault Documents', newDoc.businessId);
  };

  const sendMessage = (text: string, channel: string) => {
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      businessId: activeBusinessId !== 'CONSOLIDATED' ? activeBusinessId : undefined,
      channel,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, newMsg]);

    // Simulated contextual reply from team member after 1 second
    setTimeout(() => {
      const isFin = channel.includes('board') || channel.includes('finance');
      const replier = isFin ? initialUserProfiles[1] : initialUserProfiles[2];
      const autoReply: Message = {
        id: `msg_${Date.now() + 1}`,
        businessId: activeBusinessId !== 'CONSOLIDATED' ? activeBusinessId : undefined,
        channel,
        senderName: replier.name,
        senderAvatar: replier.avatar,
        text: `Understood, ${currentUser.name.split(' ')[0]}. I've noted this in our operational agenda.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, autoReply]);
    }, 1200);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Engineering & Bid Board Mutations
  const addBid = (bid: Omit<Bid, 'id' | 'createdAt'>) => {
    const newBid: Bid = {
      ...bid,
      id: `bid_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setBids((prev) => [newBid, ...prev]);
    addAuditLog(`Created new tender proposal: ${newBid.code} - ${newBid.title}`, 'Bid Board');
  };

  const updateBidStage = (bidId: string, stage: BidStage) => {
    setBids((prev) => prev.map((b) => (b.id === bidId ? { ...b, stage } : b)));
    addAuditLog(`Updated tender bid #${bidId} stage to ${stage}`, 'Bid Board');
  };

  const deleteBid = (bidId: string) => {
    setBids((prev) => prev.filter((b) => b.id !== bidId));
    addAuditLog(`Removed tender bid #${bidId}`, 'Bid Board');
  };

  // RFI Mutations
  const addRfi = (rfi: Omit<RFI, 'id' | 'createdAt' | 'responseCount'>) => {
    const newRfi: RFI = {
      ...rfi,
      id: `rfi_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      responseCount: 0
    };
    setRfis((prev) => [newRfi, ...prev]);
    addAuditLog(`Submitted technical RFI: ${newRfi.number} - ${newRfi.subject}`, 'RFIs');
  };

  const updateRfiStatus = (rfiId: string, status: RfiStatus) => {
    setRfis((prev) => prev.map((r) => (r.id === rfiId ? { ...r, status } : r)));
    addAuditLog(`Updated RFI #${rfiId} status to ${status}`, 'RFIs');
  };

  // Deliverables Mutations
  const addDeliverable = (deliverable: Omit<Deliverable, 'id'>) => {
    const newDel: Deliverable = {
      ...deliverable,
      id: `del_${Date.now()}`
    };
    setDeliverables((prev) => [newDel, ...prev]);
    addAuditLog(`Added project deliverable: ${newDel.code} (${newDel.title})`, 'Deliverables');
  };

  const updateDeliverableStatus = (deliverableId: string, status: DeliverableStatus) => {
    setDeliverables((prev) =>
      prev.map((d) =>
        d.id === deliverableId
          ? {
              ...d,
              status,
              completionPercentage: status === 'APPROVED' ? 100 : d.completionPercentage
            }
          : d
      )
    );
    addAuditLog(`Updated deliverable #${deliverableId} status to ${status}`, 'Deliverables');
  };

  const updateDeliverableProgress = (deliverableId: string, progress: number) => {
    setDeliverables((prev) =>
      prev.map((d) => (d.id === deliverableId ? { ...d, completionPercentage: progress } : d))
    );
  };

  // Responses Mutations
  const addResponse = (resp: Omit<ResponseRecord, 'id'>) => {
    const newResp: ResponseRecord = {
      ...resp,
      id: `resp_${Date.now()}`
    };
    setResponses((prev) => [newResp, ...prev]);
    if (newResp.referenceCode) {
      setRfis((prev) =>
        prev.map((r) =>
          r.number === newResp.referenceCode
            ? { ...r, responseCount: (r.responseCount || 0) + 1 }
            : r
        )
      );
    }
    addAuditLog(`Logged consultant/client response for ${newResp.referenceCode}`, 'Responses');
  };

  const updateResponseActionStatus = (
    responseId: string,
    status: 'PENDING_ACTION' | 'IN_PROGRESS' | 'RESOLVED'
  ) => {
    setResponses((prev) =>
      prev.map((r) => (r.id === responseId ? { ...r, actionStatus: status } : r))
    );
    addAuditLog(`Updated response action item #${responseId} status to ${status}`, 'Responses');
  };

  // Pricing Hub Mutations
  const addMaterialCost = (item: Omit<MaterialCostItem, 'id' | 'lastUpdated'>) => {
    const newMat: MaterialCostItem = {
      ...item,
      id: `mat_${Date.now()}`,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setMaterialCosts((prev) => [newMat, ...prev]);
    addAuditLog(`Added material catalog rate: ${newMat.name} (${newMat.code})`, 'Pricing Hub');
  };

  const addLaborCost = (item: Omit<LaborCostItem, 'id' | 'lastUpdated'>) => {
    const newLab: LaborCostItem = {
      ...item,
      id: `lab_${Date.now()}`,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setLaborCosts((prev) => [newLab, ...prev]);
    addAuditLog(`Added labor trade rate: ${newLab.trade}`, 'Pricing Hub');
  };

  // Attendance & Time-Clock Mutations
  const clockIn = (mode: 'ON_SITE' | 'OFFICE' | 'REMOTE' | 'FIELD' = 'OFFICE') => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toISOString().split('T')[0];
    setIsClockedIn(true);
    setClockInTime(timeStr);

    const newRecord: AttendanceRecord = {
      id: `att_${Date.now()}`,
      employeeId: currentUser.employeeId || 'emp_current',
      employeeName: currentUser.name,
      date: dateStr,
      clockIn: timeStr,
      mode,
      locationMode: mode,
      status: 'PRESENT'
    };
    setAttendanceRecords((prev) => [newRecord, ...prev]);
    addAuditLog(`Clocked IN at ${timeStr} (${mode})`, 'Attendance');
  };

  const clockOut = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setIsClockedIn(false);

    setAttendanceRecords((prev) =>
      prev.map((r, idx) => {
        if (idx === 0 && !r.clockOut) {
          return {
            ...r,
            clockOut: timeStr,
            totalHours: 8.5
          };
        }
        return r;
      })
    );
    addAuditLog(`Clocked OUT at ${timeStr}`, 'Attendance');
  };

  return (
    <BusinessContext.Provider
      value={{
        businesses,
        activeBusinessId,
        activeBusiness,
        userProfiles,
        currentUser,
        isEmployee,
        isClient,
        isHr,
        isFinance,
        isExecutive,
        currentEmployee,
        currentClient,
        portalType,
        activeTab,
        setActiveTab,
        switchBusiness,
        switchUser,
        registerEmployee,
        addBusiness,
        updateBusiness,
        formatCurrency,

        filteredPartners,
        filteredLeads,
        filteredClients,
        filteredInvoices,
        filteredQuotations,
        filteredProjects,
        filteredTasks,
        filteredEmployees,
        filteredPayrollRuns,
        filteredLeaveRequests,
        filteredExpenses,
        filteredPurchaseOrders,
        filteredBankAccounts,
        filteredInventory,
        filteredDocuments,
        filteredMessages,

        addPartner,
        recordPartnerPayout,
        addLead,
        updateLeadStage,
        convertLeadToClient,
        addClient,
        addInvoice,
        updateInvoiceStatus,
        addQuotation,
        convertQuotationToInvoice,
        addProject,
        toggleMilestone,
        addTask,
        updateTaskStatus,
        addEmployee,
        triggerPayrollRun,
        submitLeaveRequest,
        approveLeaveRequest,
        rejectLeaveRequest,
        addExpense,
        approveExpense,
        addPurchaseOrder,
        addBankAccount,
        addInventoryItem,
        restockItem,

        personalAssets,
        personalLiabilities,
        personalIncomeDraws,
        addPersonalAsset,
        updatePersonalAsset,
        addPersonalLiability,
        addPersonalIncomeDraw,
        calculateNetWorth,

        vaultDocuments,
        addVaultDocument,
        messages,
        sendMessage,
        notifications,
        markNotificationRead,
        dismissNotification,
        auditLogs,
        addAuditLog,

        // Permissions Manager
        rolePermissions,
        employeePermissions,
        toggleRolePermission,
        setRolePermissions,
        toggleEmployeePermission,
        setEmployeePermissions,
        resetRolePermissions,
        resetEmployeePermissions,
        hasTabPermission,
        getEffectivePermissions,

        // Engineering, Bidding & Employee Operations Hub
        bids,
        addBid,
        updateBidStage,
        deleteBid,

        rfis,
        addRfi,
        updateRfiStatus,

        deliverables,
        addDeliverable,
        updateDeliverableStatus,
        updateDeliverableProgress,

        responses,
        addResponse,
        updateResponseActionStatus,

        materialCosts,
        addMaterialCost,
        laborCosts,
        addLaborCost,

        attendanceRecords,
        isClockedIn,
        clockInTime,
        clockIn,
        clockOut,

        isAiAdvisorOpen,
        setIsAiAdvisorOpen
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};

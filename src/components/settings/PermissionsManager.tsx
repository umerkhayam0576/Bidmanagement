import React, { useState, useMemo } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  Users,
  User,
  Search,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  SlidersHorizontal,
  TrendingUp,
  Building,
  Receipt,
  FolderKanban,
  UserCheck,
  Wallet,
  Package,
  FileBarChart2,
  FolderLock,
  MessageSquare,
  History,
  Landmark,
  PieChart,
  LayoutDashboard,
  Check,
  X,
  ArrowRight,
  Briefcase,
  HelpCircle,
  FileCheck,
  Reply,
  Coins,
  CalendarClock
} from 'lucide-react';
import { useBusiness, NavigationTab, DEFAULT_ROLE_PERMISSIONS } from '../../context/BusinessContext';
import { Department, Employee } from '../../types';

interface ModuleMetadata {
  id: NavigationTab;
  name: string;
  category: 'Commercial' | 'Operations' | 'Compensation & HR' | 'Governance & System' | 'Engineering & Bidding';
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  recommendedFor: string[];
}

const ALL_MODULES: ModuleMetadata[] = [
  {
    id: 'bid-board',
    name: 'Bid Board & Estimating',
    category: 'Engineering & Bidding',
    description: 'Track construction and engineering tender packages, submit bid estimates, and manage win/loss stages.',
    icon: Briefcase,
    badge: 'Tenders',
    recommendedFor: ['ENGINEERING', 'OPERATIONS', 'SALES', 'EXECUTIVE']
  },
  {
    id: 'rfis',
    name: 'Requests for Information (RFIs)',
    category: 'Engineering & Bidding',
    description: 'Log and track technical clarification queries, drawing conflicts, spec questions, and engineer responses.',
    icon: HelpCircle,
    badge: 'Engineering',
    recommendedFor: ['ENGINEERING', 'OPERATIONS', 'EXECUTIVE']
  },
  {
    id: 'deliverables',
    name: 'Deliverables & Submittals',
    category: 'Engineering & Bidding',
    description: 'Track shop drawings, calculations, calculation packages, revision codes, and submittal progress.',
    icon: FileCheck,
    badge: 'Submittals',
    recommendedFor: ['ENGINEERING', 'OPERATIONS', 'CUSTOMER_SUCCESS', 'EXECUTIVE']
  },
  {
    id: 'responses',
    name: 'Consultant & Client Responses',
    category: 'Engineering & Bidding',
    description: 'Manage formal consultant reviews, approval dispositions (Code 1-4), and design action items.',
    icon: Reply,
    badge: 'Reviews',
    recommendedFor: ['ENGINEERING', 'OPERATIONS', 'CUSTOMER_SUCCESS', 'EXECUTIVE']
  },
  {
    id: 'pricing-hub',
    name: 'Pricing Hub (Material & Labor)',
    category: 'Engineering & Bidding',
    description: 'Browse verified material rates database, craft labor wages, union scales, and takeoff estimators.',
    icon: Coins,
    badge: 'Costing',
    recommendedFor: ['ENGINEERING', 'OPERATIONS', 'FINANCE', 'SALES', 'EXECUTIVE']
  },
  {
    id: 'attendance',
    name: 'Leaves & Shift Attendance',
    category: 'Compensation & HR',
    description: 'Daily shift punch-clock (office, jobsite, remote), timesheet history, and PTO/leave requests.',
    icon: CalendarClock,
    badge: 'Timecard',
    recommendedFor: ['ENGINEERING', 'PRODUCT', 'DESIGN', 'SALES', 'MARKETING', 'OPERATIONS', 'FINANCE', 'HR', 'LEGAL', 'CUSTOMER_SUCCESS', 'EXECUTIVE', 'GENERAL']
  },
  {
    id: 'crm',
    name: 'Sales Pipeline & CRM',
    category: 'Commercial',
    description: 'Manage sales deals, lead stages, customer contacts, and conversion pipelines.',
    icon: TrendingUp,
    badge: 'High Impact',
    recommendedFor: ['SALES', 'MARKETING', 'CUSTOMER_SUCCESS', 'EXECUTIVE']
  },
  {
    id: 'hr-payroll',
    name: 'HR & Staff Payroll',
    category: 'Compensation & HR',
    description: 'Access salary details, generated pay stubs, PTO requests, and employee compensation.',
    icon: UserCheck,
    badge: 'Confidential',
    recommendedFor: ['HR', 'FINANCE', 'EXECUTIVE', 'ENGINEERING', 'OPERATIONS', 'SALES', 'MARKETING', 'GENERAL']
  },
  {
    id: 'billing',
    name: 'Quotations & Invoicing',
    category: 'Commercial',
    description: 'Create and review client invoices, quotes, payment milestones, and billing history.',
    icon: Receipt,
    recommendedFor: ['SALES', 'FINANCE', 'EXECUTIVE']
  },
  {
    id: 'projects',
    name: 'Projects & Tasks',
    category: 'Operations',
    description: 'Interactive sprint boards, task assignments, status tracking, and milestone deliverables.',
    icon: FolderKanban,
    recommendedFor: ['ENGINEERING', 'PRODUCT', 'DESIGN', 'OPERATIONS', 'SALES', 'MARKETING', 'GENERAL', 'EXECUTIVE']
  },
  {
    id: 'finance',
    name: 'Finance & Expense Claims',
    category: 'Compensation & HR',
    description: 'Submit expense claims, track reimbursement approvals, company accounts, and card expenses.',
    icon: Wallet,
    recommendedFor: ['ENGINEERING', 'SALES', 'HR', 'OPERATIONS', 'FINANCE', 'GENERAL', 'EXECUTIVE']
  },
  {
    id: 'inventory',
    name: 'Inventory & Stock Logistics',
    category: 'Operations',
    description: 'Warehouse inventory SKUs, stock level monitors, supplier purchase orders, and reordering.',
    icon: Package,
    recommendedFor: ['OPERATIONS', 'EXECUTIVE']
  },
  {
    id: 'clients',
    name: 'Clients & Team Directory',
    category: 'Commercial',
    description: 'Comprehensive directory of enterprise clients, points of contact, and internal staff.',
    icon: Building,
    recommendedFor: ['SALES', 'HR', 'ENGINEERING', 'OPERATIONS', 'FINANCE', 'GENERAL', 'EXECUTIVE']
  },
  {
    id: 'documents',
    name: 'Document Vault & Policies',
    category: 'Governance & System',
    description: 'Company operating handbook, security policies, standard contracts, and compliance NDAs.',
    icon: FolderLock,
    recommendedFor: ['ENGINEERING', 'HR', 'LEGAL', 'OPERATIONS', 'FINANCE', 'GENERAL', 'EXECUTIVE']
  },
  {
    id: 'messages',
    name: 'Team Communications',
    category: 'Governance & System',
    description: 'Real-time internal department chat channels, direct messages, and team notifications.',
    icon: MessageSquare,
    recommendedFor: ['ENGINEERING', 'SALES', 'HR', 'OPERATIONS', 'FINANCE', 'MARKETING', 'GENERAL', 'EXECUTIVE']
  },
  {
    id: 'reports',
    name: 'Executive Reports & P&L',
    category: 'Governance & System',
    description: 'Consolidated profit and loss statements, margins, tax summaries, and executive metrics.',
    icon: FileBarChart2,
    badge: 'Executive',
    recommendedFor: ['FINANCE', 'EXECUTIVE']
  },
  {
    id: 'audit-logs',
    name: 'Compliance Audit Trail',
    category: 'Governance & System',
    description: 'Timestamped immutable security log of all system actions, data updates, and authentication events.',
    icon: History,
    badge: 'SOC-2',
    recommendedFor: ['LEGAL', 'EXECUTIVE']
  },
  {
    id: 'partners',
    name: 'Partners & Cap Table',
    category: 'Governance & System',
    description: 'Equity allocations, shareholder cap table stakes, and profit distributions.',
    icon: PieChart,
    badge: 'Confidential',
    recommendedFor: ['EXECUTIVE']
  },
  {
    id: 'personal-wealth',
    name: 'Personal Wealth Command',
    category: 'Governance & System',
    description: 'Founder net worth calculation, private assets, personal liabilities, and wealth distribution.',
    icon: Landmark,
    badge: 'Private',
    recommendedFor: ['EXECUTIVE']
  },
  {
    id: 'overview',
    name: 'Personal Workspace Dashboard',
    category: 'Operations',
    description: 'Personalized employee entry portal with assigned tasks, quick stats, and company announcements.',
    icon: LayoutDashboard,
    recommendedFor: ['ENGINEERING', 'SALES', 'HR', 'OPERATIONS', 'FINANCE', 'MARKETING', 'PRODUCT', 'DESIGN', 'LEGAL', 'CUSTOMER_SUCCESS', 'GENERAL', 'EXECUTIVE']
  }
];

interface RoleInfo {
  id: string;
  name: string;
  department: Department;
  description: string;
  badge: string;
}

const ROLE_DEFINITIONS: RoleInfo[] = [
  {
    id: 'ENGINEERING',
    name: 'Engineering & Technical Staff',
    department: 'ENGINEERING',
    description: 'Software engineers, architects, DevOps, and technical infrastructure leads.',
    badge: 'Tech & Product'
  },
  {
    id: 'SALES',
    name: 'Sales & Business Development',
    department: 'SALES',
    description: 'Account executives, enterprise sales directors, lead generators, and deal closers.',
    badge: 'Commercial'
  },
  {
    id: 'HR',
    name: 'People Operations & HR',
    department: 'HR',
    description: 'Talent managers, HR coordinators, compensation specialists, and recruiters.',
    badge: 'People & Culture'
  },
  {
    id: 'OPERATIONS',
    name: 'Operations & Supply Chain',
    department: 'OPERATIONS',
    description: 'Facility managers, logistics leads, quality directors, and inventory controllers.',
    badge: 'Logistics & Ops'
  },
  {
    id: 'FINANCE',
    name: 'Finance & Accounting',
    department: 'FINANCE',
    description: 'Financial controllers, accountants, bookkeepers, and revenue operations.',
    badge: 'Fiscal'
  },
  {
    id: 'MARKETING',
    name: 'Marketing & Brand Growth',
    department: 'MARKETING',
    description: 'Growth marketers, brand directors, content producers, and campaign leads.',
    badge: 'Growth'
  },
  {
    id: 'GENERAL',
    name: 'General Staff / Standard',
    department: 'OPERATIONS',
    description: 'General employees, cross-functional staff, and contractors without specific department templates.',
    badge: 'Standard'
  }
];

export const PermissionsManager: React.FC = () => {
  const {
    rolePermissions,
    employeePermissions,
    toggleRolePermission,
    setRolePermissions,
    toggleEmployeePermission,
    resetRolePermissions,
    resetEmployeePermissions,
    getEffectivePermissions,
    employees,
    userProfiles,
    switchUser,
    currentUser,
    isEmployee
  } = useBusiness();

  // Mode: 'ROLE' (Template by Role/Department) or 'EMPLOYEE' (Specific Individual Account)
  const [managerMode, setManagerMode] = useState<'ROLE' | 'EMPLOYEE'>('ROLE');
  const [selectedRoleId, setSelectedRoleId] = useState<string>('SALES');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(
    employees[0]?.id || 'emp_alex'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [lastActionNotification, setLastActionNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setLastActionNotification(msg);
    setTimeout(() => {
      setLastActionNotification((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  // Selected Employee object
  const currentSelectedEmployee = useMemo(() => {
    return employees.find((e) => e.id === selectedEmployeeId) || employees[0] || null;
  }, [employees, selectedEmployeeId]);

  // Selected Role definition
  const currentSelectedRole = useMemo(() => {
    return ROLE_DEFINITIONS.find((r) => r.id === selectedRoleId) || ROLE_DEFINITIONS[0];
  }, [selectedRoleId]);

  // Count employees in each role
  const employeesPerRole = useMemo(() => {
    const counts: Record<string, number> = {};
    employees.forEach((emp) => {
      const dept = emp.department || 'GENERAL';
      counts[dept] = (counts[dept] || 0) + 1;
    });
    return counts;
  }, [employees]);

  // Active permissions for the currently selected target
  const activePermissionsForTarget = useMemo(() => {
    if (managerMode === 'ROLE') {
      return (
        rolePermissions[selectedRoleId] ||
        DEFAULT_ROLE_PERMISSIONS[selectedRoleId] ||
        DEFAULT_ROLE_PERMISSIONS['GENERAL'] ||
        []
      );
    } else {
      if (employeePermissions[selectedEmployeeId]) {
        return employeePermissions[selectedEmployeeId];
      }
      // Inherits role
      const empDept = currentSelectedEmployee?.department || 'GENERAL';
      return (
        rolePermissions[empDept] ||
        DEFAULT_ROLE_PERMISSIONS[empDept] ||
        DEFAULT_ROLE_PERMISSIONS['GENERAL'] ||
        []
      );
    }
  }, [
    managerMode,
    selectedRoleId,
    selectedEmployeeId,
    rolePermissions,
    employeePermissions,
    currentSelectedEmployee
  ]);

  const hasCustomOverride = Boolean(
    managerMode === 'EMPLOYEE' && employeePermissions[selectedEmployeeId]
  );

  // Filter modules
  const filteredModules = useMemo(() => {
    return ALL_MODULES.filter((mod) => {
      const matchesSearch =
        mod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mod.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === 'ALL' || mod.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, categoryFilter]);

  // Handle module toggle
  const handleToggleModule = (moduleId: NavigationTab) => {
    const willBeEnabled = !activePermissionsForTarget.includes(moduleId);
    const modObj = ALL_MODULES.find((m) => m.id === moduleId);
    const modTitle = modObj ? modObj.name : moduleId;

    if (managerMode === 'ROLE') {
      toggleRolePermission(selectedRoleId, moduleId);
      showNotification(
        `${modTitle} is now ${willBeEnabled ? 'GRANTED (Visible in Sidebar)' : 'DISABLED (Restricted)'} for all ${currentSelectedRole.name} staff.`
      );
    } else {
      toggleEmployeePermission(selectedEmployeeId, moduleId);
      const empName = currentSelectedEmployee
        ? `${currentSelectedEmployee.firstName} ${currentSelectedEmployee.lastName}`
        : selectedEmployeeId;
      showNotification(
        `${modTitle} is now ${willBeEnabled ? 'GRANTED' : 'DISABLED'} specifically for ${empName}.`
      );
    }
  };

  // Bulk actions
  const handleGrantAll = () => {
    const allTabIds = ALL_MODULES.map((m) => m.id);
    if (managerMode === 'ROLE') {
      setRolePermissions(selectedRoleId, allTabIds);
      showNotification(`All 14 modules granted to ${currentSelectedRole.name}.`);
    } else {
      // Toggle for employee
      allTabIds.forEach((t) => {
        if (!activePermissionsForTarget.includes(t)) {
          toggleEmployeePermission(selectedEmployeeId, t);
        }
      });
      showNotification(`All modules enabled for employee.`);
    }
  };

  const handleRestrictToEssentials = () => {
    const essentials: NavigationTab[] = ['overview', 'documents', 'messages'];
    if (managerMode === 'ROLE') {
      setRolePermissions(selectedRoleId, essentials);
      showNotification(`Restricted ${currentSelectedRole.name} to essential communications & portal only.`);
    } else {
      essentials.forEach((t) => {
        if (!activePermissionsForTarget.includes(t)) {
          toggleEmployeePermission(selectedEmployeeId, t);
        }
      });
      ALL_MODULES.forEach((m) => {
        if (!essentials.includes(m.id) && activePermissionsForTarget.includes(m.id)) {
          toggleEmployeePermission(selectedEmployeeId, m.id);
        }
      });
      showNotification(`Restricted employee to essentials.`);
    }
  };

  const handleResetDefaults = () => {
    if (managerMode === 'ROLE') {
      resetRolePermissions(selectedRoleId);
      showNotification(`Reset ${currentSelectedRole.name} to recommended default permissions.`);
    } else {
      resetEmployeePermissions(selectedEmployeeId);
      showNotification(`Cleared custom overrides. Employee now inherits ${currentSelectedEmployee?.department || 'Department'} role defaults.`);
    }
  };

  // Switch to simulate view
  const handleTestAsRole = () => {
    // Find an employee with this role or profile
    let targetProfile = userProfiles.find((u) => {
      if (managerMode === 'EMPLOYEE') {
        return u.employeeId === selectedEmployeeId || u.email === currentSelectedEmployee?.email;
      }
      return u.department === selectedRoleId || (u.title && u.title.toLowerCase().includes(selectedRoleId.toLowerCase()));
    });

    if (!targetProfile) {
      // Find any employee profile
      targetProfile = userProfiles.find((u) => u.globalRole === 'EMPLOYEE');
    }

    if (targetProfile) {
      switchUser(targetProfile.id);
      showNotification(`Switched interface to test as ${targetProfile.name} (${targetProfile.title}). Check the Sidebar to see dynamic updates!`);
    }
  };

  return (
    <div id="permissions-manager-root" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 lg:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase font-extrabold tracking-widest text-emerald-400">
              <Shield className="w-4 h-4" />
              <span>Access Control Engine</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Live Sidebar & Route Enforcement
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white mt-1">
              Dynamic Permissions Manager
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Toggle specific modules like <span className="text-emerald-400 font-semibold">CRM</span>,{' '}
              <span className="text-emerald-400 font-semibold">Payroll</span>, Invoicing, and Inventory for individual employee roles or specific team members. Toggled modules immediately show or hide in the Sidebar navigation and enforce route authorization guards.
            </p>
          </div>

          {/* Mode Switcher Pill */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 self-start md:self-auto">
            <button
              id="perm-mode-role-btn"
              onClick={() => setManagerMode('ROLE')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                managerMode === 'ROLE'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>By Role / Department</span>
            </button>
            <button
              id="perm-mode-employee-btn"
              onClick={() => setManagerMode('EMPLOYEE')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                managerMode === 'EMPLOYEE'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>By Individual Employee</span>
            </button>
          </div>
        </div>

        {/* Action Confirmation Banner */}
        {lastActionNotification && (
          <div className="mt-4 flex items-center justify-between gap-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-4 py-2.5 rounded-xl font-medium animate-in fade-in slide-in-from-top-1">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{lastActionNotification}</span>
            </div>
            <button
              onClick={() => setLastActionNotification(null)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Target Selector Grid */}
      {managerMode === 'ROLE' ? (
        /* Role Selection Cards */
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {ROLE_DEFINITIONS.map((role) => {
            const isSelected = role.id === selectedRoleId;
            const staffCount = employeesPerRole[role.id] || 0;
            const currentPerms =
              rolePermissions[role.id] ||
              DEFAULT_ROLE_PERMISSIONS[role.id] ||
              DEFAULT_ROLE_PERMISSIONS['GENERAL'] ||
              [];

            return (
              <button
                key={role.id}
                id={`perm-role-select-${role.id.toLowerCase()}`}
                onClick={() => setSelectedRoleId(role.id)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-500/10 border-emerald-500/50 shadow-xs'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded font-bold ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {role.badge}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{role.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                    {staffCount} active staff
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Modules</span>
                  <span className={isSelected ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                    {currentPerms.length}/{ALL_MODULES.length}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        /* Individual Employee Selection Bar */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="text-slate-400 font-medium">Select Staff Member to Override:</span>
            {hasCustomOverride ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <ShieldAlert className="w-3 h-3" /> Custom Overrides Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                <Check className="w-3 h-3 text-emerald-400" /> Inheriting {currentSelectedEmployee?.department} Role
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
            {employees.map((emp) => {
              const isSelected = emp.id === selectedEmployeeId;
              const hasOverride = Boolean(employeePermissions[emp.id]);
              return (
                <button
                  key={emp.id}
                  id={`perm-emp-select-${emp.id}`}
                  onClick={() => setSelectedEmployeeId(emp.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500/50'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                      {emp.firstName[0]}
                      {emp.lastName[0]}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">
                        {emp.firstName} {emp.lastName}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {emp.role} • {emp.department}
                      </div>
                    </div>
                  </div>
                  {hasOverride && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold shrink-0">
                      CUSTOM
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Target Details & Control Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
            {managerMode === 'ROLE' ? (
              <ShieldCheck className="w-6 h-6" />
            ) : (
              <User className="w-6 h-6" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">
                {managerMode === 'ROLE'
                  ? currentSelectedRole.name
                  : `${currentSelectedEmployee?.firstName} ${currentSelectedEmployee?.lastName}`}
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full font-mono font-bold bg-slate-800 text-emerald-400 border border-slate-700">
                {activePermissionsForTarget.length} of 14 Modules Enabled
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {managerMode === 'ROLE'
                ? currentSelectedRole.description
                : `${currentSelectedEmployee?.role} • Department: ${currentSelectedEmployee?.department} • Email: ${currentSelectedEmployee?.email}`}
            </p>
          </div>
        </div>

        {/* Action Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="perm-grant-all-btn"
            onClick={handleGrantAll}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Unlock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Grant All</span>
          </button>

          <button
            id="perm-restrict-essentials-btn"
            onClick={handleRestrictToEssentials}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Essentials Only</span>
          </button>

          <button
            id="perm-reset-defaults-btn"
            onClick={handleResetDefaults}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
            <span>Reset Defaults</span>
          </button>

          <button
            id="perm-simulate-test-btn"
            onClick={handleTestAsRole}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-sm shadow-emerald-500/20 transition-all flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview & Test View</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="perm-search-input"
            type="text"
            placeholder="Search module (e.g. Payroll, CRM)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['ALL', 'Engineering & Bidding', 'Commercial', 'Compensation & HR', 'Operations', 'Governance & System'].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  categoryFilter === cat
                    ? 'bg-slate-800 text-emerald-400 font-bold border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'ALL' ? `All Modules (${ALL_MODULES.length})` : cat}
              </button>
            )
          )}
        </div>
      </div>

      {/* Modules Toggle Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredModules.map((module) => {
          const Icon = module.icon;
          const isAllowed = activePermissionsForTarget.includes(module.id);
          const isKeyModule = module.id === 'crm' || module.id === 'hr-payroll';

          return (
            <div
              key={module.id}
              id={`perm-module-card-${module.id}`}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                isAllowed
                  ? 'bg-slate-900 border-slate-800 hover:border-slate-700 shadow-xs'
                  : 'bg-slate-950/70 border-slate-800/60 opacity-80 hover:opacity-100'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isAllowed
                          ? isKeyModule
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-slate-800/80 text-slate-500 border border-slate-700/60'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-white">{module.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-slate-800 text-slate-400">
                          {module.category}
                        </span>
                        {isKeyModule && (
                          <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Key Module
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {module.description}
                      </p>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    id={`perm-toggle-${module.id}`}
                    type="button"
                    role="switch"
                    aria-checked={isAllowed}
                    onClick={() => handleToggleModule(module.id)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                      isAllowed ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        isAllowed ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Status and Recommendation Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  {isAllowed ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                      <Check className="w-3.5 h-3.5" />
                      <span>Active in Sidebar & Authorized</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-slate-500 font-medium">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Hidden from Sidebar & Guarded</span>
                    </span>
                  )}
                </div>

                <div className="text-slate-500 font-mono text-[10px]">
                  Tab ID: <span className="text-slate-400 font-bold">{module.id}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Verification Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Instant Reactive Propagation</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Permissions are synchronized in state and localStorage. Any employee viewing this workspace immediately receives updated navigation tabs in the Sidebar and updated route guards in App.tsx.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEmployee ? (
            <button
              onClick={() => {
                const exec = userProfiles.find(
                  (u) => u.globalRole === 'SUPER_OWNER' || u.globalRole === 'EXECUTIVE'
                );
                if (exec) switchUser(exec.id);
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-white hover:bg-slate-700 transition-colors flex items-center gap-1.5"
            >
              <span>Return to Executive View</span>
            </button>
          ) : (
            <button
              onClick={handleTestAsRole}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-md shadow-emerald-500/20 transition-colors flex items-center gap-1.5"
            >
              <span>Test Current Configuration</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

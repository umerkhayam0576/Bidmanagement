import React from 'react';
import {
  LayoutDashboard,
  ShieldCheck,
  Users2,
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
  Settings,
  Sparkles,
  PieChart,
  Landmark,
  Briefcase,
  HelpCircle,
  FileCheck,
  Reply,
  Coins,
  CalendarClock
} from 'lucide-react';
import { useBusiness, NavigationTab } from '../../context/BusinessContext';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    activeBusiness,
    activeBusinessId,
    calculateNetWorth,
    formatCurrency,
    isEmployee,
    isClient,
    isHr,
    isFinance,
    isExecutive,
    currentUser,
    currentEmployee,
    currentClient,
    userProfiles,
    switchUser,
    hasTabPermission
  } = useBusiness();

  const netWorthData = calculateNetWorth();

  // Navigation structure adapted for Employee vs Executive/Owner
  const executiveNavGroups: {
    label: string;
    items: {
      id: NavigationTab;
      label: string;
      icon: React.ComponentType<{ className?: string }>;
      badge?: string;
    }[];
  }[] = [
    {
      label: 'Core & Holdings',
      items: [
        { id: 'overview', label: 'Executive Command', icon: LayoutDashboard },
        { id: 'personal-wealth', label: 'Personal Wealth', icon: Landmark, badge: 'Net Worth' },
        { id: 'partners', label: 'Partners & Ownership', icon: PieChart }
      ]
    },
    {
      label: 'Commercial Engine',
      items: [
        { id: 'crm', label: 'Sales & CRM', icon: TrendingUp },
        { id: 'bid-board', label: 'Bids & Estimates', icon: Briefcase },
        { id: 'pricing-hub', label: 'Pricing Hub (Rates)', icon: Coins },
        { id: 'clients', label: 'Clients Directory', icon: Building },
        { id: 'billing', label: 'Quotations & Invoices', icon: Receipt },
        { id: 'projects', label: 'Projects & Tasks', icon: FolderKanban }
      ]
    },
    {
      label: 'Engineering & Operations',
      items: [
        { id: 'rfis', label: 'RFIs (Technical Queries)', icon: HelpCircle },
        { id: 'deliverables', label: 'Deliverables & Submittals', icon: FileCheck },
        { id: 'responses', label: 'Consultant Responses', icon: Reply },
        { id: 'attendance', label: 'Leaves & Attendance', icon: CalendarClock },
        { id: 'hr-payroll', label: 'HR & Payroll', icon: UserCheck },
        { id: 'finance', label: 'Finance & Expenses', icon: Wallet },
        { id: 'inventory', label: 'Inventory & Stock', icon: Package }
      ]
    },
    {
      label: 'Governance & Comms',
      items: [
        { id: 'reports', label: 'Reports & P&L', icon: FileBarChart2 },
        { id: 'documents', label: 'Document Vault', icon: FolderLock },
        { id: 'messages', label: 'Team Messages', icon: MessageSquare },
        { id: 'audit-logs', label: 'Audit Logs', icon: History },
        { id: 'settings', label: 'Settings & RBAC', icon: Settings }
      ]
    }
  ];

  // Full candidate employee navigation items governed dynamically by Permissions Manager
  const employeeAllNavGroups: {
    label: string;
    items: {
      id: NavigationTab;
      label: string;
      icon: React.ComponentType<{ className?: string }>;
      badge?: string;
    }[];
  }[] = [
    {
      label: 'My Workspace',
      items: [
        { id: 'overview', label: 'My Dashboard', icon: LayoutDashboard, badge: 'Portal' },
        { id: 'attendance', label: 'Leaves & Attendance', icon: CalendarClock, badge: 'Shift' },
        { id: 'projects', label: 'My Tasks & Projects', icon: FolderKanban }
      ]
    },
    {
      label: 'Bidding & Cost Database',
      items: [
        { id: 'bid-board', label: 'Bid Board (Tenders)', icon: Briefcase },
        { id: 'pricing-hub', label: 'Pricing Hub (Rates)', icon: Coins }
      ]
    },
    {
      label: 'Engineering & Site Flow',
      items: [
        { id: 'rfis', label: 'Technical RFIs', icon: HelpCircle },
        { id: 'deliverables', label: 'Deliverables / Drawings', icon: FileCheck },
        { id: 'responses', label: 'Reviews & Responses', icon: Reply }
      ]
    },
    {
      label: 'Commercial & Sales',
      items: [
        { id: 'crm', label: 'Sales CRM & Deals', icon: TrendingUp },
        { id: 'billing', label: 'Invoicing & Quotes', icon: Receipt }
      ]
    },
    {
      label: 'Compensation & HR',
      items: [
        { id: 'hr-payroll', label: 'My Payslips & Leave', icon: UserCheck },
        { id: 'finance', label: 'Expense Claims', icon: Wallet }
      ]
    },
    {
      label: 'Operations & Assets',
      items: [
        { id: 'inventory', label: 'Inventory & Stock', icon: Package },
        { id: 'reports', label: 'Reports & Analytics', icon: FileBarChart2 }
      ]
    },
    {
      label: 'Company & Team',
      items: [
        { id: 'clients', label: 'Team & Directory', icon: Building },
        { id: 'messages', label: 'Team Messages', icon: MessageSquare },
        { id: 'documents', label: 'Handbook & Policies', icon: FolderLock }
      ]
    },
    {
      label: 'Governance & Equity',
      items: [
        { id: 'audit-logs', label: 'Audit Trail', icon: History },
        { id: 'partners', label: 'Partners & Equity', icon: PieChart },
        { id: 'personal-wealth', label: 'Personal Wealth', icon: Landmark }
      ]
    }
  ];

  // Client Navigation Groups
  const clientNavGroups: {
    label: string;
    items: {
      id: NavigationTab;
      label: string;
      icon: React.ComponentType<{ className?: string }>;
      badge?: string;
    }[];
  }[] = [
    {
      label: 'Client Portal',
      items: [
        { id: 'overview', label: 'Client Dashboard', icon: LayoutDashboard, badge: 'Portal' },
        { id: 'projects', label: 'Contracted Projects', icon: FolderKanban },
        { id: 'billing', label: 'Invoices & Billing', icon: Receipt },
        { id: 'deliverables', label: 'Submittals & Approvals', icon: FileCheck },
        { id: 'rfis', label: 'Technical RFIs', icon: HelpCircle },
        { id: 'messages', label: 'Project Messages', icon: MessageSquare }
      ]
    }
  ];

  // HR & People Navigation Groups
  const hrNavGroups: {
    label: string;
    items: {
      id: NavigationTab;
      label: string;
      icon: React.ComponentType<{ className?: string }>;
      badge?: string;
    }[];
  }[] = [
    {
      label: 'People Operations',
      items: [
        { id: 'overview', label: 'HR Dashboard', icon: LayoutDashboard, badge: 'HR' },
        { id: 'hr-payroll', label: 'Payroll & Leave Approvals', icon: UserCheck },
        { id: 'attendance', label: 'Shift Attendance Rosters', icon: CalendarClock },
        { id: 'clients', label: 'Staff Directory', icon: Users2 },
        { id: 'documents', label: 'Policies & Contracts', icon: FolderLock },
        { id: 'messages', label: 'Staff Communications', icon: MessageSquare }
      ]
    }
  ];

  // Dynamically filter employee nav groups based on permissions
  const employeeNavGroups = employeeAllNavGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => hasTabPermission(item.id))
    }))
    .filter((group) => group.items.length > 0);

  const navGroups = isClient
    ? clientNavGroups
    : isHr
    ? hrNavGroups
    : isEmployee
    ? employeeNavGroups
    : executiveNavGroups;
  const executiveProfile = userProfiles.find(
    (u) => u.globalRole === 'SUPER_OWNER' || u.globalRole === 'EXECUTIVE'
  );

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col shrink-0 h-[calc(100vh-4rem)] select-none">
      {/* Scrollable Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navGroups.map((group) => (
          <div key={group.label}>
            <div className="px-3 mb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {group.label}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all group ${
                      isActive
                        ? isClient
                          ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                          : isHr
                          ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive
                            ? isClient
                              ? 'text-blue-400'
                              : isHr
                              ? 'text-purple-400'
                              : 'text-emerald-400'
                            : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                          isClient
                            ? 'bg-blue-500/20 text-blue-300'
                            : isHr
                            ? 'bg-purple-500/20 text-purple-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Ownership / Equity or Role-Specific Portal Snapshot Card */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        {isClient ? (
          <div id="sidebar-client-card" className="bg-slate-850 p-3 rounded-xl border border-blue-500/30 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-semibold text-blue-400 uppercase tracking-wider text-[10px]">
                Client Portal
              </span>
              <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                AUTHORIZED
              </span>
            </div>
            <div>
              <div className="text-xs font-semibold text-white truncate">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {currentClient?.company || currentUser.title}
              </div>
            </div>
            <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800 flex items-center justify-between">
              <span>{activeBusiness?.name || 'Assigned Vendor'}</span>
              {executiveProfile && (
                <button
                  onClick={() => switchUser(executiveProfile.id)}
                  className="text-blue-400 hover:text-blue-300 font-medium"
                >
                  Exec View
                </button>
              )}
            </div>
          </div>
        ) : isHr ? (
          <div id="sidebar-hr-card" className="bg-slate-850 p-3 rounded-xl border border-purple-500/30 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-semibold text-purple-400 uppercase tracking-wider text-[10px]">
                HR & People Lead
              </span>
              <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">
                LEAD
              </span>
            </div>
            <div>
              <div className="text-xs font-semibold text-white truncate">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-purple-300 truncate">
                {currentUser.title}
              </div>
            </div>
            <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800 flex items-center justify-between">
              <span>{activeBusiness?.name || 'Headquarters'}</span>
              {executiveProfile && (
                <button
                  onClick={() => switchUser(executiveProfile.id)}
                  className="text-purple-400 hover:text-purple-300 font-medium"
                >
                  Exec View
                </button>
              )}
            </div>
          </div>
        ) : isEmployee ? (
          <div id="sidebar-employee-card" className="bg-slate-850 p-3 rounded-xl border border-emerald-500/20 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-semibold text-emerald-400 uppercase tracking-wider text-[10px]">
                Employee Workspace
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                ACTIVE
              </span>
            </div>
            <div>
              <div className="text-xs font-semibold text-white truncate">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {currentUser.title}
              </div>
            </div>
            <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800 flex items-center justify-between">
              <span>{activeBusiness?.name || 'Assigned Business'}</span>
              {executiveProfile && (
                <button
                  onClick={() => switchUser(executiveProfile.id)}
                  className="text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  Exec View
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-slate-850 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>
                {activeBusinessId === 'CONSOLIDATED' ? 'Total Net Worth' : "Your Equity Value"}
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                {activeBusinessId === 'CONSOLIDATED'
                  ? 'Portfolio'
                  : `${activeBusiness?.ownerEquityPercentage}% Ownership`}
              </span>
            </div>
            <div className="text-base font-extrabold text-white font-mono mt-1">
              {activeBusinessId === 'CONSOLIDATED'
                ? formatCurrency(netWorthData.netWorth, 'USD')
                : formatCurrency(
                    ((activeBusiness?.valuation || 0) * (activeBusiness?.ownerEquityPercentage || 0)) / 100,
                    activeBusiness?.currency
                  )}
            </div>
            <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
              <span>Entity:</span>
              <span className="font-semibold text-slate-300 truncate max-w-[130px]">
                {activeBusinessId === 'CONSOLIDATED' ? 'All Holdings' : activeBusiness?.name}
              </span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

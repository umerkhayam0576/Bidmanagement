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
  Landmark
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
    currentUser,
    currentEmployee,
    userProfiles,
    switchUser
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
        { id: 'clients', label: 'Clients Directory', icon: Building },
        { id: 'billing', label: 'Quotations & Invoices', icon: Receipt },
        { id: 'projects', label: 'Projects & Tasks', icon: FolderKanban }
      ]
    },
    {
      label: 'Operations & Assets',
      items: [
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

  const employeeNavGroups: {
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
        { id: 'projects', label: 'My Tasks & Projects', icon: FolderKanban },
        { id: 'hr-payroll', label: 'My Payslips & Leave', icon: UserCheck },
        { id: 'finance', label: 'Expense Claims', icon: Wallet }
      ]
    },
    {
      label: 'Company & Team',
      items: [
        { id: 'clients', label: 'Team Directory', icon: Building },
        { id: 'messages', label: 'Team Messages', icon: MessageSquare },
        { id: 'documents', label: 'Handbook & Policies', icon: FolderLock }
      ]
    }
  ];

  const navGroups = isEmployee ? employeeNavGroups : executiveNavGroups;
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
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive
                            ? 'text-emerald-400'
                            : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
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

      {/* Bottom Ownership / Equity or Employee Portal Snapshot Card */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        {isEmployee ? (
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

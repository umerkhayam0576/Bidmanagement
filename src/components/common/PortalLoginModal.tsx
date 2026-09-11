import React from 'react';
import {
  UserCheck,
  Building2,
  Users2,
  Wallet,
  Crown,
  Check,
  ArrowRight,
  Shield,
  Layers,
  X,
  Sparkles
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';

interface PortalLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PortalLoginModal: React.FC<PortalLoginModalProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    userProfiles,
    switchUser,
    portalType
  } = useBusiness();

  if (!isOpen) return null;

  // Group user profiles by role archetype
  const employeeProfiles = userProfiles.filter((u) => u.globalRole === 'EMPLOYEE');
  const clientProfiles = userProfiles.filter((u) => u.globalRole === 'CLIENT');
  const hrProfiles = userProfiles.filter((u) => u.globalRole === 'HR_MANAGER' || u.department === 'HR');
  const financeProfiles = userProfiles.filter((u) => u.globalRole === 'FINANCE_LEAD');
  const executiveProfiles = userProfiles.filter((u) => u.globalRole === 'SUPER_OWNER' || u.globalRole === 'EXECUTIVE');

  const handleSelectRole = (userId: string) => {
    switchUser(userId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 animate-in fade-in zoom-in-95 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Portal Authentication & Access Control
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white mt-1">
              Select Your Portal View
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Log in to test role-isolated portals. Each role strictly sees only their authorized views and modules.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Portal Options */}
        <div className="space-y-4">
          {/* 1. Employee Portal */}
          <div className="bg-slate-850 border border-slate-800 hover:border-emerald-500/40 rounded-xl p-4 transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Employee Portal</span>
                    <span className="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 px-1.5 py-0.2 rounded">
                      Staff Workspace
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Shift attendance punch-in, assigned tasks, engineering deliverables, payslips & leaves.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800/80">
              {employeeProfiles.map((user) => {
                const isCurrent = currentUser.id === user.id;
                return (
                  <button
                    key={user.id}
                    onClick={() => handleSelectRole(user.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-colors ${
                      isCurrent
                        ? 'bg-emerald-500/20 border-emerald-500 text-white'
                        : 'bg-slate-900 border-slate-800 hover:bg-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-7 h-7 rounded-full object-cover shrink-0 border border-emerald-400/50"
                      />
                      <div className="truncate">
                        <div className="text-xs font-bold truncate">{user.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{user.title}</div>
                      </div>
                    </div>
                    {isCurrent ? (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Client Portal */}
          <div className="bg-slate-850 border border-slate-800 hover:border-blue-500/40 rounded-xl p-4 transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Client Portal</span>
                    <span className="text-[10px] font-mono uppercase bg-blue-500/10 text-blue-400 px-1.5 py-0.2 rounded">
                      Client Access
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Contracted project milestones, submittals review, billing statements, and technical RFIs.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800/80">
              {clientProfiles.map((user) => {
                const isCurrent = currentUser.id === user.id;
                return (
                  <button
                    key={user.id}
                    onClick={() => handleSelectRole(user.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-colors ${
                      isCurrent
                        ? 'bg-blue-500/20 border-blue-500 text-white'
                        : 'bg-slate-900 border-slate-800 hover:bg-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-7 h-7 rounded-full object-cover shrink-0 border border-blue-400/50"
                      />
                      <div className="truncate">
                        <div className="text-xs font-bold truncate">{user.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{user.title}</div>
                      </div>
                    </div>
                    {isCurrent ? (
                      <Check className="w-4 h-4 text-blue-400 shrink-0 ml-2" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. HR & People Operations Portal */}
          <div className="bg-slate-850 border border-slate-800 hover:border-purple-500/40 rounded-xl p-4 transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold">
                  <Users2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>HR & People Portal</span>
                    <span className="text-[10px] font-mono uppercase bg-purple-500/10 text-purple-400 px-1.5 py-0.2 rounded">
                      HR Management
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Workforce directory, daily shift attendance, approve/reject leave requests, monthly payroll.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800/80">
              {hrProfiles.map((user) => {
                const isCurrent = currentUser.id === user.id;
                return (
                  <button
                    key={user.id}
                    onClick={() => handleSelectRole(user.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-colors ${
                      isCurrent
                        ? 'bg-purple-500/20 border-purple-500 text-white'
                        : 'bg-slate-900 border-slate-800 hover:bg-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-7 h-7 rounded-full object-cover shrink-0 border border-purple-400/50"
                      />
                      <div className="truncate">
                        <div className="text-xs font-bold truncate">{user.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{user.title}</div>
                      </div>
                    </div>
                    {isCurrent ? (
                      <Check className="w-4 h-4 text-purple-400 shrink-0 ml-2" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Executive Command & Leadership */}
          <div className="bg-slate-850 border border-slate-800 hover:border-indigo-500/40 rounded-xl p-4 transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
                  <Crown className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Executive & Ownership Command</span>
                    <span className="text-[10px] font-mono uppercase bg-indigo-500/10 text-indigo-400 px-1.5 py-0.2 rounded">
                      Full Enterprise
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Multi-business consolidation, net worth tracking, cap table equity, financials & RBAC.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800/80">
              {executiveProfiles.concat(financeProfiles).map((user) => {
                const isCurrent = currentUser.id === user.id;
                return (
                  <button
                    key={user.id}
                    onClick={() => handleSelectRole(user.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-colors ${
                      isCurrent
                        ? 'bg-indigo-500/20 border-indigo-500 text-white'
                        : 'bg-slate-900 border-slate-800 hover:bg-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-7 h-7 rounded-full object-cover shrink-0 border border-indigo-400/50"
                      />
                      <div className="truncate">
                        <div className="text-xs font-bold truncate">{user.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{user.title}</div>
                      </div>
                    </div>
                    {isCurrent ? (
                      <Check className="w-4 h-4 text-indigo-400 shrink-0 ml-2" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

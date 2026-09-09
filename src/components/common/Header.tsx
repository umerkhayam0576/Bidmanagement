import React, { useState } from 'react';
import {
  Building2,
  ChevronDown,
  Sparkles,
  Bell,
  Plus,
  Layers,
  Briefcase,
  UserCheck,
  Check,
  Globe2,
  DollarSign,
  UserPlus,
  ShieldCheck
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import { RegisterEmployeeModal } from './RegisterEmployeeModal';

export const Header: React.FC<{
  onOpenQuickAdd: () => void;
}> = ({ onOpenQuickAdd }) => {
  const {
    businesses,
    activeBusinessId,
    activeBusiness,
    switchBusiness,
    currentUser,
    userProfiles,
    switchUser,
    isEmployee,
    notifications,
    markNotificationRead,
    formatCurrency,
    setIsAiAdvisorOpen,
    setActiveTab
  } = useBusiness();

  const [bizDropdownOpen, setBizDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [registerEmpModalOpen, setRegisterEmpModalOpen] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read);

  const executiveProfiles = userProfiles.filter((u) => u.globalRole !== 'EMPLOYEE');
  const employeeProfiles = userProfiles.filter((u) => u.globalRole === 'EMPLOYEE');

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 text-white flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30 shadow-sm">
      {/* Brand & Multi-business Switcher */}
      <div className="flex items-center gap-4 lg:gap-6">
        <div
          onClick={() => setActiveTab('overview')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-slate-950 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            R
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-lg text-white font-mono">REFAY</span>
              <span
                className={`text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded ${
                  isEmployee
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-emerald-500/20 text-emerald-400'
                }`}
              >
                {isEmployee ? 'EMPLOYEE PORTAL' : 'ENTERPRISE'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              {isEmployee ? 'Employee Self-Service Workspace' : 'Manage Everything You Own'}
            </p>
          </div>
        </div>

        <div className="h-6 w-px bg-slate-800 hidden md:block" />

        {/* Business Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setBizDropdownOpen(!bizDropdownOpen)}
            className="flex items-center gap-2.5 bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700/80 text-sm font-medium transition-colors"
          >
            {activeBusinessId === 'CONSOLIDATED' ? (
              <>
                <div className="w-5 h-5 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-slate-200">Consolidated Portfolio</div>
                  <div className="text-[10px] text-slate-400">All 3 Holdings</div>
                </div>
              </>
            ) : (
              <>
                <img
                  src={activeBusiness?.logo}
                  alt={activeBusiness?.name}
                  className="w-5 h-5 rounded object-cover"
                />
                <div className="text-left max-w-[140px] sm:max-w-[200px] truncate">
                  <div className="text-xs font-semibold text-slate-200 truncate flex items-center gap-1.5">
                    {activeBusiness?.name}
                    {isEmployee && (
                      <span className="text-[9px] px-1 py-0.2 bg-emerald-500/20 text-emerald-300 rounded">
                        Employer
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                    <span>{activeBusiness?.industry}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-mono">{activeBusiness?.currency}</span>
                  </div>
                </div>
              </>
            )}
            <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
          </button>

          {bizDropdownOpen && (
            <div className="absolute left-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 py-2 overflow-hidden animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                {isEmployee ? 'Assigned Operating Company' : 'Switch Business Entity'}
              </div>

              {/* Consolidated Mode (only for executive/owner) */}
              {!isEmployee ? (
                <button
                  onClick={() => {
                    switchBusiness('CONSOLIDATED');
                    setBizDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-800 transition-colors ${
                    activeBusinessId === 'CONSOLIDATED' ? 'bg-slate-800/60' : ''
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200">Consolidated Holdings</div>
                      <div className="text-[10px] text-slate-400">All businesses & personal assets</div>
                    </div>
                  </div>
                  {activeBusinessId === 'CONSOLIDATED' && (
                    <Check className="w-4 h-4 text-emerald-400" />
                  )}
                </button>
              ) : (
                <div className="px-3 py-2 text-[11px] text-slate-400 bg-slate-850 mx-2 rounded-lg border border-slate-800">
                  <span className="text-emerald-400 font-medium block">Employee Workspace</span>
                  Your account is assigned to {activeBusiness?.name}. Switch to an executive profile to view consolidated holdings.
                </div>
              )}

              <div className="my-1.5 border-t border-slate-800" />

              {/* Businesses list */}
              {businesses.map((biz) => {
                const isActive = activeBusinessId === biz.id;
                return (
                  <button
                    key={biz.id}
                    onClick={() => {
                      switchBusiness(biz.id);
                      setBizDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-800 transition-colors ${
                      isActive ? 'bg-slate-800/60' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={biz.logo}
                        alt={biz.name}
                        className="w-7 h-7 rounded-lg object-cover"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-200 truncate max-w-[170px]">
                          {biz.name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {biz.industry} • {biz.jurisdiction}
                        </div>
                      </div>
                    </div>
                    {isActive && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Action Button */}
        <button
          onClick={onOpenQuickAdd}
          className="hidden sm:flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-emerald-400" />
          <span>{isEmployee ? 'Quick Action' : 'Quick Record'}</span>
        </button>

        {/* AI Advisor / HR Helpdesk Button */}
        <button
          onClick={() => setIsAiAdvisorOpen(true)}
          className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all shadow-sm group"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-12 transition-transform" />
          <span className="hidden md:inline">
            {isEmployee ? 'HR & Staff Advisor' : 'AI Executive Advisor'}
          </span>
          <span className="md:hidden">Advisor</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadNotifs.length}
              </span>
            )}
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 py-2 animate-in fade-in zoom-in-95">
              <div className="px-4 py-2 flex items-center justify-between border-b border-slate-800">
                <div className="font-semibold text-xs text-slate-200">Alerts & Operational Notices</div>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
                  {unreadNotifs.length} unread
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500">No active notices</div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationRead(notif.id);
                        if (notif.targetTab) {
                          setActiveTab(notif.targetTab as any);
                          setNotifDropdownOpen(false);
                        }
                      }}
                      className={`p-3 text-left hover:bg-slate-800/60 cursor-pointer transition-colors ${
                        !notif.read ? 'bg-slate-800/20' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={`text-xs font-bold ${
                            notif.type === 'ALERT'
                              ? 'text-rose-400'
                              : notif.type === 'WARNING'
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {notif.title}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {notif.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 line-clamp-2">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Persona Switcher */}
        <div className="relative">
          <button
            id="user-persona-btn"
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2 bg-slate-800/60 hover:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-700/60 transition-colors"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className={`w-6 h-6 rounded-full object-cover border ${
                isEmployee ? 'border-emerald-400' : 'border-indigo-400'
              }`}
            />
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-slate-200 leading-tight">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-emerald-400 leading-tight">
                {currentUser.title}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {userDropdownOpen && (
            <div
              id="user-persona-dropdown"
              className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 py-2 animate-in fade-in zoom-in-95 max-h-[85vh] overflow-y-auto"
            >
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Switch Role / View As
              </div>

              {/* Section 1: Executive & Leadership */}
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mt-1">
                <ShieldCheck className="w-3 h-3 text-indigo-400" />
                Leadership & Ownership
              </div>
              {executiveProfiles.map((user) => {
                const isSelected = user.id === currentUser.id;
                return (
                  <button
                    key={user.id}
                    onClick={() => {
                      switchUser(user.id);
                      setUserDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-800 transition-colors ${
                      isSelected ? 'bg-slate-800/60' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-xs font-semibold text-slate-200">{user.name}</div>
                        <div className="text-[10px] text-slate-400">{user.title}</div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>
                );
              })}

              <div className="my-2 border-t border-slate-800" />

              {/* Section 2: Employees & Staff */}
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-3 h-3 text-emerald-400" />
                Employees & Staff ({employeeProfiles.length})
              </div>
              {employeeProfiles.length === 0 ? (
                <div className="px-3 py-2 text-xs text-slate-400 italic">No employees registered yet</div>
              ) : (
                employeeProfiles.map((user) => {
                  const isSelected = user.id === currentUser.id;
                  return (
                    <button
                      key={user.id}
                      onClick={() => {
                        switchUser(user.id);
                        setUserDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-800 transition-colors ${
                        isSelected ? 'bg-slate-800/60' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <div>
                          <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                            {user.name}
                            <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/10 text-emerald-400">
                              Employee
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400">{user.title}</div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                    </button>
                  );
                })
              )}

              <div className="my-2 border-t border-slate-800" />

              {/* Button to register as employee */}
              <button
                id="header-register-employee-btn"
                onClick={() => {
                  setUserDropdownOpen(false);
                  setRegisterEmpModalOpen(true);
                }}
                className="w-full px-3 py-2 text-left text-xs font-semibold text-emerald-400 hover:bg-slate-800 flex items-center gap-2 transition-colors"
              >
                <UserPlus className="w-4 h-4 text-emerald-400" />
                <span>+ Register New Employee</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Register Employee Modal */}
      <RegisterEmployeeModal
        isOpen={registerEmpModalOpen}
        onClose={() => setRegisterEmpModalOpen(false)}
      />
    </header>
  );
};

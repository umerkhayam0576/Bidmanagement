import React, { useState } from 'react';
import {
  Users2,
  CalendarClock,
  UserCheck,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  UserPlus,
  Building,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  FileText,
  Search,
  Check,
  Sparkles
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import { RegisterEmployeeModal } from '../common/RegisterEmployeeModal';

export const HrPortalDashboard: React.FC = () => {
  const {
    currentUser,
    activeBusiness,
    filteredEmployees,
    filteredPayrollRuns,
    filteredLeaveRequests,
    approveLeaveRequest,
    rejectLeaveRequest,
    attendanceRecords,
    formatCurrency,
    setActiveTab
  } = useBusiness();

  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculations
  const totalEmployees = filteredEmployees.length;
  const pendingLeaves = filteredLeaveRequests.filter((r) => r.status === 'PENDING');
  const totalMonthlyPayroll = filteredEmployees.reduce((sum, e) => sum + (e.salary / 12), 0);

  // Department counts
  const depts = Array.from(new Set(filteredEmployees.map((e) => e.department || 'GENERAL')));

  // Filtered employees for directory view
  const displayEmployees = filteredEmployees.filter((emp) => {
    const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || emp.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDeptFilter === 'ALL' || emp.department === selectedDeptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top HR Notice Header */}
      <div className="bg-gradient-to-r from-purple-950/50 via-slate-900 to-indigo-950/40 border border-purple-500/30 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono uppercase bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
                HR & PEOPLE PORTAL
              </span>
              <span className="text-sm font-bold text-white">{activeBusiness?.name || 'Company HQ'}</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Workforce administration, attendance rosters, leave approvals, and payroll management.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <button
            id="hr-onboard-btn"
            onClick={() => setRegisterModalOpen(true)}
            className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs px-3.5 py-2 rounded-xl shadow-md shadow-purple-500/20 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Onboard Employee</span>
          </button>
        </div>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Headcount</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Users2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-white font-mono">{totalEmployees}</div>
            <div className="text-[11px] text-purple-400 flex items-center gap-1 mt-0.5">
              <span>Across {depts.length} operating departments</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Leave Requests</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-white font-mono">{pendingLeaves.length}</div>
            <div className="text-[11px] text-amber-400 flex items-center gap-1 mt-0.5">
              <span>Action required from HR</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Monthly Payroll</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-white font-mono">
              {formatCurrency(totalMonthlyPayroll)}
            </div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
              <span>Next run scheduled at month-end</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Shift Attendance</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <CalendarClock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-white font-mono">
              {attendanceRecords.length}
            </div>
            <div className="text-[11px] text-indigo-400 flex items-center gap-1 mt-0.5">
              <span>Logged punch-in cycles</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Pending Leave Requests & Workforce Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Leave Approvals Queue & Quick Attendance */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Leave Requests Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Pending Employee Leave Approvals</span>
              </h2>
              <span className="text-xs font-mono bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded">
                {pendingLeaves.length} pending
              </span>
            </div>

            {pendingLeaves.length === 0 ? (
              <div className="p-8 text-center bg-slate-850 rounded-xl border border-slate-800/60 text-slate-400 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                No pending leave requests. All employee time-off requests are up to date.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingLeaves.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-xl bg-slate-850 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{req.employeeName}</span>
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300">
                          {req.type} LEAVE
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                        <span>{req.startDate} to {req.endDate}</span>
                        <span>•</span>
                        <span className="italic">"{req.reason}"</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      <button
                        onClick={() => rejectLeaveRequest(req.id)}
                        className="flex items-center gap-1 bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 border border-slate-700 hover:border-rose-500/40 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                      <button
                        onClick={() => approveLeaveRequest(req.id)}
                        className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Live Staff Roster */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Users2 className="w-4 h-4 text-purple-400" />
                  <span>Staff Directory & Roles</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Manage employee records and organizational placement.</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search staff..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 w-40"
                  />
                </div>
              </div>
            </div>

            {/* Department Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <button
                onClick={() => setSelectedDeptFilter('ALL')}
                className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  selectedDeptFilter === 'ALL'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                All Departments
              </button>
              {depts.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDeptFilter(d)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                    selectedDeptFilter === d
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {displayEmployees.slice(0, 8).map((emp) => (
                <div
                  key={emp.id}
                  className="p-3 rounded-xl bg-slate-850 border border-slate-800/80 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">
                      {emp.firstName} {emp.lastName}
                    </div>
                    <div className="text-[11px] text-purple-300 truncate">{emp.role}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {emp.department} • {emp.email}
                    </div>
                  </div>
                  <span
                    className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded shrink-0 ${
                      emp.status === 'ACTIVE'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {emp.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Quick HR Shortcuts & Payroll Overview */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>HR Operations Shortcuts</span>
            </h3>

            <div className="space-y-2">
              <button
                onClick={() => setRegisterModalOpen(true)}
                className="w-full py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center justify-between transition-colors shadow-md shadow-purple-600/20"
              >
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  <span>Onboard New Employee</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('attendance')}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold flex items-center justify-between border border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <CalendarClock className="w-4 h-4 text-indigo-400" />
                  <span>Review Daily Attendance & Shifts</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('hr-payroll')}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold flex items-center justify-between border border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>Execute Monthly Payroll</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('documents')}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold flex items-center justify-between border border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>Company Policies & Contracts</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Department Headcount Breakdown */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-slate-400" />
              <span>Department Distribution</span>
            </h3>

            <div className="space-y-2">
              {depts.map((dept) => {
                const count = filteredEmployees.filter((e) => e.department === dept).length;
                const percentage = totalEmployees > 0 ? Math.round((count / totalEmployees) * 100) : 0;
                return (
                  <div key={dept} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-semibold">{dept}</span>
                      <span className="text-slate-400 font-mono">
                        {count} staff ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Registering Employee */}
      <RegisterEmployeeModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
      />
    </div>
  );
};

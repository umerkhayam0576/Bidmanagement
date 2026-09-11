import React, { useState, useEffect, useMemo } from 'react';
import {
  CalendarClock,
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Plus,
  Play,
  Square,
  User,
  Check,
  X,
  Briefcase,
  Coffee,
  Building,
  Home,
  Navigation,
  FileText,
  Palmtree,
  Stethoscope,
  HeartHandshake
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import { AttendanceRecord, LeaveRequest } from '../../types';

export const AttendanceModule: React.FC = () => {
  const {
    attendanceRecords,
    isClockedIn,
    clockInTime,
    clockIn,
    clockOut,
    filteredLeaveRequests,
    submitLeaveRequest,
    currentUser,
    currentEmployee,
    filteredEmployees,
    activeBusiness
  } = useBusiness();

  // Active view tab: Attendance vs Leaves
  const [activeTab, setActiveTab] = useState<'attendance' | 'leaves'>('attendance');

  // Live timer for current clock-in session
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [selectedLocation, setSelectedLocation] = useState<'ON_SITE' | 'OFFICE' | 'REMOTE' | 'FIELD'>('OFFICE');

  // Leave request modal state
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveType, setLeaveType] = useState<'VACATION' | 'SICK' | 'PERSONAL'>('VACATION');
  const [leaveStartDate, setLeaveStartDate] = useState('');
  const [leaveEndDate, setLeaveEndDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('');

  // Clock live update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      if (isClockedIn && clockInTime) {
        const [hours, minutes] = clockInTime.split(':').map(Number);
        const clockInDate = new Date();
        clockInDate.setHours(hours, minutes, 0, 0);
        const diff = Math.floor((Date.now() - clockInDate.getTime()) / 1000);
        setElapsedSeconds(diff > 0 ? diff : 0);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isClockedIn, clockInTime]);

  const formatElapsed = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Leave balances (calculated based on standard 21 days annual, 10 sick, 5 personal)
  const leaveBalances = useMemo(() => {
    const employeeLeaves = filteredLeaveRequests.filter(
      (l) => l.employeeName === currentUser.name || l.employeeId === (currentEmployee?.id || 'emp-1')
    );

    const usedVacation = employeeLeaves
      .filter((l) => l.type === 'VACATION' && l.status === 'APPROVED')
      .reduce((acc, l) => acc + l.days, 0);
    const usedSick = employeeLeaves
      .filter((l) => l.type === 'SICK' && l.status === 'APPROVED')
      .reduce((acc, l) => acc + l.days, 0);
    const usedPersonal = employeeLeaves
      .filter((l) => l.type === 'PERSONAL' && l.status === 'APPROVED')
      .reduce((acc, l) => acc + l.days, 0);

    return {
      annualTotal: 21,
      annualRemaining: Math.max(0, 21 - usedVacation - 5), // 5 baseline mock booked
      sickTotal: 10,
      sickRemaining: Math.max(0, 10 - usedSick - 2),
      personalTotal: 5,
      personalRemaining: Math.max(0, 5 - usedPersonal - 1)
    };
  }, [filteredLeaveRequests, currentUser, currentEmployee]);

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveStartDate || !leaveEndDate) return;

    const start = new Date(leaveStartDate);
    const end = new Date(leaveEndDate);
    const timeDiff = end.getTime() - start.getTime();
    const days = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1);

    submitLeaveRequest({
      businessId: activeBusiness?.id || 'b1',
      employeeId: currentEmployee?.id || 'emp-1',
      employeeName: currentUser.name,
      type: leaveType,
      startDate: leaveStartDate,
      endDate: leaveEndDate,
      days
    });

    setIsLeaveModalOpen(false);
    setLeaveReason('');
    setLeaveStartDate('');
    setLeaveEndDate('');
  };

  return (
    <div id="attendance-module" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2.5">
            <CalendarClock className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Attendance & Leave Management
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Work shift punch-clock, site logging, timesheet history, and PTO/leave requests
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl text-xs font-semibold">
            <button
              id="tab-btn-attendance"
              onClick={() => setActiveTab('attendance')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === 'attendance'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-sm font-bold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Shift Attendance</span>
            </button>
            <button
              id="tab-btn-leaves"
              onClick={() => setActiveTab('leaves')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === 'leaves'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-sm font-bold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              <Palmtree className="w-3.5 h-3.5" />
              <span>Leaves & Time Off</span>
            </button>
          </div>

          {activeTab === 'leaves' && (
            <button
              id="request-leave-btn"
              onClick={() => setIsLeaveModalOpen(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Request Leave</span>
            </button>
          )}
        </div>
      </div>

      {/* ATTENDANCE TAB */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          {/* Hero Punch Card Widget */}
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-neutral-900 text-white rounded-2xl p-6 shadow-md border border-indigo-800/40 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                      isClockedIn ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${isClockedIn ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-500'}`}
                    />
                    {isClockedIn ? 'Shift Active (Clocked In)' : 'Off-Duty (Clocked Out)'}
                  </span>
                  <span className="text-xs text-indigo-300 font-mono">
                    {currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <div className="text-4xl sm:text-5xl font-extrabold tracking-tight font-mono text-white mt-1">
                  {currentTime.toLocaleTimeString()}
                </div>

                <p className="text-xs text-indigo-200/80">
                  {isClockedIn
                    ? `Clocked in at ${clockInTime} • Elapsed shift duration: ${formatElapsed(elapsedSeconds)}`
                    : 'Punch in to record your daily site presence and billable project hours.'}
                </p>
              </div>

              {/* Punch In / Out Action Panel */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white/5 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
                {!isClockedIn && (
                  <div className="flex flex-col">
                    <label className="text-[11px] uppercase tracking-wider text-indigo-200 font-semibold mb-1">
                      Check-in Location
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { id: 'OFFICE', label: 'Office', icon: Building },
                        { id: 'ON_SITE', label: 'Job Site', icon: HardHatIcon },
                        { id: 'REMOTE', label: 'Remote', icon: Home },
                        { id: 'FIELD', label: 'Client / Field', icon: Navigation }
                      ].map((loc) => {
                        const Icon = loc.icon;
                        return (
                          <button
                            key={loc.id}
                            type="button"
                            onClick={() => setSelectedLocation(loc.id as any)}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors ${
                              selectedLocation === loc.id
                                ? 'bg-indigo-600 text-white font-semibold'
                                : 'bg-white/5 text-neutral-300 hover:bg-white/10'
                            }`}
                          >
                            <Icon className="w-3 h-3" />
                            <span>{loc.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex items-center self-center sm:self-end">
                  {!isClockedIn ? (
                    <button
                      id="clock-in-btn"
                      onClick={() => clockIn(selectedLocation)}
                      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-emerald-600/30"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Clock In Now</span>
                    </button>
                  ) : (
                    <button
                      id="clock-out-btn"
                      onClick={() => clockOut()}
                      className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-rose-600/30"
                    >
                      <Square className="w-4 h-4 fill-white" />
                      <span>Clock Out</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
                Logged Records
              </span>
              <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-2 block">
                {attendanceRecords.length} shifts
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 block">Recent timecards</span>
            </div>

            <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
                On-Time Punctuality
              </span>
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2 block">
                98.2%
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 block">Current monthly cycle</span>
            </div>

            <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
                Average Daily Shift
              </span>
              <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-2 block">
                8.4 hrs
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 block">Includes approved site OT</span>
            </div>

            <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
                Current Location
              </span>
              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-2 block">
                {isClockedIn ? (selectedLocation || 'OFFICE').replace('_', ' ') : 'Off Clock'}
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 block">
                {currentUser.name}
              </span>
            </div>
          </div>

          {/* Attendance History Table */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <h3 className="font-bold text-neutral-900 dark:text-neutral-100 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                Recent Shift Timesheet History
              </h3>
              <span className="text-xs text-neutral-500">Auto-calculated breaks and hours</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-4">Location Mode</th>
                    <th className="py-3 px-4">Clock In</th>
                    <th className="py-3 px-4">Clock Out</th>
                    <th className="py-3 px-4 text-right">Total Hours</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {attendanceRecords.map((rec) => {
                    const emp = filteredEmployees.find((e) => e.id === rec.employeeId);
                    const empDisplayName =
                      rec.employeeName || (emp ? `${emp.firstName} ${emp.lastName}` : currentUser.name);
                    const locMode = rec.mode || rec.locationMode || 'OFFICE';
                    const recStatus = rec.status || 'PRESENT';

                    return (
                      <tr key={rec.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                          {rec.date}
                        </td>
                        <td className="py-3.5 px-4 text-neutral-900 dark:text-neutral-100 font-medium">
                          {empDisplayName}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 text-xs bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-neutral-600 dark:text-neutral-300">
                            <MapPin className="w-3 h-3 text-indigo-500" />
                            {locMode.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-xs text-neutral-600 dark:text-neutral-400">
                          {rec.clockIn}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-xs text-neutral-600 dark:text-neutral-400">
                          {rec.clockOut || (
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold animate-pulse">
                              Active...
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-neutral-900 dark:text-neutral-100">
                          {rec.totalHours ? `${rec.totalHours.toFixed(1)} hrs` : 'In progress'}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                              recStatus === 'ON_TIME' || recStatus === 'PRESENT'
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                                : recStatus === 'OVERTIME'
                                ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400'
                                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'
                            }`}
                          >
                            {recStatus.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* LEAVES TAB */}
      {activeTab === 'leaves' && (
        <div className="space-y-6">
          {/* Leave Entitlement Balances */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/30 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-900/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                  Annual Paid Vacation
                </span>
                <Palmtree className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="flex items-baseline gap-1 mt-3">
                <span className="text-3xl font-extrabold text-indigo-900 dark:text-indigo-100">
                  {leaveBalances.annualRemaining}
                </span>
                <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  / {leaveBalances.annualTotal} days remaining
                </span>
              </div>
              <div className="w-full bg-indigo-200 dark:bg-indigo-900/60 rounded-full h-1.5 mt-3">
                <div
                  className="bg-indigo-600 h-1.5 rounded-full"
                  style={{ width: `${(leaveBalances.annualRemaining / leaveBalances.annualTotal) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                  Medical / Sick Leave
                </span>
                <Stethoscope className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex items-baseline gap-1 mt-3">
                <span className="text-3xl font-extrabold text-emerald-900 dark:text-emerald-100">
                  {leaveBalances.sickRemaining}
                </span>
                <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  / {leaveBalances.sickTotal} days remaining
                </span>
              </div>
              <div className="w-full bg-emerald-200 dark:bg-emerald-900/60 rounded-full h-1.5 mt-3">
                <div
                  className="bg-emerald-600 h-1.5 rounded-full"
                  style={{ width: `${(leaveBalances.sickRemaining / leaveBalances.sickTotal) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/30 p-5 rounded-2xl border border-purple-100 dark:border-purple-900/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                  Personal & Emergency
                </span>
                <HeartHandshake className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex items-baseline gap-1 mt-3">
                <span className="text-3xl font-extrabold text-purple-900 dark:text-purple-100">
                  {leaveBalances.personalRemaining}
                </span>
                <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  / {leaveBalances.personalTotal} days remaining
                </span>
              </div>
              <div className="w-full bg-purple-200 dark:bg-purple-900/60 rounded-full h-1.5 mt-3">
                <div
                  className="bg-purple-600 h-1.5 rounded-full"
                  style={{ width: `${(leaveBalances.personalRemaining / leaveBalances.personalTotal) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Leave Applications History */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <h3 className="font-bold text-neutral-900 dark:text-neutral-100 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                Submitted Leave Requests & Approvals
              </h3>
              <span className="text-xs text-neutral-500">Official HR register</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Start Date</th>
                    <th className="py-3 px-4">End Date</th>
                    <th className="py-3 px-4 text-center">Duration</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {filteredLeaveRequests.map((leave) => (
                    <tr key={leave.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-neutral-900 dark:text-neutral-100">
                        {leave.employeeName}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-xs bg-neutral-100 dark:bg-neutral-800 px-2.5 py-0.5 rounded font-medium text-neutral-700 dark:text-neutral-300">
                          {leave.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-neutral-600 dark:text-neutral-400">
                        {leave.startDate}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-neutral-600 dark:text-neutral-400">
                        {leave.endDate}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-neutral-900 dark:text-neutral-100">
                        {leave.days} {leave.days === 1 ? 'day' : 'days'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                            leave.status === 'APPROVED'
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                              : leave.status === 'PENDING'
                              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'
                              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400'
                          }`}
                        >
                          {leave.status}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {filteredLeaveRequests.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-neutral-400 text-sm">
                        No leave requests logged yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Leave Application Modal */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-md w-full border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden">
            <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                Submit Time-Off Request
              </h3>
              <button
                onClick={() => setIsLeaveModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLeaveSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Leave Type
                </label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="VACATION">Vacation / Paid Annual Leave</option>
                  <option value="SICK">Medical / Sick Leave</option>
                  <option value="PERSONAL">Personal / Urgent Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={leaveStartDate}
                    onChange={(e) => setLeaveStartDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={leaveEndDate}
                    onChange={(e) => setLeaveEndDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Reason / Notes for Supervisor
                </label>
                <textarea
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  rows={3}
                  placeholder="Provide brief context or coverage plan..."
                  className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Icon for hard hat
const HardHatIcon = ({ className }: { className?: string }) => (
  <Briefcase className={className} />
);

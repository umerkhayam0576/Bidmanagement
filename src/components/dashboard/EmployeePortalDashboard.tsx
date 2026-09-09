import React, { useState, useMemo } from 'react';
import {
  UserCheck,
  Calendar,
  Clock,
  CheckCircle2,
  DollarSign,
  Briefcase,
  Building,
  Plus,
  Send,
  CreditCard,
  FileText,
  AlertCircle,
  FolderKanban,
  Receipt,
  Users,
  Eye,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import { Task, LeaveRequest, ExpenseCategory, Department } from '../../types';

export const EmployeePortalDashboard: React.FC = () => {
  const {
    currentUser,
    currentEmployee,
    employees,
    activeBusiness,
    filteredProjects,
    filteredTasks,
    addTask,
    updateTaskStatus,
    filteredLeaveRequests,
    submitLeaveRequest,
    filteredExpenses,
    addExpense,
    payrollRuns,
    formatCurrency,
    userProfiles,
    switchUser
  } = useBusiness();

  // Active section tab within employee portal
  const [activePortalTab, setActivePortalTab] = useState<'tasks' | 'leave' | 'payroll' | 'expenses' | 'team'>('tasks');

  // Modals / forms state
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState<any | null>(null);

  // Leave form state
  const [leaveType, setLeaveType] = useState<'VACATION' | 'SICK' | 'PERSONAL'>('VACATION');
  const [leaveStart, setLeaveStart] = useState('');
  const [leaveEnd, setLeaveEnd] = useState('');
  const [leaveDays, setLeaveDays] = useState(1);
  const [leaveSuccessMsg, setLeaveSuccessMsg] = useState('');

  // Expense form state
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory>('SOFTWARE');
  const [expenseVendor, setExpenseVendor] = useState('');
  const [expenseSuccessMsg, setExpenseSuccessMsg] = useState('');

  // Task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('MEDIUM');
  const [taskProjectId, setTaskProjectId] = useState(filteredProjects[0]?.id || '');
  const [taskDueDate, setTaskDueDate] = useState('');

  // Fallback employee data if none matches directly
  const empData = useMemo(() => {
    if (currentEmployee) return currentEmployee;
    return {
      id: currentUser.employeeId || 'emp_current',
      businessId: currentUser.businessId || activeBusiness?.id || 'biz_apex',
      firstName: currentUser.name.split(' ')[0] || 'Employee',
      lastName: currentUser.name.split(' ').slice(1).join(' ') || 'Staff',
      email: currentUser.email,
      role: currentUser.title,
      department: (currentUser.department as Department) || 'ENGINEERING',
      salary: 125000,
      payFrequency: 'MONTHLY' as const,
      hireDate: '2023-04-15',
      status: 'ACTIVE' as const,
      bankAccount: 'US-CHASE-847291'
    };
  }, [currentEmployee, currentUser, activeBusiness]);

  // Tasks assigned to this employee
  const myTasks = useMemo(() => {
    const fullName = `${empData.firstName} ${empData.lastName}`.toLowerCase();
    const firstName = empData.firstName.toLowerCase();
    const userRole = empData.role.toLowerCase();

    return filteredTasks.filter((t) => {
      const a = (t.assignee || '').toLowerCase();
      return (
        a.includes(fullName) ||
        a.includes(firstName) ||
        a.includes(userRole) ||
        a === currentUser.name.toLowerCase()
      );
    });
  }, [filteredTasks, empData, currentUser]);

  // Display all company tasks if none specifically match name
  const displayedTasks = myTasks.length > 0 ? myTasks : filteredTasks;

  // Leave requests for this employee
  const myLeaveRequests = useMemo(() => {
    const fullName = `${empData.firstName} ${empData.lastName}`.toLowerCase();
    return filteredLeaveRequests.filter(
      (lr) =>
        lr.employeeId === empData.id ||
        lr.employeeName.toLowerCase().includes(fullName) ||
        lr.employeeName.toLowerCase().includes(empData.firstName.toLowerCase())
    );
  }, [filteredLeaveRequests, empData]);

  // Expenses claimed by this employee
  const myExpenses = useMemo(() => {
    const userFirstName = empData.firstName.toLowerCase();
    return filteredExpenses.filter((exp) => {
      const desc = (exp.description || '').toLowerCase();
      const vendor = (exp.vendor || '').toLowerCase();
      return desc.includes(userFirstName) || vendor.includes(userFirstName);
    });
  }, [filteredExpenses, empData]);

  // Calculate monthly pay breakdown
  const annualSalary = empData.salary;
  const monthlyGross = Math.round(annualSalary / 12);
  const taxWithholding = Math.round(monthlyGross * 0.22);
  const benefitsDeduction = Math.round(monthlyGross * 0.05);
  const monthlyNet = monthlyGross - taxWithholding - benefitsDeduction;

  // Calculate leave balance
  const usedLeaveDays = myLeaveRequests
    .filter((r) => r.status === 'APPROVED')
    .reduce((sum, r) => sum + r.days, 0);
  const totalAnnualAllowance = 25;
  const remainingLeaveDays = Math.max(0, totalAnnualAllowance - usedLeaveDays);

  // Executive user to switch back to if desired
  const executiveProfile = userProfiles.find(
    (u) => u.globalRole === 'SUPER_OWNER' || u.globalRole === 'EXECUTIVE'
  );

  // Handlers
  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveStart || !leaveEnd) return;

    submitLeaveRequest({
      businessId: empData.businessId,
      employeeId: empData.id,
      employeeName: `${empData.firstName} ${empData.lastName}`.trim(),
      type: leaveType,
      startDate: leaveStart,
      endDate: leaveEnd,
      days: Number(leaveDays) || 1
    });

    setLeaveSuccessMsg('Leave request submitted to HR for approval.');
    setTimeout(() => {
      setLeaveSuccessMsg('');
      setIsLeaveModalOpen(false);
      setLeaveStart('');
      setLeaveEnd('');
    }, 1500);
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseTitle || !expenseAmount) return;

    addExpense({
      businessId: empData.businessId,
      category: expenseCategory,
      amount: Number(expenseAmount) || 50,
      date: new Date().toISOString().split('T')[0],
      description: `${expenseTitle} [Submitted by ${empData.firstName} ${empData.lastName}]`,
      vendor: expenseVendor || 'Direct Reimbursement',
      status: 'PENDING'
    });

    setExpenseSuccessMsg('Expense reimbursement claim filed successfully.');
    setTimeout(() => {
      setExpenseSuccessMsg('');
      setIsExpenseModalOpen(false);
      setExpenseTitle('');
      setExpenseAmount('');
      setExpenseVendor('');
    }, 1500);
  };

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return;

    addTask({
      businessId: empData.businessId,
      projectId: taskProjectId || filteredProjects[0]?.id || 'prj_1',
      title: taskTitle.trim(),
      description: taskDesc.trim(),
      assignee: `${empData.firstName} ${empData.lastName}`,
      dueDate: taskDueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      priority: taskPriority,
      status: 'TODO'
    });

    setIsTaskModalOpen(false);
    setTaskTitle('');
    setTaskDesc('');
  };

  return (
    <div id="employee-portal-dashboard" className="space-y-6 pb-12">
      {/* Top Banner: Employee Identity & Workspace Status */}
      <div
        id="employee-hero-card"
        className="relative overflow-hidden bg-card border border-border rounded-2xl p-6 shadow-xs"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/30 border-2 border-background shadow-xs"
              />
              <span className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 text-white rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  {currentUser.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  Employee Portal Mode
                </span>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-muted text-muted-foreground border border-border">
                  ID: {empData.id.toUpperCase()}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="font-medium text-foreground flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-primary" />
                  {currentUser.title}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-muted-foreground" />
                  {activeBusiness?.name || 'Assigned Business Unit'}
                </span>
                <span>•</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary uppercase">
                  {empData.department}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-2 lg:pt-0">
            <button
              id="emp-quick-leave-btn"
              onClick={() => setIsLeaveModalOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4" />
              Request Leave / PTO
            </button>

            <button
              id="emp-quick-expense-btn"
              onClick={() => setIsExpenseModalOpen(true)}
              className="px-3.5 py-2 text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Receipt className="w-4 h-4" />
              Claim Expense
            </button>

            {executiveProfile && (
              <button
                id="emp-switch-executive-btn"
                onClick={() => switchUser(executiveProfile.id)}
                title="Switch back to executive/founder ownership view"
                className="px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl border border-border transition-colors flex items-center gap-1"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                Switch to Executive View
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4 Core Employee Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Monthly Compensation */}
        <div
          id="emp-stat-compensation"
          className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Monthly Take-Home</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {formatCurrency(monthlyNet)}
            </div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span>Gross: {formatCurrency(monthlyGross)}/mo</span>
              <span>•</span>
              <span className="text-emerald-600 font-medium">Direct Deposit</span>
            </div>
          </div>
          <div className="text-[11px] text-muted-foreground pt-1 border-t border-border flex items-center justify-between">
            <span>Bank: {empData.bankAccount.replace(/(.+)(.{4})$/, '****$2')}</span>
            <span className="text-primary font-medium">Next: End of Month</span>
          </div>
        </div>

        {/* Metric 2: PTO & Leave Balance */}
        <div
          id="emp-stat-leave"
          className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Leave Balance</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {remainingLeaveDays} <span className="text-sm font-normal text-muted-foreground">/ 25 Days</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span>Used: {usedLeaveDays} days</span>
              <span>•</span>
              <span className="text-blue-600 font-medium">5 Sick days reserved</span>
            </div>
          </div>
          <div className="text-[11px] text-muted-foreground pt-1 border-t border-border flex items-center justify-between">
            <span>Pending Approvals:</span>
            <span className="font-semibold text-foreground">
              {myLeaveRequests.filter((r) => r.status === 'PENDING').length}
            </span>
          </div>
        </div>

        {/* Metric 3: Assigned Tasks */}
        <div
          id="emp-stat-tasks"
          className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">My Active Tasks</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {displayedTasks.filter((t) => t.status !== 'DONE').length}
            </div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span>{displayedTasks.filter((t) => t.status === 'IN_PROGRESS').length} in progress</span>
              <span>•</span>
              <span className="text-amber-600 font-medium">
                {displayedTasks.filter((t) => t.priority === 'HIGH' || t.priority === 'CRITICAL').length} urgent
              </span>
            </div>
          </div>
          <div className="text-[11px] text-muted-foreground pt-1 border-t border-border flex items-center justify-between">
            <span>Completed this cycle:</span>
            <span className="font-semibold text-emerald-600">
              {displayedTasks.filter((t) => t.status === 'DONE').length}
            </span>
          </div>
        </div>

        {/* Metric 4: Assigned Projects */}
        <div
          id="emp-stat-projects"
          className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Workstream Projects</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {filteredProjects.length}
            </div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span>Active in {activeBusiness?.name || 'Company'}</span>
            </div>
          </div>
          <div className="text-[11px] text-muted-foreground pt-1 border-t border-border flex items-center justify-between">
            <span>Status:</span>
            <span className="font-semibold text-emerald-600">Good Standing</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs for Employee Workspace */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3">
        <button
          id="emp-tab-tasks-btn"
          onClick={() => setActivePortalTab('tasks')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
            activePortalTab === 'tasks'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          My Tasks & Assignments ({displayedTasks.length})
        </button>

        <button
          id="emp-tab-leave-btn"
          onClick={() => setActivePortalTab('leave')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
            activePortalTab === 'leave'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Leave & PTO Requests ({myLeaveRequests.length})
        </button>

        <button
          id="emp-tab-payroll-btn"
          onClick={() => setActivePortalTab('payroll')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
            activePortalTab === 'payroll'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Compensation & Payslips
        </button>

        <button
          id="emp-tab-expenses-btn"
          onClick={() => setActivePortalTab('expenses')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
            activePortalTab === 'expenses'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
          }`}
        >
          <Receipt className="w-4 h-4" />
          Expense Claims ({myExpenses.length})
        </button>

        <button
          id="emp-tab-team-btn"
          onClick={() => setActivePortalTab('team')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
            activePortalTab === 'team'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
          }`}
        >
          <Users className="w-4 h-4" />
          Team & Department ({employees.filter((e) => e.businessId === empData.businessId).length})
        </button>
      </div>

      {/* Tab 1: Tasks & Assignments */}
      {activePortalTab === 'tasks' && (
        <div id="emp-tasks-section" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-4 rounded-xl border border-border">
            <div>
              <h2 className="text-base font-semibold text-foreground">Task Assignments & Milestones</h2>
              <p className="text-xs text-muted-foreground">
                Update status directly as you progress through tasks.
              </p>
            </div>
            <button
              id="emp-add-task-btn"
              onClick={() => setIsTaskModalOpen(true)}
              className="px-3.5 py-1.5 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              Log / Assign Task
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedTasks.map((task) => (
              <div
                key={task.id}
                id={`emp-task-card-${task.id}`}
                className="bg-card border border-border rounded-xl p-4 shadow-xs flex flex-col justify-between space-y-3 hover:border-primary/40 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        task.priority === 'CRITICAL'
                          ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                          : task.priority === 'HIGH'
                          ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {task.priority} PRIORITY
                    </span>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Due {task.dueDate}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-foreground line-clamp-1">
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {task.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                  <div className="text-[11px] text-muted-foreground">
                    Assignee: <span className="text-foreground font-medium">{task.assignee}</span>
                  </div>

                  {/* Quick status updater */}
                  <select
                    id={`emp-task-status-select-${task.id}`}
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task.id, e.target.value as any)}
                    className={`text-xs px-2.5 py-1 rounded-md font-medium border focus:outline-hidden ${
                      task.status === 'DONE'
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                        : task.status === 'IN_PROGRESS'
                        ? 'bg-blue-500/10 text-blue-600 border-blue-500/30'
                        : 'bg-muted/80 text-foreground border-border'
                    }`}
                  >
                    <option value="TODO">To-Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Leave & PTO */}
      {activePortalTab === 'leave' && (
        <div id="emp-leave-section" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-4 rounded-xl border border-border">
            <div>
              <h2 className="text-base font-semibold text-foreground">Leave Requests & Balance</h2>
              <p className="text-xs text-muted-foreground">
                Submit time off requests to HR and track approval statuses.
              </p>
            </div>
            <button
              id="emp-open-leave-form-btn"
              onClick={() => setIsLeaveModalOpen(true)}
              className="px-3.5 py-1.5 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              New Leave Request
            </button>
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/50 text-muted-foreground font-medium uppercase border-b border-border">
                  <tr>
                    <th className="px-4 py-3">Leave Type</th>
                    <th className="px-4 py-3">Start Date</th>
                    <th className="px-4 py-3">End Date</th>
                    <th className="px-4 py-3">Total Days</th>
                    <th className="px-4 py-3">Approval Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {myLeaveRequests.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                        No leave requests submitted yet. Click "New Leave Request" to request PTO.
                      </td>
                    </tr>
                  ) : (
                    myLeaveRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-muted/30">
                        <td className="px-4 py-3 font-medium text-foreground flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-primary" />
                          {req.type}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{req.startDate}</td>
                        <td className="px-4 py-3 text-muted-foreground">{req.endDate}</td>
                        <td className="px-4 py-3 font-semibold text-foreground">{req.days} days</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              req.status === 'APPROVED'
                                ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                : req.status === 'REJECTED'
                                ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                                : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                            }`}
                          >
                            {req.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Compensation & Payslips */}
      {activePortalTab === 'payroll' && (
        <div id="emp-payroll-section" className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pay Summary Card */}
            <div className="md:col-span-2 bg-card border border-border rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-base font-semibold text-foreground">Current Pay Period Breakdown</h3>
                  <p className="text-xs text-muted-foreground">
                    Based on contract compensation rate of {formatCurrency(annualSalary)}/yr.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  Direct Deposit Active
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Monthly Gross Salary</span>
                  <span className="font-semibold text-foreground">{formatCurrency(monthlyGross)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Federal & State Tax Withholding (22%)</span>
                  <span className="font-semibold text-rose-600">-{formatCurrency(taxWithholding)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Health, Dental & Retirement (5%)</span>
                  <span className="font-semibold text-rose-600">-{formatCurrency(benefitsDeduction)}</span>
                </div>
                <div className="flex justify-between py-2 pt-3 font-bold text-sm bg-muted/30 px-3 rounded-lg">
                  <span className="text-foreground">Net Take-Home Deposit</span>
                  <span className="text-emerald-600 font-bold">{formatCurrency(monthlyNet)}</span>
                </div>
              </div>
            </div>

            {/* Direct Deposit Card */}
            <div className="bg-card border border-border rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary w-fit">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-semibold text-foreground">Direct Deposit Details</h4>
                <p className="text-xs text-muted-foreground">
                  Compensation is wired electronically to your authorized institutional checking account.
                </p>
              </div>

              <div className="p-3 bg-muted/40 rounded-lg space-y-1 text-xs">
                <div className="text-muted-foreground">Account Routing:</div>
                <div className="font-mono font-medium text-foreground">{empData.bankAccount}</div>
                <div className="text-[11px] text-muted-foreground pt-1">Frequency: {empData.payFrequency}</div>
              </div>
            </div>
          </div>

          {/* Historical Payroll Runs for this Business */}
          <div className="bg-card border border-border rounded-xl p-4 shadow-xs space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Recent Payroll Disbursements</h4>
            <div className="divide-y divide-border">
              {payrollRuns
                .filter((pr) => pr.businessId === empData.businessId)
                .slice(0, 4)
                .map((run) => (
                  <div
                    key={run.id}
                    className="py-3 flex items-center justify-between text-xs hover:bg-muted/20 px-2 rounded-lg"
                  >
                    <div className="space-y-0.5">
                      <div className="font-semibold text-foreground">Payroll Period {run.period}</div>
                      <div className="text-muted-foreground text-[11px]">Processed on {run.runDate}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-semibold text-emerald-600">Disbursed</div>
                        <div className="text-muted-foreground text-[11px]">Direct Transfer</div>
                      </div>
                      <button
                        onClick={() =>
                          setSelectedPayslip({
                            period: run.period,
                            date: run.runDate,
                            gross: monthlyGross,
                            net: monthlyNet,
                            tax: taxWithholding
                          })
                        }
                        className="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground"
                        title="View Pay Stub"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Expense Reimbursements */}
      {activePortalTab === 'expenses' && (
        <div id="emp-expenses-section" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-4 rounded-xl border border-border">
            <div>
              <h2 className="text-base font-semibold text-foreground">Expense Reimbursements</h2>
              <p className="text-xs text-muted-foreground">
                Submit out-of-pocket work expenses (software, travel, equipment) for reimbursement.
              </p>
            </div>
            <button
              id="emp-open-expense-form-btn"
              onClick={() => setIsExpenseModalOpen(true)}
              className="px-3.5 py-1.5 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              File Claim
            </button>
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/50 text-muted-foreground font-medium uppercase border-b border-border">
                  <tr>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Vendor / Merchant</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {myExpenses.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                        No expense claims on record. Click "File Claim" to submit a receipt.
                      </td>
                    </tr>
                  ) : (
                    myExpenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-muted/30">
                        <td className="px-4 py-3 font-medium text-foreground">{exp.description}</td>
                        <td className="px-4 py-3 text-muted-foreground">{exp.category}</td>
                        <td className="px-4 py-3 text-muted-foreground">{exp.vendor}</td>
                        <td className="px-4 py-3 font-semibold text-foreground">
                          {formatCurrency(exp.amount)}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{exp.date}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              exp.status === 'APPROVED'
                                ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                            }`}
                          >
                            {exp.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Team & Directory */}
      {activePortalTab === 'team' && (
        <div id="emp-team-section" className="space-y-4">
          <div className="bg-card p-4 rounded-xl border border-border">
            <h2 className="text-base font-semibold text-foreground">Colleagues & Department Directory</h2>
            <p className="text-xs text-muted-foreground">
              Team members in {activeBusiness?.name || 'your business unit'}.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {employees
              .filter((e) => e.businessId === empData.businessId)
              .map((colleague) => (
                <div
                  key={colleague.id}
                  className={`bg-card border rounded-xl p-4 shadow-xs space-y-3 ${
                    colleague.id === empData.id ? 'border-primary/40 ring-1 ring-primary/20' : 'border-border'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                      {colleague.firstName[0]}
                      {colleague.lastName[0]}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                        {colleague.firstName} {colleague.lastName}
                        {colleague.id === empData.id && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-primary/10 text-primary">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">{colleague.role}</div>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span>Department:</span>
                      <span className="font-medium text-foreground">{colleague.department}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Email:</span>
                      <span className="font-medium text-foreground">{colleague.email}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Modal: Submit Leave Request */}
      {isLeaveModalOpen && (
        <div
          id="leave-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          onClick={() => setIsLeaveModalOpen(false)}
        >
          <div
            id="leave-modal-card"
            className="bg-card border border-border rounded-xl shadow-2xl p-6 w-full max-w-md space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Submit Leave / PTO Request
            </h3>

            {leaveSuccessMsg ? (
              <div className="p-4 rounded-lg bg-emerald-500/10 text-emerald-600 text-xs font-medium text-center">
                {leaveSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleLeaveSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">Leave Category</label>
                  <select
                    id="leave-type-select"
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-muted/40 border border-border rounded-lg text-foreground"
                  >
                    <option value="VACATION">Vacation / Paid Time Off</option>
                    <option value="SICK">Medical / Sick Leave</option>
                    <option value="PERSONAL">Personal Leave</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-muted-foreground mb-1 font-medium">Start Date *</label>
                    <input
                      id="leave-start-date"
                      type="date"
                      required
                      value={leaveStart}
                      onChange={(e) => setLeaveStart(e.target.value)}
                      className="w-full px-3 py-2 bg-muted/40 border border-border rounded-lg text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1 font-medium">End Date *</label>
                    <input
                      id="leave-end-date"
                      type="date"
                      required
                      value={leaveEnd}
                      onChange={(e) => setLeaveEnd(e.target.value)}
                      className="w-full px-3 py-2 bg-muted/40 border border-border rounded-lg text-foreground"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">Total Business Days</label>
                  <input
                    id="leave-days-input"
                    type="number"
                    min="1"
                    max="30"
                    value={leaveDays}
                    onChange={(e) => setLeaveDays(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-muted/40 border border-border rounded-lg text-foreground"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setIsLeaveModalOpen(false)}
                    className="px-3.5 py-1.5 text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    id="submit-leave-btn"
                    type="submit"
                    className="px-4 py-1.5 bg-primary text-primary-foreground rounded-lg font-medium shadow-xs"
                  >
                    Submit for Approval
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal: Claim Expense */}
      {isExpenseModalOpen && (
        <div
          id="expense-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          onClick={() => setIsExpenseModalOpen(false)}
        >
          <div
            id="expense-modal-card"
            className="bg-card border border-border rounded-xl shadow-2xl p-6 w-full max-w-md space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Receipt className="w-5 h-5 text-primary" />
              File Expense Claim
            </h3>

            {expenseSuccessMsg ? (
              <div className="p-4 rounded-lg bg-emerald-500/10 text-emerald-600 text-xs font-medium text-center">
                {expenseSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleExpenseSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">Expense Item / Purpose *</label>
                  <input
                    id="exp-claim-title"
                    type="text"
                    required
                    placeholder="e.g. AWS Cloud Certification Voucher"
                    value={expenseTitle}
                    onChange={(e) => setExpenseTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-muted/40 border border-border rounded-lg text-foreground"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-muted-foreground mb-1 font-medium">Amount ($) *</label>
                    <input
                      id="exp-claim-amount"
                      type="number"
                      min="1"
                      required
                      placeholder="150"
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value)}
                      className="w-full px-3 py-2 bg-muted/40 border border-border rounded-lg text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1 font-medium">Category</label>
                    <select
                      id="exp-claim-category"
                      value={expenseCategory}
                      onChange={(e) => setExpenseCategory(e.target.value as any)}
                      className="w-full px-3 py-2 bg-muted/40 border border-border rounded-lg text-foreground"
                    >
                      <option value="SOFTWARE">Software & Tools</option>
                      <option value="TRAVEL">Travel & Transport</option>
                      <option value="EQUIPMENT">Hardware / Equipment</option>
                      <option value="OFFICE">Office Supplies</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">Merchant / Vendor</label>
                  <input
                    id="exp-claim-vendor"
                    type="text"
                    placeholder="e.g. Amazon Web Services"
                    value={expenseVendor}
                    onChange={(e) => setExpenseVendor(e.target.value)}
                    className="w-full px-3 py-2 bg-muted/40 border border-border rounded-lg text-foreground"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setIsExpenseModalOpen(false)}
                    className="px-3.5 py-1.5 text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    id="submit-expense-btn"
                    type="submit"
                    className="px-4 py-1.5 bg-primary text-primary-foreground rounded-lg font-medium shadow-xs"
                  >
                    File Claim
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal: Add Task */}
      {isTaskModalOpen && (
        <div
          id="task-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          onClick={() => setIsTaskModalOpen(false)}
        >
          <div
            id="task-modal-card"
            className="bg-card border border-border rounded-xl shadow-2xl p-6 w-full max-w-md space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              Add / Assign Task
            </h3>

            <form onSubmit={handleTaskSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-muted-foreground mb-1 font-medium">Task Title *</label>
                <input
                  id="new-task-title"
                  type="text"
                  required
                  placeholder="e.g. Review Terraform PR for multi-region failover"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-muted/40 border border-border rounded-lg text-foreground"
                />
              </div>

              <div>
                <label className="block text-muted-foreground mb-1 font-medium">Description</label>
                <textarea
                  id="new-task-desc"
                  rows={2}
                  placeholder="Optional details..."
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-muted/40 border border-border rounded-lg text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">Priority</label>
                  <select
                    id="new-task-priority"
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-muted/40 border border-border rounded-lg text-foreground"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">Due Date</label>
                  <input
                    id="new-task-duedate"
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-muted/40 border border-border rounded-lg text-foreground"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-3.5 py-1.5 text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  id="submit-task-btn"
                  type="submit"
                  className="px-4 py-1.5 bg-primary text-primary-foreground rounded-lg font-medium shadow-xs"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Payslip Voucher */}
      {selectedPayslip && (
        <div
          id="payslip-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          onClick={() => setSelectedPayslip(null)}
        >
          <div
            id="payslip-modal-card"
            className="bg-card border border-border rounded-xl shadow-2xl p-6 w-full max-w-lg space-y-4 font-mono text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-sm font-bold text-foreground">PAYROLL ADVICE / DISBURSEMENT VOUCHER</h3>
                <p className="text-[11px] text-muted-foreground">
                  {activeBusiness?.name} • Employer ID: {empData.businessId}
                </p>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-semibold">
                PAID
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 py-2 border-b border-border text-muted-foreground">
              <div>
                <span className="block text-[10px] uppercase">Employee</span>
                <span className="text-foreground font-bold">{currentUser.name}</span>
                <span className="block text-[11px]">{currentUser.title}</span>
              </div>
              <div className="text-right">
                <span className="block text-[10px] uppercase">Period & Date</span>
                <span className="text-foreground font-bold">{selectedPayslip.period}</span>
                <span className="block text-[11px]">Disbursed: {selectedPayslip.date}</span>
              </div>
            </div>

            <div className="space-y-1.5 py-2 border-b border-border">
              <div className="flex justify-between">
                <span>Base Gross Earnings:</span>
                <span className="text-foreground font-bold">{formatCurrency(selectedPayslip.gross)}</span>
              </div>
              <div className="flex justify-between text-rose-500">
                <span>Federal & State Withholding:</span>
                <span>-{formatCurrency(selectedPayslip.tax)}</span>
              </div>
              <div className="flex justify-between text-rose-500">
                <span>Health & Benefit Deductions:</span>
                <span>-{formatCurrency(Math.round(selectedPayslip.gross * 0.05))}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-emerald-600 pt-2 border-t border-border/60">
                <span>NET DIRECT DEPOSIT:</span>
                <span>{formatCurrency(selectedPayslip.net)}</span>
              </div>
            </div>

            <div className="text-[11px] text-muted-foreground flex justify-between items-center pt-2">
              <span>Account: {empData.bankAccount}</span>
              <button
                onClick={() => setSelectedPayslip(null)}
                className="px-3 py-1 bg-secondary text-secondary-foreground rounded border border-border"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

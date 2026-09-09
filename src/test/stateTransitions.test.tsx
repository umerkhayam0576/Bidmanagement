import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { BusinessProvider, useBusiness } from '../context/BusinessContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BusinessProvider>{children}</BusinessProvider>
);

describe('Core Module State Transitions & Invariants', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('verifies task lifecycle and status transitions', () => {
    const { result } = renderHook(() => useBusiness(), { wrapper });

    act(() => {
      result.current.switchBusiness('biz_apex');
    });

    const project = result.current.filteredProjects[0];
    expect(project).toBeDefined();

    const initialTasksCount = result.current.filteredTasks.length;

    act(() => {
      result.current.addTask({
        businessId: project.businessId,
        projectId: project.id,
        title: 'Implement Global DNS Geo-Routing',
        description: 'Deploy Cloudflare worker failovers',
        status: 'TODO',
        priority: 'CRITICAL',
        assignedTo: 'Alex Wright',
        dueDate: '2025-05-15',
      });
    });

    expect(result.current.filteredTasks.length).toBe(initialTasksCount + 1);
    const newTask = result.current.filteredTasks[0];
    expect(newTask.status).toBe('TODO');

    // Transition status to IN_PROGRESS
    act(() => {
      result.current.updateTaskStatus(newTask.id, 'IN_PROGRESS');
    });
    expect(
      result.current.filteredTasks.find((t) => t.id === newTask.id)?.status
    ).toBe('IN_PROGRESS');

    // Transition status to COMPLETED
    act(() => {
      result.current.updateTaskStatus(newTask.id, 'COMPLETED');
    });
    expect(
      result.current.filteredTasks.find((t) => t.id === newTask.id)?.status
    ).toBe('COMPLETED');
  });

  it('manages employee leave request submission and approval', () => {
    const { result } = renderHook(() => useBusiness(), { wrapper });

    act(() => {
      result.current.switchBusiness('biz_apex');
    });

    const activeEmp = result.current.filteredEmployees.find((e) => e.status === 'ACTIVE');
    expect(activeEmp).toBeDefined();

    const initialLeavesCount = result.current.filteredLeaveRequests.length;

    act(() => {
      result.current.submitLeaveRequest({
        businessId: activeEmp!.businessId,
        employeeId: activeEmp!.id,
        employeeName: `${activeEmp!.firstName} ${activeEmp!.lastName}`,
        type: 'VACATION',
        startDate: '2025-06-01',
        endDate: '2025-06-10',
        days: 7,
        reason: 'Annual family summer recess',
      });
    });

    expect(result.current.filteredLeaveRequests.length).toBe(initialLeavesCount + 1);
    const newRequest = result.current.filteredLeaveRequests[0];
    expect(newRequest.status).toBe('PENDING');

    // Approve the leave request
    act(() => {
      result.current.approveLeaveRequest(newRequest.id);
    });

    const approved = result.current.filteredLeaveRequests.find((r) => r.id === newRequest.id);
    expect(approved?.status).toBe('APPROVED');
  });

  it('processes corporate expense creation and manager approval', () => {
    const { result } = renderHook(() => useBusiness(), { wrapper });

    act(() => {
      result.current.switchBusiness('biz_apex');
    });

    const expensesCountBefore = result.current.filteredExpenses.length;

    act(() => {
      result.current.addExpense({
        businessId: 'biz_apex',
        title: 'Kubernetes Cluster Reserved Capacity',
        amount: 8400,
        category: 'SOFTWARE',
        vendor: 'Google Cloud Platform',
        date: '2025-04-05',
        status: 'PENDING',
        paidBy: 'Corporate Treasury Wire',
        taxDeductible: true,
        notes: '3-year committed use prepayment',
      });
    });

    expect(result.current.filteredExpenses.length).toBe(expensesCountBefore + 1);
    const newExpense = result.current.filteredExpenses[0];
    expect(newExpense.status).toBe('PENDING');

    // Approve expense
    act(() => {
      result.current.approveExpense(newExpense.id);
    });

    const approvedExpense = result.current.filteredExpenses.find((e) => e.id === newExpense.id);
    expect(approvedExpense?.status).toBe('APPROVED');
  });

  it('manages document vault uploads across corporate and personal silos', () => {
    const { result } = renderHook(() => useBusiness(), { wrapper });

    const vaultDocsCountBefore = result.current.vaultDocuments.length;

    act(() => {
      result.current.addVaultDocument({
        businessId: 'biz_apex',
        isPersonal: false,
        title: 'Series B Term Sheet Executed Copy',
        category: 'LEGAL',
        size: '3.4 MB',
        fileType: 'PDF',
      });
    });

    expect(result.current.vaultDocuments.length).toBe(vaultDocsCountBefore + 1);
    const corporateDoc = result.current.vaultDocuments[0];
    expect(corporateDoc.title).toBe('Series B Term Sheet Executed Copy');
    expect(corporateDoc.isPersonal).toBe(false);
    expect(corporateDoc.uploadDate).toBeDefined();

    // Add personal estate document
    act(() => {
      result.current.addVaultDocument({
        isPersonal: true,
        title: 'Living Family Trust Charter 2025',
        category: 'PERSONAL_ESTATE',
        size: '1.8 MB',
        fileType: 'PDF',
      });
    });

    expect(result.current.vaultDocuments.length).toBe(vaultDocsCountBefore + 2);
    const personalDoc = result.current.vaultDocuments[0];
    expect(personalDoc.isPersonal).toBe(true);
    expect(personalDoc.category).toBe('PERSONAL_ESTATE');
  });

  it('handles notification acknowledgment and dismissal', () => {
    const { result } = renderHook(() => useBusiness(), { wrapper });

    const unread = result.current.notifications.find((n) => !n.read);
    if (unread) {
      act(() => {
        result.current.markNotificationRead(unread.id);
      });
      const updated = result.current.notifications.find((n) => n.id === unread.id);
      expect(updated?.read).toBe(true);

      act(() => {
        result.current.dismissNotification(unread.id);
      });
      const dismissed = result.current.notifications.find((n) => n.id === unread.id);
      expect(dismissed).toBeUndefined();
    }
  });

  it('formats currencies according to business context and custom overrides', () => {
    const { result } = renderHook(() => useBusiness(), { wrapper });

    // Active business biz_apex uses USD
    act(() => {
      result.current.switchBusiness('biz_apex');
    });
    const formattedUsd = result.current.formatCurrency(150000);
    expect(formattedUsd).toContain('$');
    expect(formattedUsd).toContain('150,000');

    // Switch to Kensington Estates (GBP)
    act(() => {
      result.current.switchBusiness('biz_kensington');
    });
    const formattedGbp = result.current.formatCurrency(150000);
    expect(formattedGbp).toContain('£');

    // Switch to Nordic Roasters (EUR)
    act(() => {
      result.current.switchBusiness('biz_nordic');
    });
    const formattedEur = result.current.formatCurrency(150000);
    expect(formattedEur).toContain('€');

    // Custom currency override (e.g. AED)
    const formattedAed = result.current.formatCurrency(150000, 'AED');
    expect(formattedAed).toContain('AED');
  });

  it('switches user profile and logs audit event', () => {
    const { result } = renderHook(() => useBusiness(), { wrapper });

    const cfoProfile = result.current.userProfiles.find((u) => u.globalRole === 'FINANCE_LEAD');
    expect(cfoProfile).toBeDefined();

    act(() => {
      result.current.switchUser(cfoProfile!.id);
    });

    expect(result.current.currentUser.id).toBe(cfoProfile!.id);
    expect(result.current.currentUser.name).toBe('Elena Rostova');

    const latestAudit = result.current.auditLogs[0];
    expect(latestAudit.action).toContain('Switched user profile to Elena Rostova');
  });
});

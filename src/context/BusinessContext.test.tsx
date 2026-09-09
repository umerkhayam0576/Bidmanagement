import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, renderHook, act, fireEvent } from '@testing-library/react';
import React from 'react';
import { BusinessProvider, useBusiness, NavigationTab } from '@/context/BusinessContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BusinessProvider>{children}</BusinessProvider>
);

describe('BusinessProvider & BusinessContext Core Suite', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('BusinessProvider Initialization', () => {
    it('successfully initializes with default state and renders wrapped children', () => {
      render(
        <BusinessProvider>
          <div data-testid="portal-child">Enterprise Portal Workspace</div>
        </BusinessProvider>
      );

      const childElement = screen.getByTestId('portal-child');
      expect(childElement).toBeDefined();
      expect(childElement.textContent).toBe('Enterprise Portal Workspace');
    });

    it('initializes default active business ID, active business object, and default activeTab', () => {
      const { result } = renderHook(() => useBusiness(), { wrapper });

      // Active Business ID and entity
      expect(result.current.activeBusinessId).toBe('biz_apex');
      expect(result.current.activeBusiness).not.toBeNull();
      expect(result.current.activeBusiness?.id).toBe('biz_apex');
      expect(result.current.activeBusiness?.name).toBe('Apex Cloud Technologies Inc.');
      expect(result.current.activeBusiness?.currency).toBe('USD');

      // Active Navigation Tab
      expect(result.current.activeTab).toBe('overview');

      // Current User & Corporate collections
      expect(result.current.currentUser).toBeDefined();
      expect(result.current.currentUser.name).toBe('Omar Refay');
      expect(result.current.businesses.length).toBeGreaterThan(0);
      expect(result.current.filteredInvoices.length).toBeGreaterThan(0);
      expect(result.current.filteredEmployees.length).toBeGreaterThan(0);
    });

    it('successfully initializes active business ID from localStorage when present', () => {
      localStorage.setItem('refay_activeBizId', JSON.stringify('biz_nordic'));

      const { result } = renderHook(() => useBusiness(), { wrapper });

      expect(result.current.activeBusinessId).toBe('biz_nordic');
      expect(result.current.activeBusiness?.id).toBe('biz_nordic');
      expect(result.current.activeBusiness?.name).toBe('Nordic Roasters & Goods');
      expect(result.current.activeBusiness?.currency).toBe('EUR');
    });

    it('throws a descriptive error when useBusiness is invoked outside of BusinessProvider', () => {
      const originalConsoleError = console.error;
      console.error = () => {};

      expect(() => {
        renderHook(() => useBusiness());
      }).toThrowError('useBusiness must be used within a BusinessProvider');

      console.error = originalConsoleError;
    });
  });

  describe('Updating the Active Business ID', () => {
    it('successfully updates active business ID and persists to localStorage', () => {
      const { result } = renderHook(() => useBusiness(), { wrapper });

      expect(result.current.activeBusinessId).toBe('biz_apex');

      // Switch to Nordic Roasters
      act(() => {
        result.current.switchBusiness('biz_nordic');
      });

      expect(result.current.activeBusinessId).toBe('biz_nordic');
      expect(result.current.activeBusiness?.id).toBe('biz_nordic');
      expect(result.current.activeBusiness?.name).toBe('Nordic Roasters & Goods');
      expect(localStorage.getItem('refay_activeBizId')).toBe(JSON.stringify('biz_nordic'));

      // Switch to Kensington Estates
      act(() => {
        result.current.switchBusiness('biz_kensington');
      });

      expect(result.current.activeBusinessId).toBe('biz_kensington');
      expect(result.current.activeBusiness?.id).toBe('biz_kensington');
      expect(result.current.activeBusiness?.name).toBe('Kensington Estates Ltd.');
      expect(result.current.activeBusiness?.currency).toBe('GBP');
      expect(localStorage.getItem('refay_activeBizId')).toBe(JSON.stringify('biz_kensington'));
    });

    it('successfully updates active business ID to CONSOLIDATED view setting activeBusiness to null', () => {
      const { result } = renderHook(() => useBusiness(), { wrapper });

      act(() => {
        result.current.switchBusiness('CONSOLIDATED');
      });

      expect(result.current.activeBusinessId).toBe('CONSOLIDATED');
      expect(result.current.activeBusiness).toBeNull();
      expect(localStorage.getItem('refay_activeBizId')).toBe(JSON.stringify('CONSOLIDATED'));

      // In CONSOLIDATED view, invoices and employees aggregate across all companies
      const consolidatedInvoices = result.current.filteredInvoices.length;
      expect(consolidatedInvoices).toBeGreaterThan(0);

      // Return to individual business
      act(() => {
        result.current.switchBusiness('biz_apex');
      });

      expect(result.current.activeBusinessId).toBe('biz_apex');
      expect(result.current.activeBusiness?.id).toBe('biz_apex');
      expect(result.current.filteredInvoices.length).toBeLessThanOrEqual(consolidatedInvoices);
      expect(
        result.current.filteredInvoices.every((inv) => inv.businessId === 'biz_apex')
      ).toBe(true);
    });

    it('updates active business ID correctly when triggered by UI interactions', () => {
      const BusinessSwitcherComponent = () => {
        const { activeBusinessId, activeBusiness, switchBusiness } = useBusiness();
        return (
          <div>
            <div data-testid="current-biz-id">{activeBusinessId}</div>
            <div data-testid="current-biz-name">{activeBusiness?.name || 'Consolidated'}</div>
            <button
              data-testid="btn-switch-nordic"
              onClick={() => switchBusiness('biz_nordic')}
            >
              Switch to Nordic
            </button>
            <button
              data-testid="btn-switch-consolidated"
              onClick={() => switchBusiness('CONSOLIDATED')}
            >
              Switch to Consolidated
            </button>
          </div>
        );
      };

      render(
        <BusinessProvider>
          <BusinessSwitcherComponent />
        </BusinessProvider>
      );

      expect(screen.getByTestId('current-biz-id').textContent).toBe('biz_apex');
      expect(screen.getByTestId('current-biz-name').textContent).toBe('Apex Cloud Technologies Inc.');

      // Click button to switch to Nordic
      fireEvent.click(screen.getByTestId('btn-switch-nordic'));
      expect(screen.getByTestId('current-biz-id').textContent).toBe('biz_nordic');
      expect(screen.getByTestId('current-biz-name').textContent).toBe('Nordic Roasters & Goods');

      // Click button to switch to Consolidated
      fireEvent.click(screen.getByTestId('btn-switch-consolidated'));
      expect(screen.getByTestId('current-biz-id').textContent).toBe('CONSOLIDATED');
      expect(screen.getByTestId('current-biz-name').textContent).toBe('Consolidated');
    });
  });

  describe('Changing activeTab State Correctly When Triggered', () => {
    it('initializes with "overview" as the default activeTab', () => {
      const { result } = renderHook(() => useBusiness(), { wrapper });
      expect(result.current.activeTab).toBe('overview');
    });

    it('changes the activeTab state correctly when setActiveTab is called', () => {
      const { result } = renderHook(() => useBusiness(), { wrapper });

      const tabsToTest: NavigationTab[] = [
        'billing',
        'finance',
        'hr-payroll',
        'crm',
        'inventory',
        'projects',
        'personal-wealth',
        'documents',
        'messages',
        'audit-logs',
        'settings',
        'overview',
      ];

      tabsToTest.forEach((tab) => {
        act(() => {
          result.current.setActiveTab(tab);
        });
        expect(result.current.activeTab).toBe(tab);
      });
    });

    it('changes the activeTab state correctly when triggered by UI click events', () => {
      const TabNavigationComponent = () => {
        const { activeTab, setActiveTab } = useBusiness();
        return (
          <div>
            <div data-testid="active-tab-display">{activeTab}</div>
            <button
              data-testid="tab-finance-btn"
              onClick={() => setActiveTab('finance')}
            >
              Finance
            </button>
            <button
              data-testid="tab-payroll-btn"
              onClick={() => setActiveTab('hr-payroll')}
            >
              Payroll
            </button>
            <button
              data-testid="tab-billing-btn"
              onClick={() => setActiveTab('billing')}
            >
              Billing
            </button>
          </div>
        );
      };

      render(
        <BusinessProvider>
          <TabNavigationComponent />
        </BusinessProvider>
      );

      const tabDisplay = screen.getByTestId('active-tab-display');
      expect(tabDisplay.textContent).toBe('overview');

      // Trigger switch to Finance
      fireEvent.click(screen.getByTestId('tab-finance-btn'));
      expect(tabDisplay.textContent).toBe('finance');

      // Trigger switch to Payroll
      fireEvent.click(screen.getByTestId('tab-payroll-btn'));
      expect(tabDisplay.textContent).toBe('hr-payroll');

      // Trigger switch to Billing
      fireEvent.click(screen.getByTestId('tab-billing-btn'));
      expect(tabDisplay.textContent).toBe('billing');
    });

    it('preserves activeTab state independently when switching active businesses', () => {
      const { result } = renderHook(() => useBusiness(), { wrapper });

      act(() => {
        result.current.setActiveTab('hr-payroll');
      });
      expect(result.current.activeTab).toBe('hr-payroll');

      // Switch business while on 'hr-payroll' tab
      act(() => {
        result.current.switchBusiness('biz_kensington');
      });

      expect(result.current.activeBusinessId).toBe('biz_kensington');
      // activeTab should remain on 'hr-payroll'
      expect(result.current.activeTab).toBe('hr-payroll');
    });
  });

  describe('Business Module State Structure & Contract Invariants', () => {
    it('maintains expected structure for CRM and Invoicing modules', () => {
      const { result } = renderHook(() => useBusiness(), { wrapper });
      const ctx = result.current;

      // CRM
      expect(Array.isArray(ctx.filteredLeads)).toBe(true);
      expect(Array.isArray(ctx.filteredClients)).toBe(true);
      expect(Array.isArray(ctx.filteredPartners)).toBe(true);
      expect(typeof ctx.addLead).toBe('function');
      expect(typeof ctx.updateLeadStage).toBe('function');
      expect(typeof ctx.convertLeadToClient).toBe('function');

      // Billing & Invoicing
      expect(Array.isArray(ctx.filteredInvoices)).toBe(true);
      expect(Array.isArray(ctx.filteredQuotations)).toBe(true);
      expect(typeof ctx.addInvoice).toBe('function');
      expect(typeof ctx.updateInvoiceStatus).toBe('function');
      expect(typeof ctx.addQuotation).toBe('function');
    });

    it('maintains expected structure for Operations, HR, and Treasury modules', () => {
      const { result } = renderHook(() => useBusiness(), { wrapper });
      const ctx = result.current;

      // HR & Payroll
      expect(Array.isArray(ctx.filteredEmployees)).toBe(true);
      expect(Array.isArray(ctx.filteredPayrollRuns)).toBe(true);
      expect(Array.isArray(ctx.filteredLeaveRequests)).toBe(true);
      expect(typeof ctx.addEmployee).toBe('function');
      expect(typeof ctx.triggerPayrollRun).toBe('function');

      // Operations & Inventory
      expect(Array.isArray(ctx.filteredInventory)).toBe(true);
      expect(Array.isArray(ctx.filteredPurchaseOrders)).toBe(true);
      expect(typeof ctx.addInventoryItem).toBe('function');
      expect(typeof ctx.restockItem).toBe('function');

      // Treasury & Wealth
      expect(Array.isArray(ctx.filteredBankAccounts)).toBe(true);
      expect(Array.isArray(ctx.filteredExpenses)).toBe(true);
      expect(typeof ctx.calculateNetWorth).toBe('function');

      const netWorth = ctx.calculateNetWorth();
      expect(typeof netWorth.totalPersonalAssets).toBe('number');
      expect(typeof netWorth.totalBusinessEquityValue).toBe('number');
      expect(typeof netWorth.netWorth).toBe('number');
    });
  });

  describe('Employee Role, Registration & Interface Mode', () => {
    it('identifies executive users with isEmployee = false by default', () => {
      const { result } = renderHook(() => useBusiness(), { wrapper });

      expect(result.current.currentUser.globalRole).toBe('SUPER_OWNER');
      expect(result.current.isEmployee).toBe(false);
    });

    it('switches to employee persona, setting isEmployee = true and resolving currentEmployee', () => {
      const { result } = renderHook(() => useBusiness(), { wrapper });

      act(() => {
        result.current.switchUser('usr_emp_alex');
      });

      expect(result.current.currentUser.id).toBe('usr_emp_alex');
      expect(result.current.currentUser.globalRole).toBe('EMPLOYEE');
      expect(result.current.isEmployee).toBe(true);
      expect(result.current.activeTab).toBe('overview');
      expect(result.current.activeBusinessId).toBe('biz_apex');
      expect(result.current.currentEmployee).toBeDefined();
      expect(result.current.currentEmployee?.firstName).toBe('Alexandre');
    });

    it('registers a new employee, creates profile, and switches interface automatically', () => {
      const { result } = renderHook(() => useBusiness(), { wrapper });

      let createdEmpId = '';
      act(() => {
        const emp = result.current.registerEmployee(
          {
            firstName: 'Sarah',
            lastName: 'Connor',
            email: 'sarah.connor@apexcloud.io',
            role: 'DevOps Security Specialist',
            department: 'ENGINEERING',
            salary: 135000,
            payFrequency: 'MONTHLY',
            hireDate: '2026-03-01',
            status: 'ACTIVE',
            bankAccount: 'US88-0000-1111-2222',
            businessId: 'biz_apex'
          },
          true
        );
        createdEmpId = emp.id;
      });

      expect(createdEmpId).toBeTruthy();
      expect(result.current.isEmployee).toBe(true);
      expect(result.current.currentUser.name).toBe('Sarah Connor');
      expect(result.current.currentUser.globalRole).toBe('EMPLOYEE');
      expect(result.current.currentUser.employeeId).toBe(createdEmpId);
      expect(result.current.activeBusinessId).toBe('biz_apex');
      expect(result.current.currentEmployee?.email).toBe('sarah.connor@apexcloud.io');
    });
  });
});

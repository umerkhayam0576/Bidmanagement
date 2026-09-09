import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { BusinessProvider, useBusiness } from '../context/BusinessContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BusinessProvider>{children}</BusinessProvider>
);

describe('BusinessContext Core State Transitions', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with default business context and entity collections', () => {
    const { result } = renderHook(() => useBusiness(), { wrapper });

    expect(result.current.activeBusinessId).toBe('biz_apex');
    expect(result.current.businesses.length).toBeGreaterThan(0);
    expect(result.current.activeBusiness?.id).toBe('biz_apex');
    expect(result.current.currentUser).toBeDefined();
  });

  it('switches active business and updates scoped entity collections', () => {
    const { result } = renderHook(() => useBusiness(), { wrapper });

    // Switch to CONSOLIDATED view
    act(() => {
      result.current.switchBusiness('CONSOLIDATED');
    });

    expect(result.current.activeBusinessId).toBe('CONSOLIDATED');
    expect(result.current.activeBusiness).toBeNull();
    const consolidatedInvoicesCount = result.current.filteredInvoices.length;

    // Switch to specific single enterprise: Nordic Roast
    act(() => {
      result.current.switchBusiness('biz_nordic');
    });

    expect(result.current.activeBusinessId).toBe('biz_nordic');
    expect(result.current.activeBusiness?.name).toBe('Nordic Roasters & Goods');
    expect(
      result.current.filteredInvoices.every((inv) => inv.businessId === 'biz_nordic')
    ).toBe(true);
    expect(result.current.filteredInvoices.length).toBeLessThanOrEqual(consolidatedInvoicesCount);
  });

  it('handles invoice creation and status updates', () => {
    const { result } = renderHook(() => useBusiness(), { wrapper });

    act(() => {
      result.current.switchBusiness('biz_apex');
    });

    const initialCount = result.current.filteredInvoices.length;

    act(() => {
      result.current.addInvoice({
        businessId: 'biz_apex',
        clientId: 'client_1',
        clientName: 'Apex Strategic Client',
        invoiceNumber: 'INV-TEST-2025',
        issueDate: '2025-04-01',
        dueDate: '2025-04-30',
        items: [
          {
            id: 'item_1',
            description: 'Cloud Infrastructure Consulting',
            quantity: 10,
            unitPrice: 200,
            total: 2000,
          },
        ],
        subtotal: 2000,
        tax: 200,
        total: 2200,
        currency: 'USD',
        status: 'SENT',
      });
    });

    expect(result.current.filteredInvoices.length).toBe(initialCount + 1);
    const createdInvoice = result.current.filteredInvoices[0];
    expect(createdInvoice.invoiceNumber).toBe('INV-TEST-2025');
    expect(createdInvoice.status).toBe('SENT');

    // Transition invoice to PAID
    act(() => {
      result.current.updateInvoiceStatus(createdInvoice.id, 'PAID');
    });

    const updated = result.current.filteredInvoices.find((i) => i.id === createdInvoice.id);
    expect(updated?.status).toBe('PAID');
    expect(updated?.paidAt).toBeDefined();
  });

  it('converts quotation into invoice seamlessly', () => {
    const { result } = renderHook(() => useBusiness(), { wrapper });

    act(() => {
      result.current.switchBusiness('biz_apex');
    });

    act(() => {
      result.current.addQuotation({
        businessId: 'biz_apex',
        clientId: 'client_1',
        clientName: 'Acme Global',
        quoteNumber: 'QUO-TEST-101',
        issueDate: '2025-04-01',
        validUntil: '2025-04-15',
        items: [
          {
            id: 'qi_1',
            description: 'Security & Penetration Audit',
            quantity: 1,
            unitPrice: 5000,
            total: 5000,
          },
        ],
        subtotal: 5000,
        tax: 500,
        total: 5500,
        currency: 'USD',
        status: 'ACCEPTED',
      });
    });

    const quote = result.current.filteredQuotations.find((q) => q.quoteNumber === 'QUO-TEST-101');
    expect(quote).toBeDefined();

    const invCountBefore = result.current.filteredInvoices.length;

    act(() => {
      result.current.convertQuotationToInvoice(quote!.id);
    });

    expect(result.current.filteredInvoices.length).toBe(invCountBefore + 1);
    const convertedQuote = result.current.filteredQuotations.find((q) => q.id === quote!.id);
    expect(convertedQuote?.status).toBe('CONVERTED');
  });

  it('manages employee enrollment and triggers payroll runs', () => {
    const { result } = renderHook(() => useBusiness(), { wrapper });

    act(() => {
      result.current.switchBusiness('biz_apex');
    });

    const staffCountBefore = result.current.filteredEmployees.length;

    act(() => {
      result.current.addEmployee({
        businessId: 'biz_apex',
        firstName: 'Alexander',
        lastName: 'Wright',
        email: 'alex.wright@apexcloud.io',
        role: 'Lead Cloud Architect',
        department: 'ENGINEERING',
        salary: 180000,
        payFrequency: 'MONTHLY',
        hireDate: '2025-04-01',
        status: 'ACTIVE',
        bankAccount: 'US-CHECKING-****9999',
      });
    });

    expect(result.current.filteredEmployees.length).toBe(staffCountBefore + 1);

    // Trigger payroll run for period
    const payrollRunsBefore = result.current.filteredPayrollRuns.length;
    act(() => {
      result.current.triggerPayrollRun('May 2025');
    });

    expect(result.current.filteredPayrollRuns.length).toBe(payrollRunsBefore + 1);
    const latestRun = result.current.filteredPayrollRuns[0];
    expect(latestRun.period).toBe('May 2025');
    expect(latestRun.businessId).toBe('biz_apex');
    expect(latestRun.totalGross).toBeGreaterThan(0);
    expect(latestRun.status).toBe('APPROVED');
  });

  it('handles inventory addition and restocking updates', () => {
    const { result } = renderHook(() => useBusiness(), { wrapper });

    act(() => {
      result.current.switchBusiness('biz_nordic');
    });

    act(() => {
      result.current.addInventoryItem({
        businessId: 'biz_nordic',
        sku: 'TEST-SKU-ROAST-99',
        name: 'Single Origin Reserve Beans',
        category: 'Coffee Beans',
        quantity: 50,
        unitCost: 12.0,
        retailPrice: 24.0,
        reorderPoint: 20,
        warehouse: 'Central Bay A',
      });
    });

    const item = result.current.filteredInventory.find((i) => i.sku === 'TEST-SKU-ROAST-99');
    expect(item).toBeDefined();
    expect(item?.quantity).toBe(50);

    // Restock with +25 units
    act(() => {
      result.current.restockItem(item!.id, 25);
    });

    const restockedItem = result.current.filteredInventory.find((i) => i.id === item!.id);
    expect(restockedItem?.quantity).toBe(75);
    expect(restockedItem?.lastRestocked).toBeDefined();
  });

  it('manages CRM lead lifecycle and conversion to client', () => {
    const { result } = renderHook(() => useBusiness(), { wrapper });

    act(() => {
      result.current.switchBusiness('biz_apex');
    });

    act(() => {
      result.current.addLead({
        businessId: 'biz_apex',
        title: 'Enterprise Migration Deal',
        company: 'Vanguard Global Systems',
        contactName: 'Sarah Connor',
        email: 'sarah@vanguard.io',
        phone: '+1 555-0199',
        value: 45000,
        stage: 'NEW_LEAD',
        source: 'DIRECT_INBOUND',
        probability: 30,
        assignedTo: 'Marcus Vance',
      });
    });

    const lead = result.current.filteredLeads.find((l) => l.company === 'Vanguard Global Systems');
    expect(lead).toBeDefined();
    expect(lead?.stage).toBe('NEW_LEAD');

    // Advance to WON
    act(() => {
      result.current.updateLeadStage(lead!.id, 'WON');
    });

    const wonLead = result.current.filteredLeads.find((l) => l.id === lead!.id);
    expect(wonLead?.stage).toBe('WON');

    // Convert lead to client
    const clientsCountBefore = result.current.filteredClients.length;
    act(() => {
      result.current.convertLeadToClient(lead!.id);
    });

    expect(result.current.filteredClients.length).toBe(clientsCountBefore + 1);
    const newClient = result.current.filteredClients.find((c) => c.company === 'Vanguard Global Systems');
    expect(newClient).toBeDefined();
    expect(newClient?.name).toBe('Sarah Connor');
  });

  it('calculates net worth integrating personal assets, business equity, and liabilities', () => {
    const { result } = renderHook(() => useBusiness(), { wrapper });

    const initialNetWorth = result.current.calculateNetWorth();
    expect(initialNetWorth.totalPersonalAssets).toBeGreaterThan(0);
    expect(initialNetWorth.totalBusinessEquityValue).toBeGreaterThan(0);
    expect(initialNetWorth.netWorth).toBe(
      initialNetWorth.totalAssets - initialNetWorth.totalLiabilities
    );

    // Add personal asset
    act(() => {
      result.current.addPersonalAsset({
        category: 'REAL_ESTATE',
        title: 'Alpine Chalet Retreat',
        valuation: 1200000,
        institution: 'Geneva Private Bank',
        notes: 'Freehold mountain estate',
      });
    });

    const updatedNetWorth = result.current.calculateNetWorth();
    expect(updatedNetWorth.totalPersonalAssets).toBe(
      initialNetWorth.totalPersonalAssets + 1200000
    );
    expect(updatedNetWorth.netWorth).toBe(
      initialNetWorth.netWorth + 1200000
    );

    // Add personal liability
    act(() => {
      result.current.addPersonalLiability({
        category: 'MORTGAGE',
        title: 'Chalet Mortgage Note',
        remainingBalance: 500000,
        monthlyPayment: 2800,
        interestRate: 4.5,
        lender: 'Credit Suisse Private Banking',
      });
    });

    const postLiabilityNetWorth = result.current.calculateNetWorth();
    expect(postLiabilityNetWorth.totalLiabilities).toBe(
      initialNetWorth.totalLiabilities + 500000
    );
    expect(postLiabilityNetWorth.netWorth).toBe(
      updatedNetWorth.netWorth - 500000
    );
  });

  it('records audit logs on state mutations', () => {
    const { result } = renderHook(() => useBusiness(), { wrapper });

    const initialLogsCount = result.current.auditLogs.length;

    act(() => {
      result.current.addAuditLog(
        'Authorized executive share buyback tranche',
        'Equity Ledger',
        'biz_apex'
      );
    });

    expect(result.current.auditLogs.length).toBe(initialLogsCount + 1);
    const latestLog = result.current.auditLogs[0];
    expect(latestLog.action).toBe('Authorized executive share buyback tranche');
    expect(latestLog.entity).toBe('Equity Ledger');
    expect(latestLog.businessId).toBe('biz_apex');
  });
});

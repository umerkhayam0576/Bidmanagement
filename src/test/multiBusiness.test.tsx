import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { BusinessProvider, useBusiness } from '../context/BusinessContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BusinessProvider>{children}</BusinessProvider>
);

describe('Multi-Business State Management & Tenant Isolation', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('creates a new business entity and activates it immediately', () => {
    const { result } = renderHook(() => useBusiness(), { wrapper });

    const businessCountBefore = result.current.businesses.length;

    act(() => {
      result.current.addBusiness({
        name: 'Solaria Energy Labs',
        legalName: 'Solaria Energy Labs Inc.',
        taxId: 'US-EIN-99887766',
        industry: 'Renewable Energy & IoT',
        currency: 'USD',
        country: 'United States',
        monthlyRevenue: 340000,
        monthlyExpenses: 210000,
        valuation: 15000000,
        ownerEquityPercentage: 65,
        status: 'ACTIVE',
      });
    });

    expect(result.current.businesses.length).toBe(businessCountBefore + 1);
    const newBiz = result.current.businesses[result.current.businesses.length - 1];
    expect(newBiz.name).toBe('Solaria Energy Labs');
    expect(newBiz.ownerEquityPercentage).toBe(65);

    // Active business should switch to the newly created business
    expect(result.current.activeBusinessId).toBe(newBiz.id);
    expect(result.current.activeBusiness?.id).toBe(newBiz.id);
    expect(result.current.activeBusiness?.name).toBe('Solaria Energy Labs');

    // Audit log should record onboarding
    const latestAudit = result.current.auditLogs[0];
    expect(latestAudit.action).toContain('Created new business entity: Solaria Energy Labs');
    expect(latestAudit.businessId).toBe(newBiz.id);
  });

  it('updates business profile details without affecting other entities', () => {
    const { result } = renderHook(() => useBusiness(), { wrapper });

    act(() => {
      result.current.switchBusiness('biz_apex');
    });

    act(() => {
      result.current.updateBusiness('biz_apex', {
        monthlyRevenue: 850000,
        valuation: 28000000,
      });
    });

    const updatedApex = result.current.businesses.find((b) => b.id === 'biz_apex');
    expect(updatedApex?.monthlyRevenue).toBe(850000);
    expect(updatedApex?.valuation).toBe(28000000);

    // Verify other businesses remained untouched
    const nordic = result.current.businesses.find((b) => b.id === 'biz_nordic');
    expect(nordic?.name).toBe('Nordic Roasters & Goods');
  });

  it('enforces strict data isolation between multiple businesses', () => {
    const { result } = renderHook(() => useBusiness(), { wrapper });

    // Switch to Business A (Apex Cloud)
    act(() => {
      result.current.switchBusiness('biz_apex');
    });

    // Add invoice for Business A
    act(() => {
      result.current.addInvoice({
        businessId: 'biz_apex',
        clientId: 'client_1',
        clientName: 'Apex Prime Client',
        invoiceNumber: 'INV-APEX-ISOLATION-01',
        issueDate: '2025-05-01',
        dueDate: '2025-05-30',
        items: [
          {
            id: 'item_1',
            description: 'Dedicated Kubernetes Cluster',
            quantity: 1,
            unitPrice: 12000,
            total: 12000,
          },
        ],
        subtotal: 12000,
        tax: 1200,
        total: 13200,
        currency: 'USD',
        status: 'SENT',
      });
    });

    // Verify invoice appears in Business A
    expect(
      result.current.filteredInvoices.some((i) => i.invoiceNumber === 'INV-APEX-ISOLATION-01')
    ).toBe(true);

    // Switch to Business B (Nordic Roast)
    act(() => {
      result.current.switchBusiness('biz_nordic');
    });

    // Verify invoice for Business A does NOT leak into Business B
    expect(
      result.current.filteredInvoices.some((i) => i.invoiceNumber === 'INV-APEX-ISOLATION-01')
    ).toBe(false);

    // Switch to CONSOLIDATED view
    act(() => {
      result.current.switchBusiness('CONSOLIDATED');
    });

    // In CONSOLIDATED view, the invoice should be present
    expect(
      result.current.filteredInvoices.some((i) => i.invoiceNumber === 'INV-APEX-ISOLATION-01')
    ).toBe(true);
  });

  it('isolates expenses and inventory across multiple businesses', () => {
    const { result } = renderHook(() => useBusiness(), { wrapper });

    // Add expense to Kensington
    act(() => {
      result.current.addExpense({
        businessId: 'biz_kensington',
        title: 'Mayfair Townhouse Survey Fee',
        amount: 3500,
        category: 'CONSULTING',
        vendor: 'Chartered Surveyors UK',
        date: '2025-05-10',
        status: 'APPROVED',
        paidBy: 'Barclays Corporate',
        taxDeductible: true,
      });
    });

    // Switch to Apex
    act(() => {
      result.current.switchBusiness('biz_apex');
    });
    expect(
      result.current.filteredExpenses.some((e) => e.title === 'Mayfair Townhouse Survey Fee')
    ).toBe(false);

    // Switch to Kensington
    act(() => {
      result.current.switchBusiness('biz_kensington');
    });
    expect(
      result.current.filteredExpenses.some((e) => e.title === 'Mayfair Townhouse Survey Fee')
    ).toBe(true);

    // Inventory test: Nordic has coffee, Apex does not
    expect(result.current.filteredInventory.length).toBe(0); // Kensington has no coffee inventory
    act(() => {
      result.current.switchBusiness('biz_nordic');
    });
    expect(result.current.filteredInventory.length).toBeGreaterThan(0);
  });

  it('dynamically adapts currency symbol to active business context', () => {
    const { result } = renderHook(() => useBusiness(), { wrapper });

    // Apex -> USD
    act(() => {
      result.current.switchBusiness('biz_apex');
    });
    expect(result.current.formatCurrency(50000)).toMatch(/^\$50,000/);

    // Kensington -> GBP
    act(() => {
      result.current.switchBusiness('biz_kensington');
    });
    expect(result.current.formatCurrency(50000)).toMatch(/^£50,000/);

    // Nordic -> EUR
    act(() => {
      result.current.switchBusiness('biz_nordic');
    });
    expect(result.current.formatCurrency(50000)).toMatch(/^€50,000/);

    // Consolidated falls back to USD
    act(() => {
      result.current.switchBusiness('CONSOLIDATED');
    });
    expect(result.current.formatCurrency(50000)).toMatch(/^\$50,000/);
  });

  it('properly computes equity valuation across all portfolio businesses', () => {
    const { result } = renderHook(() => useBusiness(), { wrapper });

    const netWorth = result.current.calculateNetWorth();

    // Calculate expected business equity = sum(valuation * (ownerEquityPercentage / 100))
    const expectedEquity = result.current.businesses.reduce(
      (sum, b) => sum + (b.valuation * (b.ownerEquityPercentage || 100)) / 100,
      0
    );

    expect(netWorth.totalBusinessEquityValue).toBe(expectedEquity);
    expect(netWorth.totalAssets).toBe(
      netWorth.totalPersonalAssets + netWorth.totalBusinessEquityValue
    );
  });
});

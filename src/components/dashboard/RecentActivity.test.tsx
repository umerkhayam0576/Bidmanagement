import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { BusinessProvider, useBusiness } from '@/context/BusinessContext';
import { RecentActivity } from './RecentActivity';
import { OverviewDashboard } from '../modules/OverviewDashboard';
import { getChronologicalLogs } from '../modules/AuditLogsModule';
import { AuditLog } from '@/types';

const customMockLogs: AuditLog[] = [
  {
    id: 'test_log_1',
    businessId: 'biz_apex',
    businessName: 'Apex Cloud Technologies Inc.',
    user: 'Omar Refay',
    action: 'First old action',
    entity: 'Billing / Invoice',
    timestamp: '2025-01-01 10:00:00',
    ipAddress: '192.168.1.1'
  },
  {
    id: 'test_log_2',
    businessId: 'biz_nordic',
    businessName: 'Nordic Roasters & Goods',
    user: 'Astrid Lind',
    action: 'Second mid action',
    entity: 'Inventory',
    timestamp: '2025-02-01 12:00:00',
    ipAddress: '192.168.1.2'
  },
  {
    id: 'test_log_3',
    businessId: 'biz_apex',
    businessName: 'Apex Cloud Technologies Inc.',
    user: 'Elena Rostova',
    action: 'Third newest action',
    entity: 'Payroll / HR',
    timestamp: '2025-03-01 15:30:00',
    ipAddress: '192.168.1.3'
  }
];

describe('RecentActivity Component & Chronological Audit Logs', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders Recent Activity component with title and full audit trail button', () => {
    render(
      <BusinessProvider>
        <RecentActivity />
      </BusinessProvider>
    );

    const title = screen.getByText('Recent Activity');
    expect(title).toBeDefined();

    const auditTrailBtn = screen.getByTestId('view-full-audit-logs-btn');
    expect(auditTrailBtn).toBeDefined();
    expect(auditTrailBtn.textContent).toContain('Full Audit Trail');
  });

  it('pulls and displays chronological logs with newest events first', () => {
    render(
      <BusinessProvider>
        <RecentActivity limit={5} />
      </BusinessProvider>
    );

    const items = screen.getAllByTestId('recent-activity-item');
    expect(items.length).toBeGreaterThan(0);
    expect(items.length).toBeLessThanOrEqual(5);

    // Verify chronological order: first item should have later or equal timestamp than second
    const timestamps = items.map((item) => {
      const timeEl = item.querySelector('.font-mono');
      return timeEl?.textContent || '';
    });

    for (let i = 0; i < timestamps.length - 1; i++) {
      if (timestamps[i] && timestamps[i + 1]) {
        const timeA = new Date(timestamps[i].replace(' ', 'T')).getTime();
        const timeB = new Date(timestamps[i + 1].replace(' ', 'T')).getTime();
        if (!isNaN(timeA) && !isNaN(timeB)) {
          expect(timeA).toBeGreaterThanOrEqual(timeB);
        }
      }
    }
  });

  it('navigates to audit-logs tab when Full Audit Trail or View All is clicked', () => {
    const TestConsumer = () => {
      const { activeTab } = useBusiness();
      return (
        <div>
          <span data-testid="active-tab">{activeTab}</span>
          <RecentActivity />
        </div>
      );
    };

    render(
      <BusinessProvider>
        <TestConsumer />
      </BusinessProvider>
    );

    expect(screen.getByTestId('active-tab').textContent).toBe('overview');

    const auditTrailBtn = screen.getByTestId('view-full-audit-logs-btn');
    fireEvent.click(auditTrailBtn);

    expect(screen.getByTestId('active-tab').textContent).toBe('audit-logs');
  });

  it('is integrated and rendered within the OverviewDashboard', () => {
    render(
      <BusinessProvider>
        <OverviewDashboard />
      </BusinessProvider>
    );

    const recentActivityComponent = screen.getByTestId('recent-activity-component');
    expect(recentActivityComponent).toBeDefined();
    expect(screen.getByText('Recent Activity')).toBeDefined();
    expect(screen.getAllByTestId('recent-activity-item').length).toBeGreaterThan(0);
  });

  describe('getChronologicalLogs helper function', () => {
    it('sorts logs strictly in descending chronological order', () => {
      const sorted = getChronologicalLogs(customMockLogs);
      expect(sorted[0].id).toBe('test_log_3');
      expect(sorted[1].id).toBe('test_log_2');
      expect(sorted[2].id).toBe('test_log_1');
    });

    it('filters by active business ID when not in CONSOLIDATED mode', () => {
      const apexLogs = getChronologicalLogs(customMockLogs, {
        activeBusinessId: 'biz_apex'
      });
      expect(apexLogs.length).toBe(2);
      expect(apexLogs.every((l) => l.businessId === 'biz_apex')).toBe(true);

      const nordicLogs = getChronologicalLogs(customMockLogs, {
        activeBusinessId: 'biz_nordic'
      });
      expect(nordicLogs.length).toBe(1);
      expect(nordicLogs[0].id).toBe('test_log_2');
    });

    it('includes all businesses when activeBusinessId is CONSOLIDATED', () => {
      const consolidated = getChronologicalLogs(customMockLogs, {
        activeBusinessId: 'CONSOLIDATED'
      });
      expect(consolidated.length).toBe(3);
    });

    it('respects the limit option', () => {
      const limited = getChronologicalLogs(customMockLogs, { limit: 2 });
      expect(limited.length).toBe(2);
      expect(limited[0].id).toBe('test_log_3');
      expect(limited[1].id).toBe('test_log_2');
    });
  });
});

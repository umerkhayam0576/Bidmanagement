import React from 'react';
import {
  History,
  Shield,
  ChevronRight,
  ArrowUpRight,
  FileText,
  DollarSign,
  Users,
  Package,
  Landmark,
  Activity,
  Clock
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import { getChronologicalLogs } from '../modules/AuditLogsModule';
import { AuditLog } from '../../types';

export interface RecentActivityProps {
  limit?: number;
  className?: string;
  showHeader?: boolean;
}

/**
 * Returns an icon and theme colors based on the entity domain of an audit event.
 */
function getEntityVisuals(entity: string): {
  icon: React.ReactNode;
  badgeClass: string;
  iconBg: string;
} {
  const normalized = entity.toLowerCase();

  if (normalized.includes('billing') || normalized.includes('invoice') || normalized.includes('quotation')) {
    return {
      icon: <DollarSign className="w-3.5 h-3.5 text-emerald-400" />,
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      iconBg: 'bg-emerald-500/10 text-emerald-400'
    };
  }

  if (normalized.includes('payroll') || normalized.includes('hr') || normalized.includes('employee')) {
    return {
      icon: <Users className="w-3.5 h-3.5 text-cyan-400" />,
      badgeClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      iconBg: 'bg-cyan-500/10 text-cyan-400'
    };
  }

  if (normalized.includes('inventory') || normalized.includes('sku') || normalized.includes('stock')) {
    return {
      icon: <Package className="w-3.5 h-3.5 text-amber-400" />,
      badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      iconBg: 'bg-amber-500/10 text-amber-400'
    };
  }

  if (normalized.includes('personal') || normalized.includes('wealth') || normalized.includes('asset')) {
    return {
      icon: <Landmark className="w-3.5 h-3.5 text-purple-400" />,
      badgeClass: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      iconBg: 'bg-purple-500/10 text-purple-400'
    };
  }

  if (normalized.includes('vault') || normalized.includes('doc') || normalized.includes('legal')) {
    return {
      icon: <FileText className="w-3.5 h-3.5 text-blue-400" />,
      badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      iconBg: 'bg-blue-500/10 text-blue-400'
    };
  }

  if (normalized.includes('security') || normalized.includes('auth') || normalized.includes('role')) {
    return {
      icon: <Shield className="w-3.5 h-3.5 text-emerald-400" />,
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      iconBg: 'bg-emerald-500/10 text-emerald-400'
    };
  }

  return {
    icon: <Activity className="w-3.5 h-3.5 text-slate-400" />,
    badgeClass: 'bg-slate-800 text-slate-300 border-slate-700',
    iconBg: 'bg-slate-800 text-slate-400'
  };
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  limit = 5,
  className = '',
  showHeader = true
}) => {
  const { auditLogs, activeBusinessId, activeBusiness, setActiveTab } = useBusiness();

  // Pull chronologically ordered logs scoped to current business context
  const recentLogs: AuditLog[] = getChronologicalLogs(auditLogs, {
    activeBusinessId,
    limit
  });

  const isConsolidated = activeBusinessId === 'CONSOLIDATED';

  return (
    <div
      id="recent-activity-card"
      data-testid="recent-activity-component"
      className={`bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 ${className}`}
    >
      {showHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0">
              <History className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="recent-activity-title"
                  className="text-sm font-bold text-white uppercase tracking-wider"
                >
                  Recent Activity
                </h2>
                <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                  {isConsolidated ? 'All Holdings' : activeBusiness?.name || 'Current Entity'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Chronological ledger events & operational updates from the audit log
              </p>
            </div>
          </div>

          <button
            id="btn-view-audit-trail"
            data-testid="view-full-audit-logs-btn"
            onClick={() => setActiveTab('audit-logs')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 shrink-0 self-start sm:self-auto py-1"
          >
            <span>Full Audit Trail</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Activity List */}
      {recentLogs.length === 0 ? (
        <div
          id="recent-activity-empty"
          data-testid="recent-activity-empty"
          className="text-center py-8 px-4 bg-slate-800/30 rounded-xl border border-slate-800/80"
        >
          <Clock className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-60" />
          <p className="text-xs font-semibold text-slate-300">No Recent Activity Recorded</p>
          <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
            Audit logs for actions, updates, or transactions in this business will appear here chronologically.
          </p>
        </div>
      ) : (
        <div
          id="recent-activity-list"
          data-testid="recent-activity-list"
          className="space-y-2.5"
        >
          {recentLogs.map((log, index) => {
            const visuals = getEntityVisuals(log.entity);
            return (
              <div
                key={log.id || `act-${index}`}
                id={`recent-activity-item-${log.id}`}
                data-testid="recent-activity-item"
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-800/40 hover:bg-slate-800/70 border border-slate-800 hover:border-slate-700/80 transition-all"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-slate-700/50 mt-0.5 ${visuals.iconBg}`}
                  >
                    {visuals.icon}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <p className="text-xs font-medium text-slate-200 group-hover:text-white transition-colors leading-relaxed">
                      {log.action}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                      <span className="font-semibold text-slate-300">
                        {log.user}
                      </span>
                      <span>•</span>
                      <span
                        className={`font-mono text-[10px] px-1.5 py-0.2 rounded border ${visuals.badgeClass}`}
                      >
                        {log.entity}
                      </span>
                      {isConsolidated && log.businessName && (
                        <>
                          <span>•</span>
                          <span className="text-slate-400 text-[10px]">
                            {log.businessName}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col sm:items-end justify-between sm:justify-center shrink-0 text-right font-mono text-[11px] text-slate-400 border-t sm:border-t-0 border-slate-800/60 pt-2 sm:pt-0">
                  <span className="text-slate-300">{log.timestamp}</span>
                  <span className="text-[10px] text-slate-400">{log.ipAddress}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer quick link */}
      <div className="pt-1 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/60">
        <span className="flex items-center gap-1.5 text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Live SOC 2 Audit Ledger</span>
        </span>
        <button
          onClick={() => setActiveTab('audit-logs')}
          className="text-[11px] font-semibold text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-1"
        >
          <span>View All in AuditLogsModule</span>
          <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

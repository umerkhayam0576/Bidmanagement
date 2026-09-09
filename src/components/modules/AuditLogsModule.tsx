import React, { useState } from 'react';
import {
  History,
  Shield,
  Search,
  Filter,
  CheckCircle2,
  Lock,
  Download,
  AlertCircle
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import { AuditLog } from '../../types';

export interface ChronologicalLogOptions {
  activeBusinessId?: string | 'CONSOLIDATED';
  limit?: number;
  entity?: string;
  search?: string;
}

/**
 * Filters and sorts audit logs in strict reverse chronological order (newest first).
 */
export function getChronologicalLogs(
  logs: AuditLog[],
  options?: ChronologicalLogOptions
): AuditLog[] {
  const activeBusinessId = options?.activeBusinessId;
  const entity = options?.entity;
  const search = options?.search?.toLowerCase();
  const limit = options?.limit;

  const filtered = logs.filter((log) => {
    // If a specific business is active, filter logs for that business or general/personal logs
    if (
      activeBusinessId &&
      activeBusinessId !== 'CONSOLIDATED' &&
      log.businessId &&
      log.businessId !== activeBusinessId
    ) {
      return false;
    }
    if (entity && entity !== 'ALL' && log.entity !== entity) {
      return false;
    }
    if (search) {
      const action = (log.action || '').toLowerCase();
      const user = (log.user || '').toLowerCase();
      const ip = log.ipAddress || '';
      const matchesSearch = action.includes(search) || user.includes(search) || ip.includes(search);
      if (!matchesSearch) return false;
    }
    return true;
  });

  // Sort descending by timestamp (newest first)
  const sorted = [...filtered].sort((a, b) => {
    const timeA = new Date(a.timestamp.replace(' ', 'T')).getTime();
    const timeB = new Date(b.timestamp.replace(' ', 'T')).getTime();
    if (isNaN(timeA) || isNaN(timeB)) {
      return b.timestamp.localeCompare(a.timestamp);
    }
    return timeB - timeA;
  });

  return typeof limit === 'number' ? sorted.slice(0, limit) : sorted;
}

export const AuditLogsModule: React.FC = () => {
  const { auditLogs, businesses, activeBusinessId, activeBusiness } = useBusiness();
  const [search, setSearch] = useState('');
  const [selectedEntity, setSelectedEntity] = useState('ALL');

  const entities = Array.from(new Set(auditLogs.map((log) => log.entity)));

  const filtered = getChronologicalLogs(auditLogs, {
    activeBusinessId,
    entity: selectedEntity,
    search
  });

  const exportAuditLogCsv = () => {
    const headers = ['Timestamp', 'User', 'Action', 'Entity', 'Business', 'IP Address'];
    const rows = filtered.map((l) => [
      l.timestamp,
      `"${l.user}"`,
      `"${l.action.replace(/"/g, '""')}"`,
      `"${l.entity}"`,
      `"${l.businessName || 'General'}"`,
      l.ipAddress
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `audit_trail_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 lg:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase font-extrabold tracking-widest text-emerald-400">
            <Shield className="w-4 h-4" />
            <span>Cryptographic & SOC 2 Governance</span>
          </div>
          <h1 className="text-xl font-extrabold text-white mt-1">Audit Trail & Security Logs</h1>
          <p className="text-xs text-slate-400 mt-1">
            Immutable log of system modifications, financial records, permissions changes, and user activities.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportAuditLogCsv}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold transition-all"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export CSV Trail</span>
          </button>
        </div>
      </div>

      {/* Filter and Table Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter by action, user, or IP..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <select
              value={selectedEntity}
              onChange={(e) => setSelectedEntity(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Categories ({auditLogs.length})</option>
              {entities.map((ent) => (
                <option key={ent} value={ent}>
                  {ent}
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{filtered.length} Recorded Events</span>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3">User</th>
                <th className="py-3 px-3">Entity Area</th>
                <th className="py-3 px-3">Action Details</th>
                <th className="py-3 px-3">Entity Scope</th>
                <th className="py-3 px-3 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filtered.map((log) => {
                return (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-white">{log.user}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="bg-slate-800 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-mono border border-slate-700">
                        {log.entity}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-200">
                      {log.action}
                    </td>
                    <td className="py-3 px-3 text-slate-400 text-[11px]">
                      {log.businessName || 'Multi-Business / Master'}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-[11px] text-slate-400">
                      {log.ipAddress}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export { RecentActivity } from '../dashboard/RecentActivity';

import React, { useState } from 'react';
import { BusinessProvider, useBusiness } from './context/BusinessContext';
import { NavigationTab } from './types';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { AiAdvisorModal } from './components/common/AiAdvisorModal';
import { QuickAddModal } from './components/common/QuickAddModal';

// Modules
import { OverviewDashboard } from './components/modules/OverviewDashboard';
import { EmployeePortalDashboard } from './components/dashboard/EmployeePortalDashboard';
import { ClientPortalDashboard } from './components/dashboard/ClientPortalDashboard';
import { HrPortalDashboard } from './components/dashboard/HrPortalDashboard';
import { EmployeeRestrictedView } from './components/common/EmployeeRestrictedView';
import { PersonalFinanceModule } from './components/modules/PersonalFinanceModule';
import { PartnersModule } from './components/modules/PartnersModule';
import { CrmModule } from './components/modules/CrmModule';
import { ClientsModule } from './components/modules/ClientsModule';
import { BillingModule } from './components/modules/BillingModule';
import { ProjectsModule } from './components/modules/ProjectsModule';
import { HrPayrollModule } from './components/modules/HrPayrollModule';
import { FinanceModule } from './components/modules/FinanceModule';
import { InventoryModule } from './components/modules/InventoryModule';
import { ReportsModule } from './components/modules/ReportsModule';
import { DocumentsModule } from './components/modules/DocumentsModule';
import { MessagesModule } from './components/modules/MessagesModule';
import { AuditLogsModule } from './components/modules/AuditLogsModule';
import { SettingsModule } from './components/modules/SettingsModule';
import { BidBoardModule } from './components/modules/BidBoardModule';
import { RfisModule } from './components/modules/RfisModule';
import { DeliverablesModule } from './components/modules/DeliverablesModule';
import { ResponsesModule } from './components/modules/ResponsesModule';
import { PricingHubModule } from './components/modules/PricingHubModule';
import { AttendanceModule } from './components/modules/AttendanceModule';

const MODULE_NAMES: Record<NavigationTab, string> = {
  'overview': 'Personal Dashboard',
  'personal-wealth': 'Personal Wealth Command',
  'partners': 'Partners & Cap Table',
  'crm': 'Sales Pipeline & CRM',
  'clients': 'Clients Directory',
  'billing': 'Quotations & Invoices',
  'projects': 'Projects & Tasks',
  'hr-payroll': 'HR & Staff Payroll',
  'finance': 'Finance & Expenses',
  'inventory': 'Inventory & Logistics',
  'reports': 'Executive Reports & P&L',
  'documents': 'Document Vault',
  'messages': 'Team Communications',
  'audit-logs': 'Compliance Audit Trail',
  'settings': 'Settings & RBAC Governance',
  'bid-board': 'Bid Board & Estimating',
  'rfis': 'Requests for Information (RFIs)',
  'deliverables': 'Deliverables & Submittals',
  'responses': 'Consultant & Client Responses',
  'pricing-hub': 'Pricing Hub (Materials & Labor)',
  'attendance': 'Leaves & Attendance'
};

const MainContent: React.FC = () => {
  const { activeTab, isEmployee, hasTabPermission, currentUser } = useBusiness();
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  const renderActiveModule = () => {
    // If signed in as an employee, verify dynamic module permission
    if (isEmployee) {
      const isAllowed = hasTabPermission(activeTab);

      if (!isAllowed) {
        const moduleLabel = MODULE_NAMES[activeTab] || activeTab;
        return (
          <EmployeeRestrictedView
            moduleName={moduleLabel}
            description={`Access to the ${moduleLabel} module is currently disabled for your role (${currentUser.title || currentUser.department || 'Employee'}). An administrator can enable access in Settings > Permissions Manager.`}
          />
        );
      }

      switch (activeTab) {
        case 'overview':
          return <EmployeePortalDashboard />;
        case 'bid-board':
          return <BidBoardModule />;
        case 'rfis':
          return <RfisModule />;
        case 'deliverables':
          return <DeliverablesModule />;
        case 'responses':
          return <ResponsesModule />;
        case 'pricing-hub':
          return <PricingHubModule />;
        case 'attendance':
          return <AttendanceModule />;
        case 'projects':
          return <ProjectsModule />;
        case 'hr-payroll':
          return <HrPayrollModule />;
        case 'finance':
          return <FinanceModule />;
        case 'crm':
          return <CrmModule />;
        case 'billing':
          return <BillingModule />;
        case 'inventory':
          return <InventoryModule />;
        case 'clients':
          return <ClientsModule />;
        case 'documents':
          return <DocumentsModule />;
        case 'messages':
          return <MessagesModule />;
        case 'reports':
          return <ReportsModule />;
        case 'audit-logs':
          return <AuditLogsModule />;
        case 'partners':
          return <PartnersModule />;
        case 'personal-wealth':
          return <PersonalFinanceModule />;
        case 'settings':
          return <SettingsModule />;
        default:
          return <EmployeePortalDashboard />;
      }
    }

    switch (activeTab) {
      case 'overview':
        return <OverviewDashboard />;
      case 'bid-board':
        return <BidBoardModule />;
      case 'rfis':
        return <RfisModule />;
      case 'deliverables':
        return <DeliverablesModule />;
      case 'responses':
        return <ResponsesModule />;
      case 'pricing-hub':
        return <PricingHubModule />;
      case 'attendance':
        return <AttendanceModule />;
      case 'personal-wealth':
        return <PersonalFinanceModule />;
      case 'partners':
        return <PartnersModule />;
      case 'crm':
        return <CrmModule />;
      case 'clients':
        return <ClientsModule />;
      case 'billing':
        return <BillingModule />;
      case 'projects':
        return <ProjectsModule />;
      case 'hr-payroll':
        return <HrPayrollModule />;
      case 'finance':
        return <FinanceModule />;
      case 'inventory':
        return <InventoryModule />;
      case 'reports':
        return <ReportsModule />;
      case 'documents':
        return <DocumentsModule />;
      case 'messages':
        return <MessagesModule />;
      case 'audit-logs':
        return <AuditLogsModule />;
      case 'settings':
        return <SettingsModule />;
      default:
        return <OverviewDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-emerald-500 selection:text-slate-950">
      <Header onOpenQuickAdd={() => setQuickAddOpen(true)} />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950/60">
          <div className="max-w-7xl mx-auto pb-12">
            {renderActiveModule()}
          </div>
        </main>
      </div>

      <AiAdvisorModal />
      <QuickAddModal isOpen={quickAddOpen} onClose={() => setQuickAddOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <BusinessProvider>
      <MainContent />
    </BusinessProvider>
  );
}

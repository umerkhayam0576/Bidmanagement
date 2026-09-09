import React, { useState } from 'react';
import { BusinessProvider, useBusiness } from './context/BusinessContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { AiAdvisorModal } from './components/common/AiAdvisorModal';
import { QuickAddModal } from './components/common/QuickAddModal';

// Modules
import { OverviewDashboard } from './components/modules/OverviewDashboard';
import { EmployeePortalDashboard } from './components/dashboard/EmployeePortalDashboard';
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

const MainContent: React.FC = () => {
  const { activeTab, isEmployee } = useBusiness();
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  const renderActiveModule = () => {
    // If signed in as an employee, customize routing and enforce permission boundaries
    if (isEmployee) {
      switch (activeTab) {
        case 'overview':
          return <EmployeePortalDashboard />;
        case 'projects':
          return <ProjectsModule />;
        case 'hr-payroll':
          return <HrPayrollModule />;
        case 'finance':
          return <FinanceModule />;
        case 'clients':
          return <ClientsModule />;
        case 'documents':
          return <DocumentsModule />;
        case 'messages':
          return <MessagesModule />;
        case 'personal-wealth':
          return <EmployeeRestrictedView moduleName="Personal Wealth Command" />;
        case 'partners':
          return <EmployeeRestrictedView moduleName="Partners & Cap Table" />;
        case 'crm':
          return <EmployeeRestrictedView moduleName="Sales Pipeline & Lead CRM" />;
        case 'billing':
          return <EmployeeRestrictedView moduleName="Invoicing & Quotations" />;
        case 'inventory':
          return <EmployeeRestrictedView moduleName="Inventory & Supply Operations" />;
        case 'reports':
          return <EmployeeRestrictedView moduleName="Executive Reports & P&L" />;
        case 'audit-logs':
          return <EmployeeRestrictedView moduleName="Compliance Audit Trail" />;
        case 'settings':
          return <EmployeeRestrictedView moduleName="Settings & RBAC Governance" />;
        default:
          return <EmployeePortalDashboard />;
      }
    }

    switch (activeTab) {
      case 'overview':
        return <OverviewDashboard />;
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

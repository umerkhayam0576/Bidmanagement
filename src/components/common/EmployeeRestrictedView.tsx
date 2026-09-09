import React from 'react';
import { ShieldAlert, ArrowLeft, UserCheck, Lock } from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';

interface EmployeeRestrictedViewProps {
  moduleName: string;
  description?: string;
}

export const EmployeeRestrictedView: React.FC<EmployeeRestrictedViewProps> = ({
  moduleName,
  description
}) => {
  const { currentUser, setActiveTab, userProfiles, switchUser } = useBusiness();

  // Find owner/executive profile if user wants to switch back
  const executiveProfile = userProfiles.find(
    (u) => u.globalRole === 'SUPER_OWNER' || u.globalRole === 'EXECUTIVE'
  );

  return (
    <div
      id="employee-restricted-container"
      className="max-w-2xl mx-auto my-12 p-8 bg-card border border-border rounded-2xl shadow-xs text-center space-y-6"
    >
      <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
        <Lock className="w-7 h-7" />
      </div>

      <div className="space-y-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 border border-amber-500/20">
          <ShieldAlert className="w-3.5 h-3.5" />
          Executive Ownership Area
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          {moduleName} is Restricted
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description ||
            `You are currently signed in as an employee (${currentUser.name} • ${currentUser.title}). This area contains executive-level ownership records, cap table allocations, or consolidated treasury metrics.`}
        </p>
      </div>

      <div className="p-4 rounded-xl bg-muted/40 border border-border text-xs text-muted-foreground text-left flex items-start gap-3">
        <UserCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-foreground block mb-0.5">
            Your Employee Interface
          </span>
          As an employee, your workspace provides your personalized tasks, project assignments, leave requests, expense claims, pay stubs, and team documents.
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          id="restricted-return-dashboard-btn"
          onClick={() => setActiveTab('overview')}
          className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to My Employee Dashboard
        </button>

        {executiveProfile && (
          <button
            id="restricted-switch-exec-btn"
            onClick={() => switchUser(executiveProfile.id)}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xl border border-border transition-colors flex items-center justify-center gap-2"
          >
            Switch to Executive View ({executiveProfile.name})
          </button>
        )}
      </div>
    </div>
  );
};

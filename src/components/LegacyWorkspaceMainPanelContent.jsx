import LegacyDashboardTab from './LegacyDashboardTab';
import LegacyVaultTab from './LegacyVaultTab';
import WorkspaceTabs from './WorkspaceTabs';

export default function LegacyWorkspaceMainPanelContent({
  activeTab,
  dashboardTabProps,
  vaultTabProps,
  workspaceTabsProps,
}) {
  return (
    <div className="flex flex-col h-full space-y-4 min-w-0">
      <WorkspaceTabs {...workspaceTabsProps} />

      {activeTab === 'dashboard' ? (
        <LegacyDashboardTab {...dashboardTabProps} />
      ) : (
        <LegacyVaultTab {...vaultTabProps} />
      )}
    </div>
  );
}

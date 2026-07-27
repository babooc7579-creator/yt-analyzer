import LegacyDashboardTab from './LegacyDashboardTab';
import LegacyVaultTab from './LegacyVaultTab';
import WorkspaceTabs from './WorkspaceTabs';

export default function LegacyWorkspaceMainPanelContent({
  activeTab,
  dashboardTabProps,
  operationStage,
  vaultTabProps,
  workspaceTabsProps,
}) {
  return (
    <div className="flex flex-col h-full space-y-4 min-w-0">
      {operationStage === 'scan' ? (
        <div className="border border-emerald-200 bg-emerald-50 px-4 py-3 text-slate-900">
          <p className="text-[10px] font-black text-emerald-700">영상 작업 구역</p>
          <h2 className="mt-1 text-lg font-extrabold">수집 영상 확인 후, 필요할 때만 새로 수집하세요</h2>
          <p className="mt-1 text-xs leading-5 text-slate-600">
            수집 영상 목록 불러오기는 온라인 저장소(Azure DB) 조회입니다. 초록색 새 영상 수집 버튼만 YouTube API를 사용할 수 있습니다.
          </p>
        </div>
      ) : null}

      <WorkspaceTabs {...workspaceTabsProps} />

      {activeTab === 'dashboard' ? (
        <LegacyDashboardTab {...dashboardTabProps} />
      ) : (
        <LegacyVaultTab {...vaultTabProps} />
      )}
    </div>
  );
}

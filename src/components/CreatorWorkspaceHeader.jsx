function StatCard({ value, label, description }) {
  return (
    <div
      className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-center"
      title={description}
      role="group"
      aria-label={`${label}: ${value}. ${description}`}
    >
      <p className="text-xl font-extrabold text-white">{value}</p>
      <p className="text-[10px] font-semibold text-slate-500">{label}</p>
    </div>
  );
}

export default function CreatorWorkspaceHeader({
  item,
  channelCount,
  discoveryCandidateCount,
  videoCount,
  selectedChannelCount,
  savedVideoCount,
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl shadow-slate-950/30">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-bold text-indigo-300">{item?.sectionTitle}</p>
          <h2 className="mt-1 text-2xl font-extrabold text-white">{item?.label}</h2>
          <p className="mt-1 text-sm text-slate-400">{item?.summary}</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          <StatCard value={channelCount} label="채널" description="Cloud 채널 목록에 저장된 채널 수입니다." />
          <StatCard value={videoCount} label="불러온 영상" description="현재 화면에 불러온 저장 영상 수입니다. 새 YouTube API 호출 수가 아닙니다." />
          <StatCard value={selectedChannelCount} label="선택 채널" description="저장 영상 조회나 새 영상 수집 대상으로 체크한 채널 수입니다." />
          <StatCard value={savedVideoCount} label="스크랩 영상" description="Cloud 스크랩북에 보관 중인 영상 수입니다." />
          <StatCard value={discoveryCandidateCount} label="링크 후보" description="Cloud 발견함에서 제작 후보로 표시한 링크 수입니다." />
        </div>
      </div>
    </div>
  );
}

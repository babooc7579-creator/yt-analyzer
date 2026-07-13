const SUMMARY_ITEMS = [
  ['scheduledCount', '전체 일정'],
  ['monthCount', '이번 달'],
  ['todayCount', '오늘 예정'],
  ['upcomingCount', '다가올 일정'],
  ['overdueCount', '지난 미완료'],
  ['unscheduledCount', '날짜 미정'],
];

export default function UploadCalendarSummary({ summary }) {
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
      {SUMMARY_ITEMS.map(([key, label]) => (
        <div key={key} className="border border-slate-800 bg-slate-950/60 px-3 py-3">
          <p className="text-[10px] font-extrabold text-slate-500">{label}</p>
          <p className={`mt-1 text-lg font-black ${key === 'overdueCount' && Number(summary?.[key]) > 0 ? 'text-rose-300' : 'text-white'}`}>{Number(summary?.[key] || 0).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

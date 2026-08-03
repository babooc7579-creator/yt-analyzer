import { Layers3 } from 'lucide-react';

const toArray = (items) => (Array.isArray(items) ? items : []);

export default function SimilarTopicSummary({ groups }) {
  const groupList = toArray(groups);
  if (groupList.length === 0) return null;

  const groupedVideoCount = groupList.reduce((sum, group) => sum + Number(group.count || 0), 0);

  return (
    <aside className="rounded-xl border border-cyan-400/20 bg-cyan-500/10 p-4" aria-label="비슷한 주제 묶음">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-extrabold text-cyan-100">
            <Layers3 className="h-4 w-4" /> 비슷한 주제 {groupList.length}묶음
          </h3>
          <p className="mt-1 text-xs leading-5 text-cyan-100/70">
            제목 핵심어가 겹치는 영상 {groupedVideoCount}개를 화면에서만 묶었습니다. AI·YouTube API·저장은 사용하지 않습니다.
          </p>
        </div>
        <span className="rounded-full border border-cyan-300/20 bg-slate-950/40 px-2.5 py-1 text-[10px] font-extrabold text-cyan-100">
          참고용 자동 묶음
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {groupList.map((group) => (
          <span
            key={group.id}
            className="rounded-full border border-cyan-300/20 bg-slate-950/50 px-3 py-1.5 text-[11px] font-bold text-slate-200"
            title="제목 핵심어가 비슷한 항목 수입니다. 원본 영상이나 저장 데이터는 합치지 않습니다."
          >
            {group.label} · {group.count}개
          </span>
        ))}
      </div>
    </aside>
  );
}

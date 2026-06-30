import { Bookmark, Play, Sparkles } from 'lucide-react';

function SummaryCard({ label, value, tone = 'slate' }) {
  const tones = {
    slate: 'border-slate-300 bg-white/80 text-slate-400',
    yellow: 'border-yellow-200 bg-yellow-50 text-yellow-600',
    indigo: 'border-indigo-200 bg-indigo-50 text-indigo-600',
    rose: 'border-rose-200 bg-rose-50 text-rose-600',
  };

  return (
    <div className={`rounded-xl border px-4 py-3 ${tones[tone]}`}>
      <p className="text-[10px] font-bold">{label}</p>
      <p className="mt-1 text-xl font-extrabold text-slate-900">{value}</p>
    </div>
  );
}

export default function ReferenceVaultSummary({
  videoCount,
  channelCount,
  scrapCount,
  visibleScrapCount,
  ttoTtoCount,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-300 bg-gradient-to-br from-slate-100 to-slate-200 shadow-sm">
      <div className="flex flex-col gap-5 p-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-extrabold text-indigo-700">Reference Vault</p>
          <h3 className="mt-1 text-2xl font-extrabold text-slate-950">레퍼런스 금고</h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
            저장된 영상과 스크랩 소재를 한 곳에서 훑고, 제작에 활용할 후보를 고르는 작업 캔버스입니다.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
          <SummaryCard label="불러온 영상" value={videoCount} />
          <SummaryCard label="저장 채널" value={channelCount} />
          <SummaryCard label="스크랩 소재" value={scrapCount} tone="yellow" />
          <SummaryCard label="현재 보드 스크랩" value={visibleScrapCount} tone="indigo" />
          <SummaryCard label="또터또 후보" value={ttoTtoCount} tone="rose" />
        </div>
      </div>

      <div className="border-t border-slate-300/70 bg-white/60 px-5 py-4">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <div className="rounded-xl border border-blue-100 bg-blue-50/80 p-4">
            <div className="flex items-center gap-2">
              <Play className="h-4 w-4 text-blue-700" />
              <p className="text-sm font-extrabold text-blue-900">1. 저장된 영상 보기</p>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              이미 DB에 저장된 영상만 불러와서 봅니다. 새 YouTube API 호출은 없습니다.
            </p>
          </div>
          <div className="rounded-xl border border-yellow-100 bg-yellow-50/80 p-4">
            <div className="flex items-center gap-2">
              <Bookmark className="h-4 w-4 text-yellow-700" />
              <p className="text-sm font-extrabold text-yellow-900">2. 소재 보관</p>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              나중에 다시 볼 영상은 소재 보관에 넣습니다. 보관한 영상은 스크랩북에서 모아볼 수 있습니다.
            </p>
          </div>
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/80 p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-700" />
              <p className="text-sm font-extrabold text-indigo-900">3. 제작 후보로 보내기</p>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              만들 만한 소재는 제작 후보로 보내면 제작 칸반에서 이어서 관리합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

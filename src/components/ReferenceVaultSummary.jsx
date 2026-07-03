import { Bookmark, Play, Sparkles } from 'lucide-react';

import ReferenceVaultGuideCard from './ReferenceVaultGuideCard';
import ReferenceVaultSummaryCard from './ReferenceVaultSummaryCard';

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
          <ReferenceVaultSummaryCard label="불러온 영상" value={videoCount} />
          <ReferenceVaultSummaryCard label="저장 채널" value={channelCount} />
          <ReferenceVaultSummaryCard label="스크랩 소재" value={scrapCount} tone="yellow" />
          <ReferenceVaultSummaryCard label="현재 보드 스크랩" value={visibleScrapCount} tone="indigo" />
          <ReferenceVaultSummaryCard label="또터또 후보" value={ttoTtoCount} tone="rose" />
        </div>
      </div>

      <div className="border-t border-slate-300/70 bg-white/60 px-5 py-4">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <ReferenceVaultGuideCard
            title="1. 저장된 영상 보기"
            description="이미 DB에 저장된 영상만 불러와서 봅니다. 새 YouTube API 호출은 없습니다."
            icon={Play}
            className="border-blue-100 bg-blue-50/80"
            iconClassName="text-blue-700"
            titleClassName="text-blue-900"
          />
          <ReferenceVaultGuideCard
            title="2. 소재 보관"
            description="나중에 다시 볼 영상은 소재 보관에 넣습니다. 보관한 영상은 스크랩북에서 모아볼 수 있습니다."
            icon={Bookmark}
            className="border-yellow-100 bg-yellow-50/80"
            iconClassName="text-yellow-700"
            titleClassName="text-yellow-900"
          />
          <ReferenceVaultGuideCard
            title="3. 제작 후보로 보내기"
            description="만들 만한 소재는 제작 후보로 보내면 제작 칸반에서 이어서 관리합니다."
            icon={Sparkles}
            className="border-indigo-100 bg-indigo-50/80"
            iconClassName="text-indigo-700"
            titleClassName="text-indigo-900"
          />
        </div>
      </div>
    </div>
  );
}

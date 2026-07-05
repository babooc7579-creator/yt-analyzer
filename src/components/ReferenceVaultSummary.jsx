import { Bookmark, Play, Sparkles } from 'lucide-react';

import {
  REFERENCE_VAULT_GUIDE_CARDS,
  REFERENCE_VAULT_SUMMARY_CARDS,
} from '../constants/referenceVault';
import ReferenceVaultGuideCard from './ReferenceVaultGuideCard';
import ReferenceVaultSummaryCard from './ReferenceVaultSummaryCard';

const REFERENCE_VAULT_GUIDE_ICONS = {
  bookmark: Bookmark,
  play: Play,
  sparkles: Sparkles,
};

export default function ReferenceVaultSummary({
  videoCount,
  channelCount,
  scrapCount,
  visibleScrapCount,
  ttoTtoCount,
}) {
  const summaryValues = {
    videoCount,
    channelCount,
    scrapCount,
    visibleScrapCount,
    ttoTtoCount,
  };

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
          {REFERENCE_VAULT_SUMMARY_CARDS.map(({ key, label, tone }) => (
            <ReferenceVaultSummaryCard
              key={key}
              label={label}
              value={summaryValues[key]}
              tone={tone}
            />
          ))}
        </div>
      </div>

      <div className="border-t border-slate-300/70 bg-white/60 px-5 py-4">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {REFERENCE_VAULT_GUIDE_CARDS.map(({ key, iconName, ...guideCard }) => (
            <ReferenceVaultGuideCard
              key={key}
              icon={REFERENCE_VAULT_GUIDE_ICONS[iconName]}
              {...guideCard}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

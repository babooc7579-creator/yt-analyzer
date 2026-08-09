import { Bookmark, Play, Sparkles } from 'lucide-react';

import {
  REFERENCE_VAULT_GUIDE_CARDS,
  REFERENCE_VAULT_HEADER,
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
  selectedChannelCount = 0,
  selectedChannelTitles = [],
  visibleScrapCount,
  ttoTtoCount,
}) {
  const safeSelectedChannelCount = Number.isFinite(Number(selectedChannelCount))
    ? Math.max(0, Number(selectedChannelCount))
    : 0;
  const normalizedSelectedChannelTitles = Array.isArray(selectedChannelTitles)
    ? [...new Set(selectedChannelTitles
      .filter(title => typeof title === 'string' && title.trim())
      .map(title => title.trim()))]
    : [];
  const visibleSelectedChannelTitles = normalizedSelectedChannelTitles.slice(0, 5);
  const hiddenSelectedChannelCount = Math.max(
    0,
    safeSelectedChannelCount - visibleSelectedChannelTitles.length,
    normalizedSelectedChannelTitles.length - visibleSelectedChannelTitles.length,
  );
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
          <p className="text-xs font-extrabold text-indigo-700">{REFERENCE_VAULT_HEADER.eyebrow}</p>
          <h3 className="mt-1 text-2xl font-extrabold text-slate-950">{REFERENCE_VAULT_HEADER.title}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
            {REFERENCE_VAULT_HEADER.description}
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

      <div className="border-t border-slate-300/70 bg-indigo-50/70 px-5 py-3" role="region" aria-label="현재 수집 영상 조회 대상 채널">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-black text-indigo-700">현재 조회 대상 · 선택 채널 {safeSelectedChannelCount}개</p>
            <p className="mt-0.5 text-xs text-slate-600">
              {safeSelectedChannelCount > 0
                ? '선택한 채널 범위의 수집 영상 정보를 Azure DB에서 조회합니다.'
                : '오늘 볼 채널을 선택하면 어떤 채널의 영상인지 여기에 표시됩니다.'}
            </p>
          </div>
          {visibleSelectedChannelTitles.length > 0 ? (
            <div className="flex flex-wrap gap-1.5" aria-label="선택한 채널 이름">
              {visibleSelectedChannelTitles.map(title => (
                <span key={title} className="rounded-full border border-indigo-200 bg-white px-2.5 py-1 text-[11px] font-extrabold text-indigo-800">
                  {title}
                </span>
              ))}
              {hiddenSelectedChannelCount > 0 ? (
                <span className="rounded-full border border-slate-300 bg-slate-100 px-2.5 py-1 text-[11px] font-extrabold text-slate-700">
                  외 {hiddenSelectedChannelCount}개
                </span>
              ) : null}
            </div>
          ) : null}
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

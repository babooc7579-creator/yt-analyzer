import { Bookmark, ListChecks, Play, Sparkles } from 'lucide-react';

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
  onChangeSelectedChannels,
  selectedChannelCount = 0,
  selectedChannelScopes = [],
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
  const normalizedSelectedChannelScopes = Array.isArray(selectedChannelScopes)
    ? selectedChannelScopes
      .filter(scope => scope && typeof scope.title === 'string' && scope.title.trim())
      .map(scope => ({
        id: scope.id || scope.title.trim(),
        title: scope.title.trim(),
        videoCount: Number.isFinite(Number(scope.videoCount)) ? Math.max(0, Number(scope.videoCount)) : null,
      }))
    : [];
  const selectedChannelScopeList = normalizedSelectedChannelScopes.length > 0
    ? normalizedSelectedChannelScopes
    : normalizedSelectedChannelTitles.map(title => ({ id: title, title, videoCount: null }));
  const visibleSelectedChannelScopes = selectedChannelScopeList.slice(0, 5);
  const hiddenSelectedChannelCount = Math.max(
    0,
    safeSelectedChannelCount - visibleSelectedChannelScopes.length,
    selectedChannelScopeList.length - visibleSelectedChannelScopes.length,
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
      <div className="flex flex-col gap-5 p-4 sm:p-5 xl:flex-row xl:items-end xl:justify-between">
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

      <div className="border-t border-slate-300/70 bg-indigo-50/70 px-4 py-3 sm:px-5" role="region" aria-label="현재 수집 영상 조회 대상 채널">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-black text-indigo-700">현재 조회 대상 · 선택 채널 {safeSelectedChannelCount}개</p>
            <p className="mt-0.5 text-xs text-slate-600">
              {safeSelectedChannelCount > 0
                ? '선택한 채널 범위의 수집 영상 정보를 Azure DB에서 조회합니다.'
                : '오늘 볼 채널을 선택하면 어떤 채널의 영상인지 여기에 표시됩니다.'}
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 lg:w-auto lg:items-end">
            {visibleSelectedChannelScopes.length > 0 ? (
              <div className="flex flex-wrap gap-1.5" aria-label="선택한 채널 이름과 수집 영상 개수">
                {visibleSelectedChannelScopes.map(scope => (
                  <span key={scope.id} className="max-w-full rounded-full border border-indigo-200 bg-white px-2.5 py-1 text-[11px] font-extrabold text-indigo-800">
                    <span className="break-all">{scope.title}</span>
                    <span className="ml-1 text-indigo-500">· {scope.videoCount === null ? '조회 전' : `${scope.videoCount}개`}</span>
                  </span>
                ))}
                {hiddenSelectedChannelCount > 0 ? (
                  <span className="rounded-full border border-slate-300 bg-slate-100 px-2.5 py-1 text-[11px] font-extrabold text-slate-700">
                    외 {hiddenSelectedChannelCount}개
                  </span>
                ) : null}
              </div>
            ) : null}
            {typeof onChangeSelectedChannels === 'function' ? (
              <button
                type="button"
                onClick={onChangeSelectedChannels}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-indigo-200 bg-white px-3 py-2 text-xs font-extrabold text-indigo-700 transition hover:bg-indigo-100 sm:w-auto"
                title="오늘 볼 채널 화면으로 이동합니다. 이동만으로 Azure DB 조회나 YouTube API 수집은 실행하지 않습니다."
                aria-label="선택 채널 변경 화면 열기, 이동만으로 Azure DB 조회 및 YouTube API 호출 없음"
              >
                <ListChecks className="h-3.5 w-3.5" />
                선택 채널 변경
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-300/70 bg-white/60 px-4 py-4 sm:px-5">
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

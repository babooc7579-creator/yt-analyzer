import React from 'react';
import { CheckSquare, History, Square, Trash2 } from 'lucide-react';
import { getLanguageLabel } from '../constants/languages';
import {
  CHANNEL_GRADE_LABELS,
  CHANNEL_GRADE_TONES,
  CHANNEL_STATUS_LABELS,
  CHANNEL_STATUS_TONES,
  getChannelGrade,
  getChannelStatus,
} from '../constants/status';
import { formatCompactKo } from '../utils/formatters';
import { getYouTubeChannelUrl } from '../utils/urls';
import ChannelMetadataControls from './ChannelMetadataControls';
import CopyUrlButton from './CopyUrlButton';

export default function ChannelListItem({
  channel,
  isSelected,
  scanDisplay,
  onToggleSelection,
  onOpenNotes,
  onUpdateMetadata,
  isUpdating,
  onDelete,
}) {
  const grade = getChannelGrade(channel);
  const status = getChannelStatus(channel);
  const selectionLabel = `${channel.title} ${isSelected ? '선택 해제' : '선택'} - 저장 영상 조회와 새 영상 수집 대상에 포함`;
  const channelUrl = getYouTubeChannelUrl(channel);

  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${isSelected ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-100 hover:border-slate-300'}`}>
      <button
        type="button"
        onClick={() => onToggleSelection(channel.id)}
        className="text-indigo-600 focus:outline-none shrink-0 mt-1"
        aria-label={selectionLabel}
        title={selectionLabel}
      >
        {isSelected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 text-slate-300" />}
      </button>
      <img src={channel.thumbnail} alt="" className="w-9 h-9 rounded-full border border-slate-200 shrink-0 mt-1" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2" title={channel.title}>{channel.title}</p>
        <div className="flex items-center gap-x-2 gap-y-1 flex-wrap mt-1">
          <span className="text-[10px] font-medium text-slate-500">{getLanguageLabel(channel.language)}</span>
          <span className={`rounded-full border px-2 py-0.5 text-[9px] font-extrabold ${CHANNEL_GRADE_TONES[grade]}`}>
            등급 {CHANNEL_GRADE_LABELS[grade]}
          </span>
          <span className={`rounded-full border px-2 py-0.5 text-[9px] font-extrabold ${CHANNEL_STATUS_TONES[status]}`}>
            {CHANNEL_STATUS_LABELS[status]}
          </span>
          {channel.stats && (
            <>
              <span className="text-[9px] text-slate-400" title="구독자 수">👤{formatCompactKo(channel.stats.subscriberCount)}</span>
              <span className="text-[9px] text-slate-400" title="전체 영상 수">🎬{formatCompactKo(channel.stats.totalVideoCount)}</span>
              <span className="text-[9px] text-slate-400" title="평균 조회수">👁️{formatCompactKo(channel.stats.avgViewCount)}</span>
            </>
          )}
        </div>
        <ChannelMetadataControls
          channel={channel}
          grade={grade}
          isUpdating={isUpdating}
          onUpdateMetadata={onUpdateMetadata}
          status={status}
        />
        <div className="mt-2 rounded-lg bg-slate-50 border border-slate-100 px-2.5 py-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-[10px] font-semibold text-slate-500">최근 수집: {scanDisplay.scannedText}</span>
            <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-bold ${scanDisplay.statusMeta.className}`}>{scanDisplay.statusMeta.label}</span>
          </div>
          <p className="mt-1 text-[10px] leading-snug text-slate-500 break-words" title={scanDisplay.error || undefined}>
            {scanDisplay.hasSummary
              ? `새 영상 ${scanDisplay.newVideosFound} · 갱신 ${scanDisplay.statsRefreshed}${scanDisplay.coverageRate ? ` · ${scanDisplay.coverageRate}` : ''}${scanDisplay.error ? ` · ${scanDisplay.error}` : ''}`
              : '수집 요약 없음'}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onOpenNotes(channel)}
        className="relative p-1 text-slate-400 hover:text-indigo-600 transition-colors shrink-0 mt-1"
        title="분석/기록 남기기"
        aria-label={`${channel.title} 분석/기록 남기기`}
      >
        <History className="w-4 h-4" />
        {channel.notes?.length > 0 && <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center">{channel.notes.length}</span>}
      </button>
      <CopyUrlButton
        url={channelUrl}
        label="채널 URL 복사"
        copiedLabel="복사됨"
        ariaLabel={`${channel.title} YouTube 채널 URL 복사`}
        title="YouTube 채널 URL을 클립보드에 복사합니다. YouTube API 호출이나 저장 작업은 없습니다."
        showLabel={false}
        className="inline-flex items-center justify-center p-1 text-slate-400 hover:text-blue-600 transition-colors shrink-0 mt-1 disabled:text-slate-200"
        iconClassName="w-4 h-4"
      />
      <button
        onClick={() => onDelete(channel.id, channel.category, channel.title)}
        className="p-1 text-slate-400 hover:text-red-500 transition-colors shrink-0 mt-1"
        title="Cloud 채널 목록에서 삭제합니다. 저장 영상 조회와 새 영상 수집 대상에서 빠집니다."
        aria-label={`${channel.title} Cloud 채널 목록에서 삭제하고 조회/수집 대상에서 제외`}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

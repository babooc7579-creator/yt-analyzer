import { CheckSquare, FolderOpen, History, Loader2, Square, Trash2 } from 'lucide-react';
import { getLanguageLabel } from '../constants/languages';
import {
  CHANNEL_GRADE,
  CHANNEL_GRADE_LABELS,
  CHANNEL_GRADE_TONES,
  CHANNEL_STATUS,
  CHANNEL_STATUS_LABELS,
  CHANNEL_STATUS_TONES,
  getChannelGrade,
  getChannelStatus,
} from '../constants/status';
import { formatCompactKo } from '../utils/formatters';

function ChannelListItem({
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
        <div className="mt-2 grid grid-cols-2 gap-2">
          <label className="block">
            <span className="sr-only">채널 등급</span>
            <select
              value={grade}
              disabled={isUpdating}
              onChange={(event) => onUpdateMetadata(channel, { grade: event.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[10px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
              title="채널 등급"
              aria-label={`${channel.title} 채널 등급 선택`}
            >
              {Object.values(CHANNEL_GRADE).map((value) => (
                <option key={value} value={value}>등급 {CHANNEL_GRADE_LABELS[value]}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="sr-only">채널 상태</span>
            <select
              value={status}
              disabled={isUpdating}
              onChange={(event) => onUpdateMetadata(channel, { status: event.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[10px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
              title="채널 상태"
              aria-label={`${channel.title} 채널 상태 선택`}
            >
              {Object.values(CHANNEL_STATUS).map((value) => (
                <option key={value} value={value}>{CHANNEL_STATUS_LABELS[value]}</option>
              ))}
            </select>
          </label>
        </div>
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
      <button
        onClick={() => onDelete(channel.id, channel.category, channel.title)}
        className="p-1 text-slate-400 hover:text-red-500 transition-colors shrink-0 mt-1"
        title="Cloud 채널 목록에서 삭제"
        aria-label={`${channel.title} Cloud 채널 목록에서 삭제`}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function ChannelList({
  channels,
  selectedCategory,
  selectedChannelIds,
  channelsLoading,
  getScanDisplay,
  onToggleSelection,
  onOpenNotes,
  onUpdateMetadata,
  updatingChannelId,
  onDelete,
}) {
  const visibleChannels = channels.filter((channel) => channel.tags?.includes(selectedCategory));

  return (
    <div className="space-y-3 max-h-[420px] xl:max-h-[520px] overflow-y-auto pr-1.5">
      {channelsLoading ? (
        <p className="text-sm text-slate-400 text-center py-4 flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> 클라우드에서 채널 불러오는 중...</p>
      ) : visibleChannels.length === 0 ? (
        <div className="text-center py-5 px-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
          <FolderOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-600">저장된 채널이 없습니다.</p>
          <p className="text-[11px] text-slate-500 mt-1">먼저 위에서 채널을 미리보기한 뒤 저장해 주세요.</p>
        </div>
      ) : (
        visibleChannels.map((channel) => (
          <ChannelListItem
            key={channel.id}
            channel={channel}
            isSelected={selectedChannelIds.includes(channel.id)}
            scanDisplay={getScanDisplay(channel)}
            onToggleSelection={onToggleSelection}
            onOpenNotes={onOpenNotes}
            onUpdateMetadata={onUpdateMetadata}
            isUpdating={updatingChannelId === channel.id}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
}

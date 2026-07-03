import {
  CHANNEL_GRADE,
  CHANNEL_GRADE_LABELS,
  CHANNEL_STATUS,
  CHANNEL_STATUS_LABELS,
} from '../constants/status';

export default function ChannelMetadataControls({
  channel,
  grade,
  isUpdating,
  onUpdateMetadata,
  status,
}) {
  return (
    <div className="mt-2 grid grid-cols-2 gap-2">
      <label className="block">
        <span className="sr-only">채널 등급</span>
        <select
          value={grade}
          disabled={isUpdating}
          onChange={(event) => onUpdateMetadata(channel, { grade: event.target.value })}
          className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[10px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
          title="채널 등급 변경 - 중요도 표시이며 새 영상 수집 주기를 자동으로 바꾸지 않습니다"
          aria-label={`${channel.title} 채널 등급 선택, 중요도 표시`}
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
          title="채널 상태 변경 - 활성 채널만 새 영상 수집 대상이며 변경 내용은 Cloud에 저장됩니다"
          aria-label={`${channel.title} 채널 상태 선택, 활성 채널만 새 영상 수집 대상`}
        >
          {Object.values(CHANNEL_STATUS).map((value) => (
            <option key={value} value={value}>{CHANNEL_STATUS_LABELS[value]}</option>
          ))}
        </select>
      </label>
    </div>
  );
}

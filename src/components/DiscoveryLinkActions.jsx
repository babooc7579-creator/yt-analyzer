import React from 'react';
import {
  ExternalLink,
  Pencil,
  Rocket,
  Trash2,
  X,
} from 'lucide-react';
import CopyUrlButton from './CopyUrlButton';
import DiscoveryLinkStatusControls from './DiscoveryLinkStatusControls';

export default function DiscoveryLinkActions({
  currentRightsStatus,
  currentStatus,
  isEditing,
  link,
  onDelete,
  onRightsStatusChange,
  onSendToCandidate,
  onStatusChange,
  onToggleEdit,
  saving,
  title,
}) {
  return (
    <div className="grid min-w-[260px] grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto_auto_auto_auto_auto] xl:grid-cols-1">
      <p className="rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 text-[11px] font-semibold leading-relaxed text-indigo-700 sm:col-span-2 lg:col-span-7 xl:col-span-1">
        상태와 권리 선택은 바꾸는 즉시 Cloud 발견함에 저장됩니다. 외부 사이트를 새로 수집하지 않습니다.
      </p>
      <DiscoveryLinkStatusControls
        currentRightsStatus={currentRightsStatus}
        currentStatus={currentStatus}
        onRightsStatusChange={onRightsStatusChange}
        onStatusChange={onStatusChange}
        saving={saving}
        title={title}
      />

      <button
        className={`inline-flex h-9 items-center justify-center gap-2 rounded-lg px-3 text-xs font-extrabold transition disabled:cursor-not-allowed ${
          currentStatus === 'candidate'
            ? 'border border-indigo-100 bg-indigo-50 text-indigo-500'
            : 'bg-indigo-600 text-white hover:bg-indigo-500 disabled:bg-slate-300'
        }`}
        aria-label={
          currentStatus === 'candidate'
            ? `${title} 이미 Cloud 발견함 기록에 제작 후보로 저장됨`
            : `${title} Cloud 발견함 기록에 제작 후보로 저장`
        }
        disabled={saving || currentStatus === 'candidate'}
        onClick={onSendToCandidate}
        title={
          currentStatus === 'candidate'
            ? '이미 Cloud 발견함 기록에 제작 후보로 저장되어 제작실에 표시됩니다'
            : '검토 상태를 제작 후보로 저장하고 제작실에 표시합니다. 외부 사이트를 새로 수집하지 않습니다.'
        }
        type="button"
      >
        <Rocket className="h-4 w-4" />
        {currentStatus === 'candidate' ? '후보 등록됨' : '제작 후보로'}
      </button>

      <a
        className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-extrabold text-slate-700 transition hover:bg-slate-100"
        href={link.url}
        rel="noreferrer"
        target="_blank"
        title="원본 링크 열기"
        aria-label={`${title} 원본 링크 열기`}
      >
        <ExternalLink className="h-4 w-4" />
        열기
      </a>

      <CopyUrlButton
        url={link.url}
        label="복사"
        copiedLabel="복사 완료"
        copyingLabel="복사 중"
        errorLabel="복사 실패"
        disabled={saving}
        ariaLabel={`${title} 원본 링크 URL 복사`}
        title="원본 링크 URL을 클립보드에 복사합니다. 외부 사이트 수집이나 저장 작업은 없습니다."
        className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-extrabold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
        iconClassName="h-4 w-4"
      />

      <button
        className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-extrabold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
        aria-label="발견 링크 제목과 메모 수정"
        disabled={saving}
        onClick={onToggleEdit}
        title="제목과 메모 수정"
        type="button"
      >
        {isEditing ? (
          <X className="h-4 w-4" />
        ) : (
          <Pencil className="h-4 w-4" />
        )}
        {isEditing ? '닫기' : '수정'}
      </button>

      <button
        className="inline-flex h-9 items-center justify-center rounded-lg border border-red-100 bg-red-50 px-3 text-red-600 transition hover:bg-red-100 disabled:opacity-50"
        aria-label="Cloud 발견함에서 링크 기록 삭제"
        disabled={saving}
        onClick={onDelete}
        title="Cloud 발견함에서 링크 기록만 삭제합니다. 원본 사이트는 삭제되지 않습니다."
        type="button"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

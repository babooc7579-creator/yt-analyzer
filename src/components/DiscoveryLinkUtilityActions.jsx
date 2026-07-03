import {
  ExternalLink,
  Pencil,
  Trash2,
  X,
} from 'lucide-react';

import CopyUrlButton from './CopyUrlButton';

export default function DiscoveryLinkUtilityActions({
  isEditing,
  link,
  onDelete,
  onToggleEdit,
  saving,
  title,
}) {
  return (
    <>
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
    </>
  );
}

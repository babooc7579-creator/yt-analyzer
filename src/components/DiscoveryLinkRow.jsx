import { useState } from 'react';
import {
  ExternalLink,
  Pencil,
  Rocket,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import {
  DISCOVERY_LINK_STATUS_OPTIONS,
  DISCOVERY_RIGHTS_STATUS_OPTIONS,
  DISCOVERY_RIGHTS_TONES,
  getDiscoveryLinkHost,
  getDiscoveryLinkPlatform,
  getDiscoveryLinkStatusLabel,
  getDiscoveryPlatformLabel,
  getDiscoveryRightsStatusLabel,
} from '../constants/discoveryLinks';
import CopyUrlButton from './CopyUrlButton';

const formatDateTime = (value) => {
  if (!value) return '기록 없음';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '기록 없음';
  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
};

const needsRiskyCandidateConfirmation = (status, rightsStatus) => (
  status === 'candidate' && rightsStatus === 'do_not_use'
);

const confirmRiskyCandidate = () => window.confirm(
  '이 링크는 "사용 금지"로 표시되어 있습니다.\n\n그래도 제작 후보로 보내시겠어요?\n나중에 제작 후보함에서 강한 경고로 표시됩니다.'
);

export default function DiscoveryLinkRow({
  link,
  onDelete,
  onUpdate,
  saving,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(link.title || '');
  const [draftMemo, setDraftMemo] = useState(link.memo || '');
  const title = link.title || getDiscoveryLinkHost(link.url);
  const sourceHost = getDiscoveryLinkHost(link.url);
  const platformLabel = getDiscoveryPlatformLabel(getDiscoveryLinkPlatform(link));
  const currentStatus = link.status || 'inbox';
  const currentRightsStatus = link.rightsStatus || 'unknown';
  const rightsTone = DISCOVERY_RIGHTS_TONES[currentRightsStatus] || DISCOVERY_RIGHTS_TONES.unknown;

  const handleDelete = () => {
    const confirmed = window.confirm(
      '이 발견 링크를 Cloud 발견함에서 삭제할까요?\n\n원본 사이트 게시물이나 외부 링크 자체는 삭제되지 않습니다. Creator OS 안의 발견함 기록만 삭제됩니다.'
    );
    if (confirmed) onDelete(link.id);
  };

  const handleStatusChange = (event) => {
    const nextStatus = event.target.value;

    if (needsRiskyCandidateConfirmation(nextStatus, currentRightsStatus) && !confirmRiskyCandidate()) {
      event.target.value = currentStatus;
      return;
    }

    onUpdate(link.id, { status: nextStatus });
  };

  const handleRightsStatusChange = (event) => {
    const nextRightsStatus = event.target.value;

    if (needsRiskyCandidateConfirmation(currentStatus, nextRightsStatus) && !confirmRiskyCandidate()) {
      event.target.value = currentRightsStatus;
      return;
    }

    onUpdate(link.id, { rightsStatus: nextRightsStatus });
  };

  const handleSendToCandidate = () => {
    if (currentStatus === 'candidate') return;

    if (needsRiskyCandidateConfirmation('candidate', currentRightsStatus) && !confirmRiskyCandidate()) {
      return;
    }

    onUpdate(link.id, { status: 'candidate' });
  };

  const openEdit = () => {
    setDraftTitle(link.title || '');
    setDraftMemo(link.memo || '');
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setDraftTitle(link.title || '');
    setDraftMemo(link.memo || '');
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    const nextTitle = draftTitle.trim();
    const nextMemo = draftMemo.trim();

    if (nextTitle === (link.title || '') && nextMemo === (link.memo || '')) {
      setIsEditing(false);
      return;
    }

    const didSave = await onUpdate(link.id, {
      title: nextTitle,
      memo: nextMemo,
    });

    if (didSave) {
      setIsEditing(false);
    }
  };

  return (
    <article className={`rounded-xl border p-4 shadow-sm ${rightsTone.card}`}>
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-slate-900 px-2 py-1 text-[10px] font-extrabold text-white">
              {platformLabel}
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] font-extrabold text-slate-600">
              출처 {sourceHost}
            </span>
            <span className="rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-extrabold text-indigo-700">
              {getDiscoveryLinkStatusLabel(currentStatus)}
            </span>
            <span className={`rounded-full px-2 py-1 text-[10px] font-extrabold ${rightsTone.badge}`}>
              {getDiscoveryRightsStatusLabel(currentRightsStatus)}
            </span>
          </div>

          {isEditing ? (
            <div className="mt-3 space-y-3">
              <div>
                <label
                  className="text-[11px] font-extrabold uppercase tracking-wide text-slate-500"
                  htmlFor={`discovery-title-${link.id}`}
                >
                  제목
                </label>
                <input
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-900 outline-none transition focus:border-indigo-400"
                  disabled={saving}
                  id={`discovery-title-${link.id}`}
                  onChange={(event) => setDraftTitle(event.target.value)}
                  placeholder="나중에 알아볼 수 있는 이름"
                  value={draftTitle}
                  aria-label={`${title} 발견 링크 제목 수정`}
                />
              </div>

              <div>
                <label
                  className="text-[11px] font-extrabold uppercase tracking-wide text-slate-500"
                  htmlFor={`discovery-memo-${link.id}`}
                >
                  메모
                </label>
                <textarea
                  className="mt-1 min-h-24 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-relaxed text-slate-800 outline-none transition focus:border-indigo-400"
                  disabled={saving}
                  id={`discovery-memo-${link.id}`}
                  onChange={(event) => setDraftMemo(event.target.value)}
                  placeholder="왜 저장했는지, 어떤 포인트를 봐야 하는지 적어두세요."
                  value={draftMemo}
                  aria-label={`${title} 발견 링크 메모 수정`}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 text-xs font-extrabold text-white transition hover:bg-indigo-500 disabled:bg-slate-300"
                  disabled={saving}
                  onClick={handleSaveEdit}
                  title="제목과 메모를 Cloud 발견함에 저장"
                  aria-label={`${title} 제목과 메모 저장`}
                  type="button"
                >
                  <Save className="h-4 w-4" />
                  저장
                </button>
                <button
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-extrabold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                  disabled={saving}
                  onClick={cancelEdit}
                  title="수정 취소"
                  aria-label={`${title} 수정 취소`}
                  type="button"
                >
                  <X className="h-4 w-4" />
                  취소
                </button>
              </div>
            </div>
          ) : (
            <>
              <h3 className="mt-3 line-clamp-2 text-base font-extrabold text-slate-950" title={title}>
                {title}
              </h3>
              <p className="mt-1 break-all text-xs text-slate-500">{link.url}</p>
              {link.memo ? (
                <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">
                  {link.memo}
                </p>
              ) : null}
            </>
          )}
          <p className="mt-3 text-[11px] font-semibold text-slate-400">
            마지막 저장: {formatDateTime(link.updatedAt || link.createdAt)}
          </p>
        </div>

        <div className="grid min-w-[260px] grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto_auto_auto_auto_auto] xl:grid-cols-1">
          <p className="rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 text-[11px] font-semibold leading-relaxed text-indigo-700 sm:col-span-2 lg:col-span-7 xl:col-span-1">
            상태와 권리 선택은 바꾸는 즉시 Cloud 발견함에 저장됩니다. 외부 사이트를 새로 수집하지 않습니다.
          </p>
          <select
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 outline-none transition focus:border-indigo-400"
            disabled={saving}
            value={currentStatus}
            onChange={handleStatusChange}
            title="검토 상태 변경 - Cloud 발견함 기록에 저장됩니다. 외부 사이트를 새로 수집하지 않습니다."
            aria-label={`${title} 검토 상태 변경, Cloud 발견함 기록 저장`}
          >
            {DISCOVERY_LINK_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <select
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 outline-none transition focus:border-indigo-400"
            disabled={saving}
            value={currentRightsStatus}
            onChange={handleRightsStatusChange}
            title="권리 확인 상태 변경 - Cloud 발견함 기록에 저장됩니다. 외부 사이트를 새로 수집하지 않습니다."
            aria-label={`${title} 권리 확인 상태 변경, Cloud 발견함 기록 저장`}
          >
            {DISCOVERY_RIGHTS_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

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
            onClick={handleSendToCandidate}
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
            onClick={isEditing ? cancelEdit : openEdit}
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
            onClick={handleDelete}
            title="Cloud 발견함에서 링크 기록만 삭제합니다. 원본 사이트는 삭제되지 않습니다."
            type="button"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

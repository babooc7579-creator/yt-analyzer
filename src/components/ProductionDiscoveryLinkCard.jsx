import { AlertCircle, ExternalLink } from 'lucide-react';
import {
  DISCOVERY_RIGHTS_TONES,
  DISCOVERY_RIGHTS_WARNINGS,
  getDiscoveryLinkHost,
  getDiscoveryLinkPlatform,
  getDiscoveryPlatformLabel,
  getDiscoveryRightsStatusLabel,
} from '../constants/discoveryLinks';
import CopyUrlButton from './CopyUrlButton';

const getDiscoveryLinkTitle = (link) => {
  if (link.title) return link.title;
  return getDiscoveryLinkHost(link.url, '발견 링크');
};

const getDiscoveryLinkRightsStatusValue = (link) => link.rightsStatus || 'unknown';

export default function ProductionDiscoveryLinkCard({
  link,
  moveState,
  onEditInDiscoveryLinks,
  onMove,
}) {
  const isMoving = moveState === 'saving';
  const rightsStatus = getDiscoveryLinkRightsStatusValue(link);
  const rightsWarning = DISCOVERY_RIGHTS_WARNINGS[rightsStatus];
  const sourceHost = getDiscoveryLinkHost(link.url);
  const platformLabel = getDiscoveryPlatformLabel(getDiscoveryLinkPlatform(link));
  const linkTitle = getDiscoveryLinkTitle(link);
  const rightsTone = DISCOVERY_RIGHTS_TONES[rightsStatus] || DISCOVERY_RIGHTS_TONES.unknown;

  return (
    <article className={`rounded-xl border p-4 ${rightsWarning ? rightsWarning.cardClass : 'border-slate-200 bg-slate-50'}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-extrabold text-amber-800">링크 후보</span>
        <span className="rounded-full bg-slate-900 px-2 py-1 text-[10px] font-extrabold text-white">
          {platformLabel}
        </span>
        <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] font-extrabold text-slate-600">
          출처 {sourceHost}
        </span>
        <span className={`rounded-full px-2 py-1 text-[10px] font-extrabold ${rightsTone.compactBadge}`}>
          {getDiscoveryRightsStatusLabel(rightsStatus)}
        </span>
      </div>
      <h4 className="mt-3 line-clamp-2 text-sm font-extrabold text-slate-900" title={linkTitle}>
        {linkTitle}
      </h4>
      <p className="mt-1 break-all text-xs text-slate-500">{link.url}</p>
      {rightsWarning && (
        <div className={`mt-3 flex gap-2 rounded-lg border p-3 text-xs ${rightsWarning.panelClass}`}>
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-extrabold">{rightsWarning.title}</p>
            <p className="mt-1 leading-relaxed">{rightsWarning.description}</p>
          </div>
        </div>
      )}
      {link.memo ? (
        <p className="mt-3 line-clamp-3 rounded-lg bg-white p-3 text-xs leading-relaxed text-slate-600">
          {link.memo}
        </p>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-2">
        <a
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3 text-[11px] font-extrabold text-white transition hover:bg-slate-800"
          href={link.url}
          rel="noreferrer"
          target="_blank"
          title="원본 링크를 새 탭에서 열기"
          aria-label={`${linkTitle} 원본 링크 열기`}
        >
          원본 열기
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
        <CopyUrlButton
          url={link.url}
          label="링크 복사"
          copiedLabel="복사 완료"
          copyingLabel="복사 중"
          errorLabel="복사 실패"
          disabled={isMoving}
          ariaLabel={`${linkTitle} 원본 링크 URL 복사`}
          title="원본 링크 URL을 클립보드에 복사합니다. 외부 사이트 수집이나 저장 작업은 없습니다."
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-extrabold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          iconClassName="h-3.5 w-3.5"
        />
        <button
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-extrabold text-slate-700 transition hover:bg-slate-50"
          aria-label={`${linkTitle} 발견함에서 수정`}
          disabled={isMoving}
          onClick={onEditInDiscoveryLinks}
          title="발견함 화면에서 링크 상태와 메모 수정"
          type="button"
        >
          발견함에서 수정
        </button>
        <button
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-indigo-100 bg-indigo-50 px-3 text-[11px] font-extrabold text-indigo-700 transition hover:bg-indigo-100 disabled:opacity-50"
          aria-label={`${linkTitle} 발견함으로 되돌리기`}
          disabled={isMoving}
          onClick={() => onMove(link.id, 'inbox')}
          title="제작 후보에서 빼고 발견함 받은 링크 상태로 저장"
          type="button"
        >
          {isMoving ? '저장 중...' : '발견함으로 되돌리기'}
        </button>
        <button
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-red-100 bg-red-50 px-3 text-[11px] font-extrabold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
          aria-label={`${linkTitle} 제작 후보에서 제외 상태로 저장`}
          disabled={isMoving}
          onClick={() => onMove(link.id, 'discarded')}
          title="링크를 삭제하지 않고 발견함의 후보 제외 상태로 저장합니다"
          type="button"
        >
          {isMoving ? '저장 중...' : '후보 제외'}
        </button>
      </div>
      {moveState === 'error' && (
        <p className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-red-600">
          <AlertCircle className="h-3 w-3" /> 상태 저장 실패. 다시 눌러 주세요.
        </p>
      )}
    </article>
  );
}

import React from 'react';
import { RefreshCw, ShieldCheck } from 'lucide-react';
import CopyUrlButton from './CopyUrlButton';

export default function DiscoveryLinksHeader({
  filteredLinkCount,
  loading,
  onRefresh,
  saving,
  totalLinkCount,
  urlList,
}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <div className="flex items-center gap-2 text-indigo-700">
          <ShieldCheck className="h-5 w-5" />
          <p className="text-xs font-extrabold uppercase">Cloud 발견함</p>
        </div>
        <h3 className="mt-1 text-xl font-extrabold text-slate-950">저장한 링크 {totalLinkCount}개</h3>
        <p className="mt-1 text-xs text-slate-500">
          Cloud에 저장된 수동 링크입니다. 목록이 비어 있으면 Cloud 기준으로 아직 저장된 링크가 없는 상태입니다.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <CopyUrlButton
          url={urlList}
          label="URL 목록 복사"
          copiedLabel="목록 복사 완료"
          disabled={!urlList}
          ariaLabel={`현재 조건에 맞는 발견 링크 ${filteredLinkCount}개 URL 목록 복사`}
          title="현재 필터와 검색 조건에 맞는 발견 링크 제목, URL, 상태를 클립보드에 복사합니다. 외부 사이트 수집이나 저장 작업은 없습니다."
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-extrabold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:text-slate-300"
          iconClassName="h-4 w-4"
        />
        <button
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-extrabold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
          disabled={loading || saving}
          onClick={onRefresh}
          title="Cloud 발견함 목록을 다시 조회합니다. 외부 사이트를 새로 수집하지 않습니다."
          aria-label="Cloud 발견함 목록 다시 조회, 외부 수집 없음"
          type="button"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          새로고침
        </button>
      </div>
    </div>
  );
}

import { AlertTriangle, Plus, RefreshCw } from 'lucide-react';
import {
  DISCOVERY_LINK_STATUS_OPTIONS,
  DISCOVERY_RIGHTS_STATUS_OPTIONS,
} from '../constants/discoveryLinks';
import DiscoveryLinkFieldLabel from './DiscoveryLinkFieldLabel';
import DiscoveryLinkFormHeader from './DiscoveryLinkFormHeader';
import DiscoveryLinkUrlField from './DiscoveryLinkUrlField';

export default function DiscoveryLinkForm({
  duplicateLink,
  form,
  isCreateDisabled,
  saving,
  showRiskyCandidateHint,
  urlPreview,
  onChange,
  onSubmit,
}) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl shadow-slate-950/30">
      <DiscoveryLinkFormHeader />

      <form className="mt-5 space-y-4" onSubmit={onSubmit}>
        <DiscoveryLinkUrlField
          duplicateLink={duplicateLink}
          onChange={onChange}
          url={form.url}
          urlPreview={urlPreview}
        />

        <div className="space-y-1.5">
          <DiscoveryLinkFieldLabel>제목 또는 기억할 이름</DiscoveryLinkFieldLabel>
          <input
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400"
            onChange={(event) => onChange('title', event.target.value)}
            placeholder="나중에 알아볼 수 있는 이름"
            type="text"
            value={form.title}
            aria-label="발견 링크 제목 또는 기억할 이름"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-1">
          <div className="space-y-1.5">
            <DiscoveryLinkFieldLabel>검토 상태</DiscoveryLinkFieldLabel>
            <select
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm font-bold text-white outline-none transition focus:border-indigo-400"
              onChange={(event) => onChange('status', event.target.value)}
              value={form.status}
              title="발견 링크 검토 상태 선택"
              aria-label="발견 링크 검토 상태 선택"
            >
              {DISCOVERY_LINK_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <DiscoveryLinkFieldLabel>권리 확인</DiscoveryLinkFieldLabel>
            <select
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm font-bold text-white outline-none transition focus:border-indigo-400"
              onChange={(event) => onChange('rightsStatus', event.target.value)}
              value={form.rightsStatus}
              title="발견 링크 권리 확인 상태 선택"
              aria-label="발견 링크 권리 확인 상태 선택"
            >
              {DISCOVERY_RIGHTS_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {showRiskyCandidateHint && (
          <div className="flex gap-2 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-xs leading-relaxed text-red-100">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-extrabold">사용 금지 링크를 제작 후보로 저장하려고 합니다</p>
              <p className="mt-1">
                저장 버튼을 누르면 한 번 더 확인합니다. 실제 제작에 쓰기 전에는 원본과 권리 상태를 다시 확인하세요.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <DiscoveryLinkFieldLabel>메모</DiscoveryLinkFieldLabel>
          <textarea
            className="min-h-28 w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm leading-relaxed text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400"
            onChange={(event) => onChange('memo', event.target.value)}
            placeholder="왜 저장했는지, 어떤 포인트를 봐야 하는지 적어두세요."
            value={form.memo}
            aria-label="발견 링크 메모"
          />
        </div>

        <button
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-3 text-sm font-extrabold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-700"
          disabled={isCreateDisabled}
          title="링크와 메모를 Cloud 발견함에 저장합니다. 외부 사이트 크롤링은 하지 않습니다."
          aria-label="Cloud 발견함에 링크 저장"
          type="submit"
        >
          {saving ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {saving ? 'Cloud 저장 중' : duplicateLink ? '이미 저장된 링크' : '링크 저장'}
        </button>
      </form>

      <div className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-xs leading-relaxed text-emerald-100">
        <p className="font-extrabold">안전 기준</p>
        <p className="mt-1">
          저장 영상 조회와 같은 Cloud DB 작업입니다. 유튜브 새 영상 수집이나 외부 사이트 크롤링을 실행하지 않습니다.
        </p>
      </div>
    </section>
  );
}

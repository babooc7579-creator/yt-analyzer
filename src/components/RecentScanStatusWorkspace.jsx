import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  CircleDashed,
  ListChecks,
  RefreshCw,
  Search,
} from 'lucide-react';

import {
  filterRecentScanStatusRows,
  getRecentScanStatusRows,
  getRecentScanStatusSummary,
  RECENT_SCAN_STATUS_FILTERS,
} from '../utils/recentScanStatus';

const STATUS_STYLES = {
  failed: 'border-rose-400/30 bg-rose-500/10 text-rose-200',
  partial: 'border-amber-400/30 bg-amber-500/10 text-amber-200',
  never: 'border-slate-600 bg-slate-800 text-slate-300',
  success: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200',
};

const SUMMARY_ITEMS = [
  { id: 'all', key: 'total', label: '전체 채널' },
  { id: 'failed', key: 'failed', label: '실패' },
  { id: 'partial', key: 'partial', label: '부분 성공' },
  { id: 'never', key: 'never', label: '미수집' },
  { id: 'success', key: 'success', label: '성공' },
];

export default function RecentScanStatusWorkspace({
  channels = [],
  onOpenChannelOperations,
  onOpenSelectedScan,
}) {
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const rows = useMemo(() => getRecentScanStatusRows(channels), [channels]);
  const summary = useMemo(() => getRecentScanStatusSummary(rows), [rows]);
  const visibleRows = useMemo(() => filterRecentScanStatusRows({
    filter,
    query,
    rows,
  }), [filter, query, rows]);

  return (
    <section className="space-y-4" aria-labelledby="recent-scan-status-title">
      <div className="border border-cyan-400/20 bg-slate-900/80 p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-black text-cyan-300">오퍼레이션 관제</p>
            <h2 id="recent-scan-status-title" className="mt-1 text-xl font-black text-white">채널별 최근 수집 상태</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              Cloud 채널 문서에 저장된 마지막 수집 결과를 모아봅니다. 과거 이력이나 정확한 YouTube API 쿼터 장부는 아직 포함하지 않습니다.
            </p>
            <p className="mt-1 text-xs font-bold text-emerald-200">
              이 화면을 열거나 필터링해도 YouTube API 호출과 Cloud 저장은 실행되지 않습니다.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={onOpenChannelOperations}
              className="inline-flex min-h-10 items-center justify-center gap-2 border border-slate-600 bg-slate-950 px-4 py-2 text-xs font-black text-slate-200 hover:border-cyan-400"
              title="채널 운영실의 채널 관리 단계로 이동합니다. 이동만으로 API 호출이나 저장은 실행되지 않습니다."
            >
              <ListChecks className="h-4 w-4" />
              채널 관리
            </button>
            <button
              type="button"
              onClick={onOpenSelectedScan}
              className="inline-flex min-h-10 items-center justify-center gap-2 bg-emerald-300 px-4 py-2 text-xs font-black text-emerald-950 hover:bg-emerald-200"
              title="선택 채널 새 영상 수집 단계로 이동합니다. 이동만으로 수집은 시작되지 않습니다."
            >
              <RefreshCw className="h-4 w-4" />
              새 영상 수집 단계
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 lg:grid-cols-5" aria-label="최근 수집 상태 요약">
          {SUMMARY_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={filter === item.id}
              onClick={() => setFilter(item.id)}
              className={`min-h-[82px] border p-3 text-left transition-colors ${
                filter === item.id
                  ? 'border-cyan-300 bg-cyan-400/15'
                  : 'border-slate-700 bg-slate-950/70 hover:border-slate-500'
              }`}
              title={`${item.label} 채널만 화면에 표시합니다. 데이터는 변경하지 않습니다.`}
            >
              <span className="block text-[11px] font-bold text-slate-400">{item.label}</span>
              <strong className="mt-1 block text-2xl font-black text-white">{summary[item.key]}</strong>
            </button>
          ))}
        </div>
      </div>

      <div className="border border-slate-800 bg-slate-900/70">
        <div className="flex flex-col gap-3 border-b border-slate-800 p-4 lg:flex-row lg:items-center lg:justify-between">
          <label className="relative block w-full max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <span className="sr-only">채널 이름, 태그, 등급 또는 오류 검색</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="채널 이름, 태그, 등급 또는 오류 검색"
              className="min-h-11 w-full border border-slate-700 bg-slate-950 py-2 pl-10 pr-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
            />
          </label>
          <p className="text-xs font-bold text-slate-400" role="status" aria-live="polite">
            {visibleRows.length}개 채널 표시
          </p>
        </div>

        {visibleRows.length > 0 ? (
          <div className="divide-y divide-slate-800">
            {visibleRows.map((row) => (
              <article key={row.channelId || row.channelTitle} className="grid gap-3 p-4 lg:grid-cols-[minmax(220px,1.2fr)_150px_170px_minmax(220px,1fr)] lg:items-center">
                <div>
                  <h3 className="text-sm font-black text-white">{row.channelTitle}</h3>
                  <p className="mt-1 text-xs text-slate-400">
                    등급 {row.grade}{row.tags.length > 0 ? ` · ${row.tags.join(', ')}` : ' · 태그 없음'}
                  </p>
                </div>
                <span className={`inline-flex w-fit items-center gap-2 border px-3 py-1.5 text-xs font-black ${STATUS_STYLES[row.status]}`}>
                  {row.status === 'failed' ? <AlertTriangle className="h-4 w-4" /> : null}
                  {row.status === 'success' ? <CheckCircle2 className="h-4 w-4" /> : null}
                  {row.status === 'never' ? <CircleDashed className="h-4 w-4" /> : null}
                  {row.status === 'partial' ? <RefreshCw className="h-4 w-4" /> : null}
                  {row.statusLabel}
                </span>
                <div>
                  <p className="text-xs font-black text-slate-200">{row.scannedText}</p>
                  <p className="mt-1 text-[11px] text-slate-500">{row.exactScannedAt}</p>
                </div>
                <div className="text-xs leading-5 text-slate-300">
                  {row.status === 'never' ? (
                    <p>아직 저장된 수집 결과가 없습니다.</p>
                  ) : (
                    <p>새 영상 {row.newVideosFound}개 · 통계 갱신 {row.statsRefreshed}개</p>
                  )}
                  {row.error ? <p className="mt-1 font-bold text-rose-300">{row.error}</p> : null}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="px-5 py-12 text-center">
            <p className="text-sm font-black text-white">조건에 맞는 채널이 없습니다</p>
            <p className="mt-2 text-xs text-slate-400">검색어를 지우거나 전체 상태를 선택해 주세요.</p>
            <button
              type="button"
              onClick={() => {
                setFilter('all');
                setQuery('');
              }}
              className="mt-4 border border-slate-600 bg-slate-950 px-4 py-2 text-xs font-black text-slate-200 hover:border-cyan-400"
            >
              검색·필터 초기화
            </button>
          </div>
        )}
      </div>

      <div className="border border-amber-400/20 bg-amber-500/10 p-4">
        <p className="text-xs font-black text-amber-200">현재 표시 범위</p>
        <p className="mt-1 text-xs leading-5 text-amber-100/80">
          채널마다 가장 최근 결과 한 건만 표시합니다. 이전 실행 이력과 API 쿼터 추정은 별도 Cloud 저장 구조를 결정한 뒤 추가합니다.
        </p>
      </div>
    </section>
  );
}

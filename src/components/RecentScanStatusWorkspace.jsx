import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  CircleDashed,
  ListChecks,
  RefreshCw,
  Search,
} from 'lucide-react';

import { fetchScanLogs } from '../services/scanApi';
import { formatKoreanDateTime } from '../utils/dates';
import {
  filterRecentScanStatusRows,
  getScanHistoryRuns,
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

const HISTORY_TRIGGER_LABELS = {
  manual_all: '전체 수동 수집',
  manual_tag: '분야별 수동 수집',
  selected: '선택 채널 수집',
  timer: '예약 수집',
  unknown: '수집 방식 미상',
};

const getHistoryStatusLabel = (status) => (
  status === 'failed' ? '실패' : status === 'partial' ? '부분 성공' : '성공'
);

export default function RecentScanStatusWorkspace({
  channels = [],
  channelsLoading = false,
  loadScanLogs = fetchScanLogs,
  onOpenChannelOperations,
  onOpenSelectedScan,
}) {
  const [filter, setFilter] = useState('all');
  const [historyError, setHistoryError] = useState('');
  const [historyLoading, setHistoryLoading] = useState(true);
  const [scanLogs, setScanLogs] = useState([]);
  const [query, setQuery] = useState('');
  const rows = useMemo(() => getRecentScanStatusRows(channels), [channels]);
  const historyRuns = useMemo(() => getScanHistoryRuns(scanLogs), [scanLogs]);
  const summary = useMemo(() => getRecentScanStatusSummary(rows), [rows]);
  const visibleRows = useMemo(() => filterRecentScanStatusRows({
    filter,
    query,
    rows,
  }), [filter, query, rows]);
  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    setHistoryError('');

    try {
      const result = await loadScanLogs({ pageSize: 100 });
      if (!result?.success) throw new Error(result?.error || '수집 이력을 불러오지 못했습니다.');
      setScanLogs(Array.isArray(result.scanLogs) ? result.scanLogs : []);
    } catch (error) {
      setHistoryError(error.message || '수집 이력을 불러오지 못했습니다.');
    } finally {
      setHistoryLoading(false);
    }
  }, [loadScanLogs]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return (
    <section className="space-y-4" aria-labelledby="recent-scan-status-title">
      <div className="border border-cyan-400/20 bg-slate-900/80 p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-black text-cyan-300">오퍼레이션 관제</p>
            <h2 id="recent-scan-status-title" className="mt-1 text-xl font-black text-white">채널별 최근 수집 상태</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              채널별 마지막 결과와 Cloud에 저장된 과거 수집 이력을 함께 봅니다. 정확한 YouTube API 쿼터 장부는 아직 포함하지 않습니다.
            </p>
            <p className="mt-1 text-xs font-bold text-emerald-200">
              이 화면은 Cloud DB만 조회합니다. YouTube API 호출과 Cloud 저장은 실행되지 않습니다.
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
              <strong className="mt-1 block text-2xl font-black text-white">
                {channelsLoading && rows.length === 0 ? '…' : summary[item.key]}
              </strong>
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
            {channelsLoading && rows.length === 0
              ? 'Cloud 채널 상태 조회 중'
              : `${visibleRows.length}개 채널 표시`}
          </p>
        </div>

        {channelsLoading && rows.length === 0 ? (
          <div className="px-5 py-12 text-center" role="status" aria-live="polite">
            <RefreshCw className="mx-auto h-5 w-5 animate-spin text-cyan-300" />
            <p className="mt-3 text-sm font-black text-white">Cloud 채널 상태를 불러오는 중입니다</p>
            <p className="mt-2 text-xs text-slate-400">조회가 끝나기 전에는 채널이 없다고 판단하지 않습니다.</p>
          </div>
        ) : visibleRows.length > 0 ? (
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
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenChannelOperations?.(row.channelId)}
                      className="inline-flex min-h-8 items-center justify-center gap-1 border border-slate-600 bg-slate-950 px-3 py-1 text-[11px] font-black text-slate-200 hover:border-cyan-400"
                      title="이 채널 하나를 선택한 상태로 채널 관리 단계에 이동합니다. Cloud 저장이나 YouTube API 호출은 실행되지 않습니다."
                    >
                      <ListChecks className="h-3.5 w-3.5" />
                      이 채널 관리
                    </button>
                    {row.status !== 'success' ? (
                      <button
                        type="button"
                        onClick={() => onOpenSelectedScan?.(row.channelId)}
                        className="inline-flex min-h-8 items-center justify-center gap-1 border border-amber-400/40 bg-amber-500/10 px-3 py-1 text-[11px] font-black text-amber-100 hover:border-amber-300"
                        title="이 채널 하나를 선택한 상태로 새 영상 수집 단계에 이동합니다. 실제 수집은 다음 화면에서 별도 버튼을 눌러야 시작됩니다."
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        수집 단계 열기
                      </button>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="px-5 py-12 text-center">
            <p className="text-sm font-black text-white">
              {rows.length === 0 ? '저장된 채널이 없습니다' : '조건에 맞는 채널이 없습니다'}
            </p>
            <p className="mt-2 text-xs text-slate-400">
              {rows.length === 0
                ? '채널 운영실에서 먼저 채널을 등록해 주세요.'
                : '검색어를 지우거나 전체 상태를 선택해 주세요.'}
            </p>
            <button
              type="button"
              onClick={rows.length === 0 ? onOpenChannelOperations : () => {
                setFilter('all');
                setQuery('');
              }}
              className="mt-4 border border-slate-600 bg-slate-950 px-4 py-2 text-xs font-black text-slate-200 hover:border-cyan-400"
            >
              {rows.length === 0 ? '채널 운영실 열기' : '검색·필터 초기화'}
            </button>
          </div>
        )}
      </div>

      <div className="border border-slate-800 bg-slate-900/70" aria-labelledby="scan-history-title">
        <div className="flex flex-col gap-3 border-b border-slate-800 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 id="scan-history-title" className="text-sm font-black text-white">과거 수집 이력</h3>
            <p className="mt-1 text-xs text-slate-400">최근 Cloud 채널 기록 최대 100건을 수집 실행 단위로 묶습니다. 이 조회는 YouTube API를 사용하지 않습니다.</p>
          </div>
          <button
            type="button"
            onClick={loadHistory}
            disabled={historyLoading}
            className="inline-flex min-h-10 items-center justify-center gap-2 border border-slate-600 bg-slate-950 px-4 py-2 text-xs font-black text-slate-200 hover:border-cyan-400 disabled:cursor-wait disabled:opacity-60"
            title="Cloud DB의 수집 이력만 다시 조회합니다. YouTube API 호출이나 새 저장은 실행되지 않습니다."
          >
            <RefreshCw className={`h-4 w-4 ${historyLoading ? 'animate-spin' : ''}`} />
            {historyLoading ? '이력 조회 중' : '이력 다시 불러오기'}
          </button>
        </div>

        {historyLoading ? (
          <p className="px-5 py-10 text-center text-sm font-bold text-slate-300" role="status" aria-live="polite">
            Cloud 수집 이력을 불러오는 중입니다.
          </p>
        ) : null}

        {!historyLoading && historyError ? (
          <div className="px-5 py-10 text-center" role="alert">
            <p className="text-sm font-black text-rose-200">과거 이력을 불러오지 못했습니다</p>
            <p className="mt-2 text-xs text-slate-400">{historyError}</p>
            <p className="mt-1 text-xs text-slate-500">위의 채널별 마지막 상태는 계속 확인할 수 있습니다.</p>
          </div>
        ) : null}

        {!historyLoading && !historyError && scanLogs.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm font-black text-white">아직 저장된 과거 이력이 없습니다</p>
            <p className="mt-2 text-xs text-slate-400">다음 새 영상 수집부터 성공·부분 성공·실패 기록이 Cloud에 쌓입니다.</p>
          </div>
        ) : null}

        {!historyLoading && !historyError && historyRuns.length > 0 ? (
          <div className="divide-y divide-slate-800">
            {historyRuns.map((run) => (
              <details key={run.id} className="group p-4" open={historyRuns.length === 1}>
                <summary className="grid cursor-pointer list-none gap-3 lg:grid-cols-[minmax(220px,1.2fr)_150px_190px_minmax(240px,1fr)] lg:items-center">
                  <div>
                    <h4 className="text-sm font-black text-white">
                      {HISTORY_TRIGGER_LABELS[run.trigger] || HISTORY_TRIGGER_LABELS.unknown}
                    </h4>
                    <p className="mt-1 text-[11px] text-slate-500">
                      {run.channelCount}개 채널 · 눌러서 채널별 결과 보기
                    </p>
                  </div>
                  <span className={`inline-flex w-fit items-center border px-3 py-1.5 text-xs font-black ${STATUS_STYLES[run.status] || STATUS_STYLES.never}`}>
                    {getHistoryStatusLabel(run.status)}
                  </span>
                  <p className="text-xs font-bold text-slate-300">{formatKoreanDateTime(run.scannedAt, '시간 기록 없음')}</p>
                  <div className="text-xs leading-5 text-slate-300">
                    <p>성공 {run.success} · 부분 {run.partial} · 실패 {run.failed}</p>
                    <p className="text-slate-500">새 영상 {run.newVideosFound}개 · 통계 갱신 {run.statsRefreshed}개</p>
                  </div>
                </summary>
                <div className="mt-4 divide-y divide-slate-800 border border-slate-800 bg-slate-950/50">
                  {run.logs.map((log) => (
                    <article
                      key={log.id || `${log.channelId}-${log.scannedAt}`}
                      className="grid gap-2 p-3 sm:grid-cols-[minmax(180px,1fr)_110px_minmax(220px,1.4fr)] sm:items-center"
                    >
                      <div>
                        <p className="text-xs font-black text-slate-100">{log.channelTitle || log.channelId}</p>
                        <p className="mt-1 text-[11px] text-slate-500">{formatKoreanDateTime(log.scannedAt, '시간 기록 없음')}</p>
                      </div>
                      <span className={`inline-flex w-fit items-center border px-2 py-1 text-[11px] font-black ${STATUS_STYLES[log.status] || STATUS_STYLES.never}`}>
                        {getHistoryStatusLabel(log.status)}
                      </span>
                      <div className="text-xs leading-5 text-slate-300">
                        <p>새 영상 {Number(log.newVideosFound) || 0}개 · 통계 갱신 {Number(log.statsRefreshed) || 0}개</p>
                        {log.error ? <p className="font-bold text-rose-300">{log.error}</p> : null}
                      </div>
                    </article>
                  ))}
                </div>
              </details>
            ))}
          </div>
        ) : null}
      </div>

      <div className="border border-amber-400/20 bg-amber-500/10 p-4">
        <p className="text-xs font-black text-amber-200">현재 표시 범위</p>
        <p className="mt-1 text-xs leading-5 text-amber-100/80">
          채널 요약은 마지막 결과 한 건을 유지하고, 과거 이력은 최근 채널 기록 100건을 같은 수집 실행끼리 묶어 표시합니다. API 쿼터 추정은 아직 제공하지 않습니다.
        </p>
      </div>
    </section>
  );
}

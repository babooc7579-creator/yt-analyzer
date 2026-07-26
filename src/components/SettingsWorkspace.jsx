import { useState } from 'react';
import { AlertTriangle, CheckCircle2, Cloud, Database, ExternalLink, FolderCog, KeyRound, RefreshCw } from 'lucide-react';

import ChannelCategorySettings from './ChannelCategorySettings';
import WorkToolSettingsPanel from './WorkToolSettingsPanel';

const settingCards = [
  {
    icon: Database,
    title: 'Cloud DB가 기준 데이터입니다',
    description: '채널, 저장 영상, 판단 기록과 스크랩북은 Cloud 데이터를 기준으로 사용합니다.',
    tone: 'border-blue-400/25 bg-blue-500/10 text-blue-200',
  },
  {
    icon: FolderCog,
    title: '화면 분야 목록은 브라우저 설정입니다',
    description: '분야 추가와 숨김은 이 브라우저의 표시 목록만 바꿉니다. Cloud 채널 태그를 삭제하지 않습니다.',
    tone: 'border-amber-400/25 bg-amber-500/10 text-amber-200',
  },
  {
    icon: KeyRound,
    title: '새 영상 수집만 YouTube API를 사용합니다',
    description: '채널 선택과 저장 영상 불러오기는 YouTube API 호출 작업이 아닙니다.',
    tone: 'border-emerald-400/25 bg-emerald-500/10 text-emerald-200',
  },
];

export default function SettingsWorkspace({
  apiKey,
  categorySettingsProps,
  deploymentStatusUrl,
  diagnostics,
  functionApiBase,
  onChangeApiKey,
  onClearError,
  onRefreshChannels,
  refreshingChannels,
  savedChannelCount,
  workToolSettingsProps,
}) {
  const [refreshResult, setRefreshResult] = useState(null);
  const {
    apiKeyConfigured = false,
    errorGuidance = null,
    runtimeError = '',
    syncWarnings = [],
  } = diagnostics || {};
  const refreshChannels = async () => {
    if (typeof onRefreshChannels !== 'function' || refreshingChannels) return;
    setRefreshResult(null);
    const result = await onRefreshChannels();
    if (result?.success === true) onClearError?.();
    setRefreshResult(result?.success === true ? 'success' : 'error');
  };

  return (
    <section data-testid="creator-route-settings" className="min-w-0 space-y-4">
      <div className="border border-indigo-400/25 bg-indigo-500/10 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-indigo-200 text-indigo-950">
            <FolderCog className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-extrabold text-indigo-300">운영 설정</p>
            <h3 className="mt-1 text-lg font-black text-white">앱의 기준과 채널 분야를 관리합니다</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              화면 표시 설정과 Cloud 데이터 변경을 구분합니다. 이름 변경은 Cloud 채널 태그를 바꾸지만, 추가와 숨김은 현재 브라우저의 화면 목록만 바꿉니다.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {settingCards.map(({ description, icon: Icon, title, tone }) => (
          <article className={`border p-4 ${tone}`} key={title}>
            <Icon className="h-5 w-5" />
            <h4 className="mt-3 text-sm font-extrabold text-white">{title}</h4>
            <p className="mt-2 text-xs leading-5 text-slate-300">{description}</p>
          </article>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 2xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.55fr)]">
        <section className="border border-slate-700 bg-slate-900/90 p-5" aria-labelledby="settings-category-title">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-extrabold text-cyan-300">채널 분야 관리</p>
              <h3 id="settings-category-title" className="mt-1 text-lg font-black text-white">분야 목록 추가·숨김·이름 변경</h3>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                레이더의 분야 필터는 실제 Cloud 채널에 붙은 태그를 자동 집계합니다. 새 분야는 채널에 적용된 뒤 레이더에 나타납니다.
              </p>
            </div>
            <span className="shrink-0 border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-bold text-slate-300">Cloud 채널 {savedChannelCount}개</span>
          </div>
          <ChannelCategorySettings {...categorySettingsProps} />
        </section>

        <aside className="border border-slate-700 bg-slate-900/90 p-5" aria-labelledby="settings-connection-title">
          <div className="flex items-center gap-2 text-cyan-300">
            <Cloud className="h-5 w-5" />
            <h3 id="settings-connection-title" className="text-base font-black text-white">연결 기준</h3>
          </div>
          <dl className="mt-4 space-y-4 text-xs">
            <div className="border-b border-slate-800 pb-4">
              <dt className="font-bold text-slate-500">Function API 경로</dt>
              <dd className="mt-1 break-all font-mono text-slate-200">{functionApiBase}</dd>
            </div>
            <div className="border-b border-slate-800 pb-4">
              <dt className="font-bold text-slate-500">저장 영상 불러오기</dt>
              <dd className="mt-1 font-bold text-blue-200">Cloud DB 조회 · YouTube API 호출 없음</dd>
            </div>
            <div>
              <dt className="font-bold text-slate-500">선택 채널 새 영상 수집</dt>
              <dd className="mt-1 font-bold text-emerald-200">YouTube API 호출 가능 · 필요할 때만 실행</dd>
            </div>
          </dl>
        </aside>
      </div>

      <WorkToolSettingsPanel {...workToolSettingsProps} />

      <section className="border border-slate-700 bg-slate-900/90 p-5" aria-labelledby="settings-diagnostics-title">
        <div>
          <p className="text-xs font-extrabold text-cyan-300">연결 및 진단</p>
          <h3 id="settings-diagnostics-title" className="mt-1 text-lg font-black text-white">필요한 설정과 현재 경고를 확인합니다</h3>
          <p className="mt-2 text-xs leading-5 text-slate-400">
            이 영역은 상태를 보여주거나 API Key를 현재 실행 중인 화면에만 보관합니다. 진단 확인만으로 API 호출이나 데이터 저장은 실행되지 않습니다.
          </p>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-3">
          <article className="border border-slate-700 bg-slate-950/70 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-extrabold text-white">댓글 Top 10용 YouTube API Key</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">댓글을 직접 확인할 때만 사용합니다. 채널 수집용 서버 키와 다른 사용자 입력값입니다.</p>
              </div>
              <span className={`shrink-0 border px-2 py-1 text-[11px] font-bold ${apiKeyConfigured ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200' : 'border-amber-400/30 bg-amber-500/10 text-amber-200'}`}>
                {apiKeyConfigured ? '입력됨' : '미입력'}
              </span>
            </div>
            <input
              aria-label="댓글 Top 10 조회용 YouTube API Key"
              autoComplete="off"
              className="mt-3 w-full border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400"
              onChange={(event) => onChangeApiKey?.(event.target.value)}
              placeholder="댓글 조회가 필요할 때만 입력"
              type="password"
              value={apiKey || ''}
            />
            <p className="mt-2 text-[11px] leading-4 text-slate-500">새로고침하면 사라지며 Cloud DB, localStorage, 저장소에 저장하지 않습니다.</p>
          </article>

          <article className="border border-slate-700 bg-slate-950/70 p-4">
            <div className="flex items-center gap-2">
              {syncWarnings.length > 0 ? <AlertTriangle className="h-4 w-4 text-amber-300" /> : <CheckCircle2 className="h-4 w-4 text-emerald-300" />}
              <p className="text-xs font-extrabold text-white">Cloud 기록 동기화</p>
            </div>
            {syncWarnings.length > 0 ? (
              <ul className="mt-3 space-y-2 text-xs leading-5 text-amber-100">
                {syncWarnings.map((warning) => <li key={warning}>{warning}</li>)}
              </ul>
            ) : (
              <p className="mt-3 text-xs leading-5 text-emerald-200">현재 영상 판단 기록과 스크랩북 동기화 경고가 없습니다.</p>
            )}
            <p className="mt-2 text-[11px] leading-4 text-slate-500">경고가 없다는 표시는 전체 Azure 서비스 상태를 보증한다는 의미는 아닙니다.</p>
          </article>

          <article className="border border-slate-700 bg-slate-950/70 p-4">
            <div className="flex items-center gap-2">
              {runtimeError ? <AlertTriangle className="h-4 w-4 text-rose-300" /> : <CheckCircle2 className="h-4 w-4 text-emerald-300" />}
              <p className="text-xs font-extrabold text-white">현재 화면 오류</p>
            </div>
            <p className={`mt-3 text-xs leading-5 ${runtimeError ? 'text-rose-200' : 'text-emerald-200'}`}>
              {runtimeError || '현재 화면에서 보고된 오류가 없습니다.'}
            </p>
            {errorGuidance && (
              <div className="mt-3 border-l-2 border-rose-300/50 bg-rose-500/5 px-3 py-2">
                <p className="text-xs font-extrabold text-rose-100">{errorGuidance.title}</p>
                <p className="mt-1 text-[11px] leading-4 text-slate-400">{errorGuidance.description}</p>
              </div>
            )}
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={refreshChannels}
                disabled={refreshingChannels || typeof onRefreshChannels !== 'function'}
                className="inline-flex w-full items-center justify-center gap-2 border border-blue-400/30 bg-blue-500/10 px-3 py-2 text-xs font-bold text-blue-100 hover:bg-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                title="Cloud DB에서 채널 목록만 다시 조회합니다. YouTube API는 호출하지 않습니다."
              >
                <RefreshCw className={`h-3.5 w-3.5 ${refreshingChannels ? 'animate-spin' : ''}`} />
                {refreshingChannels ? 'Cloud 채널 조회 중' : 'Cloud 채널 다시 불러오기'}
              </button>
              <a
                className="inline-flex w-full items-center justify-center gap-2 border border-slate-600 bg-slate-900 px-3 py-2 text-xs font-bold text-slate-200 hover:border-indigo-400 hover:text-white sm:w-auto"
                href={deploymentStatusUrl}
                rel="noreferrer"
                target="_blank"
              >
                GitHub Actions에서 배포 상태 확인
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
            {refreshResult === 'success' && <p role="status" className="mt-3 text-xs font-bold text-emerald-200">Cloud 채널 목록을 다시 불러왔습니다.</p>}
            {refreshResult === 'error' && <p role="status" className="mt-3 text-xs font-bold text-rose-200">다시 불러오지 못했습니다. 위 오류와 배포 상태를 확인해 주세요.</p>}
          </article>
        </div>
      </section>
    </section>
  );
}

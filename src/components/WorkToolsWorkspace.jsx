import { useMemo, useState } from 'react';
import { ExternalLink, LibraryBig, Search, Settings2, X } from 'lucide-react';

import { WORK_TOOL_GROUPS } from '../constants/workTools';
import { countWorkTools, filterWorkToolGroups } from '../utils/workToolSearch';

export default function WorkToolsWorkspace({
  error = '',
  loading = false,
  onOpenSettings,
  onReload,
  toolGroups = WORK_TOOL_GROUPS,
}) {
  const [query, setQuery] = useState('');
  const visibleGroups = useMemo(
    () => filterWorkToolGroups(toolGroups, query),
    [query, toolGroups]
  );
  const totalToolCount = countWorkTools(toolGroups);
  const visibleToolCount = countWorkTools(visibleGroups);

  return (
    <section data-testid="creator-route-work-tools" className="min-w-0 space-y-4">
      <header className="border border-slate-800 bg-slate-900/90 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <LibraryBig aria-hidden="true" className="h-6 w-6 text-cyan-300" />
            <div>
              <p className="text-xs font-extrabold text-cyan-300">업무 바로가기</p>
              <h2 className="mt-1 text-xl font-black text-white">업무 도구함</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenSettings}
            disabled={typeof onOpenSettings !== 'function'}
            title="설정의 업무 도구 관리 화면으로 이동합니다. 이동만으로 Cloud 저장이나 외부 API 호출은 실행되지 않습니다."
            className="inline-flex min-h-10 w-full items-center justify-center gap-2 border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-xs font-bold text-cyan-100 hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            <Settings2 aria-hidden="true" className="h-4 w-4" />
            설정에서 관리
          </button>
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
          소재 조사와 채널 운영에 자주 쓰는 외부 도구를 한곳에서 엽니다.
          이 화면은 링크만 제공하며 외부 데이터를 자동 수집하거나 Creator OS에 저장하지 않습니다.
        </p>
      </header>

      {loading && (
        <p role="status" className="border border-blue-400/20 bg-blue-500/10 px-4 py-3 text-xs text-blue-100">
          Cloud에서 나의 업무 도구 설정을 불러오는 중입니다.
        </p>
      )}
      {error && (
        <div role="alert" className="flex flex-col gap-2 border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-xs text-rose-100 sm:flex-row sm:items-center sm:justify-between">
          <span>{error} 현재는 기본 도구를 표시합니다.</span>
          <button type="button" onClick={onReload} className="shrink-0 border border-rose-300/30 px-3 py-1.5 font-bold hover:bg-rose-500/10">다시 불러오기</button>
        </div>
      )}

      <section aria-label="업무 도구 찾기" className="border border-slate-800 bg-slate-900/80 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">업무 도구 검색</span>
            <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              aria-label="업무 도구 검색"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="도구 이름, 설명 또는 분류 검색"
              className="min-h-11 w-full border border-slate-700 bg-slate-950 py-2 pl-10 pr-11 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400"
            />
            {query && (
              <button
                type="button"
                aria-label="업무 도구 검색어 지우기"
                onClick={() => setQuery('')}
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-slate-400 hover:text-white"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            )}
          </label>
          <p role="status" className="shrink-0 text-xs font-bold text-slate-400">
            {query ? `${visibleToolCount}/${totalToolCount}개 도구` : `${totalToolCount}개 도구`}
          </p>
        </div>
      </section>

      {visibleGroups.map((group) => (
        <section key={group.id} aria-labelledby={`work-tool-group-${group.id}`} className="border border-slate-800 bg-slate-900/80 p-5">
          <h3 id={`work-tool-group-${group.id}`} className="text-base font-black text-white">{group.title}</h3>
          <p className="mt-1 text-xs leading-5 text-slate-400">{group.description}</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {group.tools.map((tool) => (
              <a
                key={tool.id}
                href={tool.href}
                target="_blank"
                rel="noreferrer"
                title={`${tool.label} 외부 사이트를 새 창으로 엽니다. Creator OS 데이터는 변경되지 않습니다.`}
                className="flex min-h-32 flex-col justify-between rounded-lg border border-slate-700 bg-slate-950/60 p-4 hover:border-cyan-400"
              >
                <span>
                  <span className="flex items-center justify-between gap-3">
                    <span className="text-sm font-extrabold text-white">{tool.label}</span>
                    <ExternalLink aria-hidden="true" className="h-4 w-4 shrink-0 text-cyan-300" />
                  </span>
                  <span className="mt-2 block text-xs leading-5 text-slate-400">{tool.description}</span>
                </span>
                <span className="mt-3 text-[10px] font-extrabold text-cyan-200">{tool.badge}</span>
              </a>
            ))}
          </div>
        </section>
      ))}

      {!loading && visibleGroups.length === 0 && (
        <section className="border border-dashed border-slate-700 bg-slate-900/60 p-6 text-center">
          <h3 className="text-sm font-extrabold text-white">검색 결과가 없습니다</h3>
          <p className="mt-2 text-xs leading-5 text-slate-400">다른 이름이나 분류로 검색하거나 전체 도구를 다시 표시하세요.</p>
          <button
            type="button"
            onClick={() => setQuery('')}
            className="mt-4 border border-slate-600 bg-slate-950 px-3 py-2 text-xs font-bold text-slate-200 hover:border-cyan-400"
          >
            전체 도구 보기
          </button>
        </section>
      )}

      <aside className="border border-amber-500/20 bg-amber-500/5 p-4 text-xs leading-5 text-amber-100">
        개인 링크 추가·수정·숨김·순서 변경은 설정의 ‘업무 도구 관리’에서 할 수 있습니다. 변경사항은 Cloud에 저장됩니다.
      </aside>
    </section>
  );
}

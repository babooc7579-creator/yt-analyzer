import { ExternalLink, LibraryBig } from 'lucide-react';

import { WORK_TOOL_GROUPS } from '../constants/workTools';

export default function WorkToolsWorkspace() {
  return (
    <section data-testid="creator-route-work-tools" className="min-w-0 space-y-4">
      <header className="border border-slate-800 bg-slate-900/90 p-5">
        <div className="flex items-center gap-3">
          <LibraryBig aria-hidden="true" className="h-6 w-6 text-cyan-300" />
          <div>
            <p className="text-xs font-extrabold text-cyan-300">업무 바로가기</p>
            <h2 className="mt-1 text-xl font-black text-white">업무 도구함</h2>
          </div>
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
          소재 조사와 채널 운영에 자주 쓰는 외부 도구를 한곳에서 엽니다.
          이 화면은 링크만 제공하며 외부 데이터를 자동 수집하거나 Creator OS에 저장하지 않습니다.
        </p>
      </header>

      {WORK_TOOL_GROUPS.map((group) => (
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

      <aside className="border border-amber-500/20 bg-amber-500/5 p-4 text-xs leading-5 text-amber-100">
        현재는 검증된 기본 도구만 제공합니다. 개인 링크 추가·삭제와 순서 저장은 저장 기준을 정한 뒤 별도 기능으로 확장합니다.
      </aside>
    </section>
  );
}

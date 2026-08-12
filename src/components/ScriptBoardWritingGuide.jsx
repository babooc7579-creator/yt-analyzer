import { ClipboardCheck, ChevronDown } from 'lucide-react';

import { SCRIPT_MANUAL_GUIDE_SECTIONS } from '../constants/scriptWorkspace';

export default function ScriptBoardWritingGuide() {
  return (
    <details className="border border-cyan-400/25 bg-cyan-500/5">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-xs font-extrabold text-cyan-100 [&::-webkit-details-marker]:hidden">
        <ClipboardCheck className="h-4 w-4 shrink-0" />
        <span className="min-w-0 flex-1">AI 없이 작성하는 대본 작업 기준</span>
        <span className="text-[10px] font-bold text-cyan-300/70">화면 안내</span>
        <ChevronDown className="h-4 w-4 shrink-0" aria-hidden="true" />
      </summary>
      <div className="grid grid-cols-1 gap-3 border-t border-cyan-400/20 p-4 xl:grid-cols-3">
        {SCRIPT_MANUAL_GUIDE_SECTIONS.map((section) => (
          <section className="border border-slate-700 bg-slate-950/60 p-3" key={section.id}>
            <h4 className="text-xs font-black text-white">{section.title}</h4>
            <p className="mt-1 text-[11px] leading-5 text-slate-400">{section.description}</p>
            <ul className="mt-3 space-y-2 text-[11px] leading-5 text-slate-300">
              {section.checks.map((check) => (
                <li className="flex gap-2" key={check}>
                  <span className="text-cyan-300" aria-hidden="true">□</span>
                  <span>{check}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <p className="border-t border-cyan-400/20 px-4 py-3 text-[10px] leading-5 text-slate-400">
        이 기준은 화면에서 참고하는 안내입니다. 펼치거나 접어도 온라인 저장소(Azure DB) 저장, YouTube API 호출, AI 요청은 실행되지 않습니다.
      </p>
    </details>
  );
}

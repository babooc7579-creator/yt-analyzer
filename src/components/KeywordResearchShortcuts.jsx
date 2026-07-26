import { useState } from 'react';
import { Check, Copy, ExternalLink } from 'lucide-react';

import { WORK_TOOL_GROUPS, getWorkToolUrl } from '../constants/workTools';

const keywordTools = WORK_TOOL_GROUPS.find((group) => group.id === 'keyword-research')?.tools || [];

export default function KeywordResearchShortcuts({ keyword, onOpenWorkTools }) {
  const normalizedKeyword = String(keyword || '').trim();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!normalizedKeyword || !navigator?.clipboard?.writeText) return;
    await navigator.clipboard.writeText(normalizedKeyword);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <section aria-labelledby="keyword-external-tools-title" className="border border-emerald-500/20 bg-emerald-500/5 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h3 id="keyword-external-tools-title" className="text-sm font-extrabold text-white">
            외부 관심도 확인
          </h3>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            Creator OS가 외부 검색량을 자동 수집하지 않습니다. 현재 키워드를 복사하거나 공식 조사 도구에서 직접 확인하세요.
          </p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          disabled={!normalizedKeyword}
          title={normalizedKeyword ? `"${normalizedKeyword}" 복사` : '먼저 키워드를 입력하세요.'}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-xs font-extrabold text-white disabled:cursor-not-allowed disabled:text-slate-600"
        >
          {copied ? <Check aria-hidden="true" className="h-4 w-4 text-emerald-300" /> : <Copy aria-hidden="true" className="h-4 w-4" />}
          {copied ? '복사됨' : '키워드 복사'}
        </button>
      </div>

      {normalizedKeyword ? (
        <p className="mt-3 text-xs font-bold text-emerald-100">확인할 키워드: {normalizedKeyword}</p>
      ) : (
        <p className="mt-3 text-xs font-bold text-slate-500">먼저 검색창에 키워드를 입력하거나 위 추천 키워드를 선택하세요.</p>
      )}

      <div className="mt-3 grid gap-2 md:grid-cols-3">
        {keywordTools.map((tool) => (
          <a
            key={tool.id}
            href={getWorkToolUrl(tool, normalizedKeyword)}
            target="_blank"
            rel="noreferrer"
            title={`${tool.label} 외부 사이트를 새 창으로 엽니다. Creator OS 데이터는 변경되지 않습니다.`}
            className="flex min-h-20 items-start justify-between gap-3 rounded-lg border border-slate-700 bg-slate-950/70 p-3 hover:border-emerald-400"
          >
            <span>
              <span className="block text-xs font-extrabold text-white">{tool.label}</span>
              <span className="mt-1 block text-[10px] leading-4 text-slate-500">{tool.badge}</span>
            </span>
            <ExternalLink aria-hidden="true" className="h-4 w-4 shrink-0 text-emerald-300" />
          </a>
        ))}
      </div>

      <button
        type="button"
        onClick={onOpenWorkTools}
        className="mt-3 text-xs font-extrabold text-emerald-300 hover:text-emerald-200"
        title="업무 도구함 화면으로 이동합니다. API 호출이나 데이터 저장은 없습니다."
      >
        업무 도구함 전체 보기
      </button>
    </section>
  );
}

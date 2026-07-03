import { Link as LinkIcon } from 'lucide-react';

export default function DiscoveryLinkFormHeader() {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
        <LinkIcon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="text-lg font-extrabold text-white">수동 링크 저장</h3>
        <p className="mt-1 text-xs leading-relaxed text-slate-400">
          링크와 메모만 Cloud에 저장합니다. 외부 사이트 자동 수집, 다운로드, AI 분석은 실행하지 않습니다.
        </p>
      </div>
    </div>
  );
}

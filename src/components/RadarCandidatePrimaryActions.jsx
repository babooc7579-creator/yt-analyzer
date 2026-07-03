import { ExternalLink, Play } from 'lucide-react';

import CopyUrlButton from './CopyUrlButton';

export default function RadarCandidatePrimaryActions({ videoTitle, videoUrl }) {
  return (
    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
      <a
        href={videoUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-extrabold text-slate-900 hover:bg-rose-50"
        title="YouTube에서 원본 영상 열기"
        aria-label={`${videoTitle} YouTube에서 열기`}
      >
        <Play className="h-4 w-4" /> 1. 영상 열고 판단 <ExternalLink className="h-3 w-3" />
      </a>
      <CopyUrlButton
        url={videoUrl}
        label="URL 복사"
        copiedLabel="복사 완료"
        ariaLabel={`${videoTitle} YouTube 원본 URL 복사`}
        title="YouTube 원본 URL을 클립보드에 복사합니다. YouTube API 호출이나 저장 작업은 없습니다."
        className="inline-flex items-center justify-center gap-1 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-[11px] font-extrabold text-white transition hover:bg-white/15 disabled:text-white/40"
        iconClassName="h-3.5 w-3.5"
      />
    </div>
  );
}

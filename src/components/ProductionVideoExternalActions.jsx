import { ExternalLink, Play } from 'lucide-react';
import CopyUrlButton from './CopyUrlButton';

export default function ProductionVideoExternalActions({ videoTitle, videoUrl }) {
  return (
    <>
      <CopyUrlButton
        url={videoUrl}
        label="URL 복사"
        copiedLabel="복사 완료"
        ariaLabel={`${videoTitle} YouTube 원본 URL 복사`}
        title="YouTube 원본 URL을 클립보드에 복사합니다. YouTube API 호출이나 저장 작업은 없습니다."
        className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-extrabold text-slate-600 transition-colors hover:bg-slate-50 disabled:text-slate-300"
      />
      <a
        href={videoUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-extrabold text-slate-600 hover:bg-slate-50"
        title="YouTube 원본 영상 열기"
        aria-label={`${videoTitle} YouTube 원본 보기`}
      >
        <Play className="h-3.5 w-3.5" /> 원본 보기 <ExternalLink className="h-3 w-3" />
      </a>
    </>
  );
}

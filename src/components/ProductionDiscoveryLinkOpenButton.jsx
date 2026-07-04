import { ExternalLink } from 'lucide-react';

export default function ProductionDiscoveryLinkOpenButton({
  link,
  linkTitle,
}) {
  return (
    <a
      className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3 text-[11px] font-extrabold text-white transition hover:bg-slate-800"
      href={link.url}
      rel="noreferrer"
      target="_blank"
      title="원본 링크를 새 탭에서 열기"
      aria-label={`${linkTitle} 원본 링크 열기`}
    >
      원본 열기
      <ExternalLink className="h-3.5 w-3.5" />
    </a>
  );
}

import { ShieldCheck } from 'lucide-react';

export default function DiscoveryLinksHeaderTitle({ totalLinkCount }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-indigo-700">
        <ShieldCheck className="h-5 w-5" />
        <p className="text-xs font-extrabold uppercase">Cloud 발견함</p>
      </div>
      <h3 className="mt-1 text-xl font-extrabold text-slate-950">저장한 링크 {totalLinkCount}개</h3>
      <p className="mt-1 text-xs text-slate-500">
        Cloud에 저장된 수동 링크입니다. 목록이 비어 있으면 Cloud 기준으로 아직 저장된 링크가 없는 상태입니다.
      </p>
    </div>
  );
}

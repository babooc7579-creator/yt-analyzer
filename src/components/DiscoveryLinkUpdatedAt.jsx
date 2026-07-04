import { formatKoreanDateTime } from '../utils/dates';

export default function DiscoveryLinkUpdatedAt({ link }) {
  return (
    <p className="mt-3 text-[11px] font-semibold text-slate-400">
      마지막 저장: {formatKoreanDateTime(link.updatedAt || link.createdAt, '기록 없음')}
    </p>
  );
}

const formatDateTime = (value) => {
  if (!value) return '기록 없음';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '기록 없음';
  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
};

export default function DiscoveryLinkUpdatedAt({ link }) {
  return (
    <p className="mt-3 text-[11px] font-semibold text-slate-400">
      마지막 저장: {formatDateTime(link.updatedAt || link.createdAt)}
    </p>
  );
}

import { getChannelListItemMetaViewProps } from '../utils/channelListItemMetaProps';

export default function ChannelListItemMeta({
  channel,
  grade,
  status,
}) {
  const {
    gradeBadgeProps,
    languageLabel,
    stats,
    statusBadgeProps,
  } = getChannelListItemMetaViewProps({
    channel,
    grade,
    status,
  });

  return (
    <div className="flex items-center gap-x-2 gap-y-1 flex-wrap mt-1">
      <span className="text-[10px] font-medium text-slate-500">{languageLabel}</span>
      <span className={gradeBadgeProps.className}>{gradeBadgeProps.label}</span>
      <span className={statusBadgeProps.className}>{statusBadgeProps.label}</span>
      {stats.map((stat) => (
        <span key={stat.label} className="text-[9px] text-slate-400" title={stat.label}>{stat.text}</span>
      ))}
    </div>
  );
}

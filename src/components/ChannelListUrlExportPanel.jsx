import { getChannelListUrlExportPanelViewProps } from '../utils/channelListProps';

import CopyUrlButton from './CopyUrlButton';

export default function ChannelListUrlExportPanel({
  selectedCategory,
  visibleChannels,
  visibleChannelUrlList,
}) {
  const panelProps = getChannelListUrlExportPanelViewProps({
    selectedCategory,
    visibleChannelUrlList,
    visibleChannels,
  });

  if (!panelProps) return null;

  const {
    copyButtonProps,
    description,
    title,
  } = panelProps;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-extrabold text-slate-700">{title}</p>
          <p className="mt-0.5 text-[10px] leading-snug text-slate-500">
            {description}
          </p>
        </div>
        <CopyUrlButton
          url={copyButtonProps.url}
          label={copyButtonProps.label}
          copiedLabel={copyButtonProps.copiedLabel}
          disabled={copyButtonProps.disabled}
          ariaLabel={copyButtonProps.ariaLabel}
          title={copyButtonProps.title}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-extrabold text-slate-700 transition-colors hover:bg-slate-100 disabled:text-slate-300"
          iconClassName="h-3.5 w-3.5"
        />
      </div>
    </div>
  );
}

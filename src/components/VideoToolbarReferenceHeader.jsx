import { getVideoToolbarReferenceHeaderViewProps } from '../utils/videoToolbarProps';
import CopyUrlButton from './CopyUrlButton';

export default function VideoToolbarReferenceHeader({
  filteredCount,
  filteredVideoUrlList,
  totalCount,
}) {
  const {
    copyButtonAriaLabel,
    copyButtonCopiedLabel,
    copyButtonDisabled,
    copyButtonLabel,
    copyButtonTitle,
    description,
    statusText,
    title,
  } = getVideoToolbarReferenceHeaderViewProps({
    filteredCount,
    filteredVideoUrlList,
    totalCount,
  });

  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-extrabold text-slate-900">{title}</p>
        <p className="text-[11px] text-slate-500">{description}</p>
      </div>
      <div className="flex flex-col gap-1 sm:items-end">
        <p className="text-[10px] font-semibold text-slate-500">{statusText}</p>
        <CopyUrlButton
          url={filteredVideoUrlList}
          label={copyButtonLabel}
          copiedLabel={copyButtonCopiedLabel}
          disabled={copyButtonDisabled}
          ariaLabel={copyButtonAriaLabel}
          title={copyButtonTitle}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-extrabold text-slate-700 transition-colors hover:bg-slate-50 disabled:text-slate-300"
          iconClassName="h-3.5 w-3.5"
        />
      </div>
    </div>
  );
}

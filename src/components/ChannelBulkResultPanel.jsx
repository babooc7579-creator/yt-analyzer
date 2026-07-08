import { getChannelBulkResultPanelViewProps } from '../utils/channelAddCopy';

export default function ChannelBulkResultPanel({
  bulkResult,
  resetBulkAdd,
}) {
  if (!bulkResult) return null;
  const {
    closeButtonProps,
    failedResultMessages,
    failedResults,
    summaryText,
  } = getChannelBulkResultPanelViewProps(bulkResult);

  return (
    <div className="p-2 bg-white rounded-lg border border-indigo-200 text-xs space-y-1 max-h-32 overflow-y-auto">
      <p className="font-bold text-slate-700">{summaryText}</p>
      {failedResultMessages.map((message, index) => (
        <p key={failedResults[index]?.handle || index} className="text-red-500 truncate">{message}</p>
      ))}
      <button
        type="button"
        onClick={resetBulkAdd}
        className="mt-1 w-full text-center text-indigo-600 hover:text-indigo-800 font-semibold"
        title={closeButtonProps.title}
        aria-label={closeButtonProps['aria-label']}
      >
        {closeButtonProps.label}
      </button>
    </div>
  );
}

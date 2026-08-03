import { getChannelBulkResultPanelViewProps } from '../utils/channelAddCopy';

export default function ChannelBulkResultPanel({
  bulkResult,
  resetBulkAdd,
}) {
  if (!bulkResult) return null;
  const {
    closeButtonProps,
    resultMessages,
    summaryText,
  } = getChannelBulkResultPanelViewProps(bulkResult);

  return (
    <div className="p-2 bg-white rounded-lg border border-indigo-200 text-xs space-y-1 max-h-32 overflow-y-auto">
      <p className="font-bold text-slate-700">{summaryText}</p>
      {resultMessages.map((result) => (
        <p key={result.key} className={`truncate ${result.status === 'failed' ? 'text-red-500' : result.status === 'existing' || result.status === 'duplicate' ? 'text-amber-600' : 'text-emerald-600'}`}>{result.text}</p>
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

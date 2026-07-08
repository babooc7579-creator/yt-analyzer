import { getChannelBulkInputCopy } from '../utils/channelAddCopy';

export default function ChannelBulkInputBox({
  bulkInput,
  bulkLoading,
  recognizedLineCount,
  setBulkInput,
}) {
  const copy = getChannelBulkInputCopy(recognizedLineCount);

  return (
    <>
      <textarea
        value={bulkInput}
        onChange={(event) => setBulkInput(event.target.value)}
        placeholder={copy.placeholder}
        className="w-full text-sm px-3 py-2 border border-indigo-200 rounded-lg outline-none resize-none font-mono text-xs"
        rows={5}
        disabled={bulkLoading}
        aria-label={copy.ariaLabel}
      />
      <p className="text-[10px] text-slate-500">{copy.helperText}</p>
    </>
  );
}

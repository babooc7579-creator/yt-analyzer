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
        className="w-full resize-none rounded-lg border border-indigo-200 bg-white px-3 py-2 font-mono text-xs text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-400"
        rows={5}
        disabled={bulkLoading}
        aria-label={copy.ariaLabel}
      />
      <p className="text-[10px] text-slate-500">{copy.helperText}</p>
    </>
  );
}

import { Loader2 } from 'lucide-react';

export default function ChannelPreviewInput({
  handlePreviewChannel,
  newChannelInput,
  previewLoading,
  setNewChannelInput,
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex gap-2">
        <input
          type="text"
          value={newChannelInput}
          onChange={(event) => setNewChannelInput(event.target.value)}
          placeholder="핸들 / 채널링크 / 영상링크"
          className="w-full text-sm px-3 py-2 border border-indigo-200 rounded-lg outline-none"
          aria-label="확인할 채널 핸들, 채널 링크 또는 영상 링크"
          onKeyDown={(event) => event.key === 'Enter' && handlePreviewChannel()}
        />
        <button
          type="button"
          onClick={handlePreviewChannel}
          disabled={previewLoading}
          className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-1 whitespace-nowrap"
          title="YouTube에서 채널 정보만 확인합니다. Cloud 저장과 영상 수집은 하지 않습니다."
          aria-label="YouTube에서 채널 정보 확인"
        >
          {previewLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          YouTube에서 확인
        </button>
      </div>
      <p className="text-[10px] text-slate-500">아직 클라우드에 저장하지 않고 YouTube에서 채널 정보만 먼저 확인합니다. 영상 수집은 하지 않습니다.</p>
    </div>
  );
}

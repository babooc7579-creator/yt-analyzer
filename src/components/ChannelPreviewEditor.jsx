import ChannelLanguageSelect from './ChannelLanguageSelect';
import ChannelPreviewSummary from './ChannelPreviewSummary';
import ChannelTagSelector from './ChannelTagSelector';

export default function ChannelPreviewEditor({
  cancelChannelPreview,
  categories,
  channelPreview,
  handleSaveChannel,
  loading,
  newChannelLang,
  newChannelNote,
  newChannelTags,
  setNewChannelLang,
  setNewChannelNote,
  toggleNewChannelTag,
}) {
  return (
    <div className="space-y-2 animate-in fade-in duration-200">
      <ChannelPreviewSummary
        cancelChannelPreview={cancelChannelPreview}
        channelPreview={channelPreview}
      />

      <ChannelTagSelector
        categories={categories}
        label="태그 선택 (여러 개 가능, 안 골라도 OK)"
        selectedTags={newChannelTags}
        toggleTag={toggleNewChannelTag}
      />

      <ChannelLanguageSelect language={newChannelLang} setLanguage={setNewChannelLang} />

      <textarea
        value={newChannelNote}
        onChange={(event) => setNewChannelNote(event.target.value)}
        placeholder="첫 기록 메모 (선택) - 예) 시니어롱폼 소재용, 톤 비슷함"
        className="w-full text-sm px-3 py-2 border border-indigo-200 rounded-lg outline-none resize-none"
        rows={2}
        aria-label="새 채널 첫 기록 메모"
      />

      <div className="flex gap-2">
        <button
          type="button"
          onClick={cancelChannelPreview}
          className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm font-semibold transition-colors"
          title="채널 저장을 취소하고 입력 화면으로 돌아가기"
          aria-label="채널 저장 취소"
        >
          취소
        </button>
        <button
          type="button"
          onClick={handleSaveChannel}
          disabled={loading}
          className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-lg text-sm font-semibold transition-colors"
          title="채널을 Cloud 목록에 저장합니다. 새 영상 수집은 하지 않습니다."
          aria-label="채널을 Cloud 목록에 저장"
        >
          채널 저장
        </button>
      </div>
      <p className="text-[10px] text-slate-500">채널을 클라우드 목록에 저장합니다. 새 영상 수집은 별도의 수집 버튼을 눌렀을 때만 진행됩니다.</p>
    </div>
  );
}

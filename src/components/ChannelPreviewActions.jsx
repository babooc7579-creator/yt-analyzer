export default function ChannelPreviewActions({
  cancelChannelPreview,
  handleSaveChannel,
  loading,
}) {
  return (
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
  );
}

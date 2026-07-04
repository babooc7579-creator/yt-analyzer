import { Settings } from 'lucide-react';

export default function ChannelAddFormHeader({
  addMode,
  channelPreview,
  isEditingCategory,
  setAddMode,
  setIsEditingCategory,
}) {
  return (
    <div className="flex justify-between items-center mb-2">
      <label className="text-xs font-bold text-indigo-800 block">새 채널 모니터링 추가</label>
      <div className="flex items-center gap-2">
        {!channelPreview && (
          <div className="flex bg-white rounded-md border border-indigo-200 overflow-hidden text-[10px] font-bold">
            <button
              type="button"
              onClick={() => setAddMode('single')}
              className={`px-2 py-1 transition-colors ${addMode === 'single' ? 'bg-indigo-600 text-white' : 'text-indigo-500 hover:bg-indigo-50'}`}
              title="채널을 하나씩 확인하고 추가"
              aria-label="단일 채널 추가 모드"
            >
              단일
            </button>
            <button
              type="button"
              onClick={() => setAddMode('bulk')}
              className={`px-2 py-1 transition-colors ${addMode === 'bulk' ? 'bg-indigo-600 text-white' : 'text-indigo-500 hover:bg-indigo-50'}`}
              title="여러 채널을 한 번에 확인하고 추가"
              aria-label="채널 일괄 추가 모드"
            >
              일괄
            </button>
          </div>
        )}
        <button
          type="button"
          onClick={() => setIsEditingCategory(!isEditingCategory)}
          className="text-[10px] text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-semibold whitespace-nowrap"
          title="화면 카테고리와 Cloud 태그 이름을 관리"
          aria-label="카테고리 설정 열기"
        >
          <Settings className="w-3 h-3" /> 카테고리 설정
        </button>
      </div>
    </div>
  );
}

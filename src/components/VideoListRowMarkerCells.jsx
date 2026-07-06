import { CheckSquare, Square, Star } from 'lucide-react';

export default function VideoListRowMarkerCells({
  isChecked,
  isSaved,
  onToggleCheck,
  onToggleScrap,
  videoTitle,
}) {
  return (
    <>
      <td className="px-4 py-5 text-center rounded-l-2xl">
        <button
          type="button"
          onClick={onToggleCheck}
          title="AI API를 호출하지 않고, 나중에 복사할 요청문에 포함할 영상으로 선택합니다."
          aria-label={`${videoTitle} AI 요청문 포함 선택 ${isChecked ? '해제' : '추가'}, API 호출 없음`}
          className="focus:outline-none rounded-lg p-1 hover:bg-white transition-colors"
        >
          {isChecked ? (
            <CheckSquare className="w-6 h-6 text-indigo-600" />
          ) : (
            <Square className="w-6 h-6 text-slate-300 hover:text-indigo-400" />
          )}
        </button>
      </td>
      <td className="px-2 py-5 text-center">
        <button
          type="button"
          onClick={onToggleScrap}
          title={isSaved ? 'Cloud 스크랩북에서 보관 해제' : 'Cloud 스크랩북에 소재로 보관'}
          aria-label={`${videoTitle} ${isSaved ? 'Cloud 스크랩북에서 보관 해제' : 'Cloud 스크랩북에 소재로 보관'}`}
          className="p-2 rounded-full hover:bg-yellow-100 transition-colors"
        >
          <Star className={`w-6 h-6 ${isSaved ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300 group-hover:text-yellow-400'}`} />
        </button>
      </td>
    </>
  );
}

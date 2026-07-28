import { CheckSquare, Square, Star } from 'lucide-react';
import {
  getVideoScrapActionCopy,
  getVideoSelectionActionCopy,
} from '../utils/videoActionButtonProps';

export default function VideoListRowMarkerCells({
  checkDisabled,
  isChecked,
  isSaved,
  onToggleCheck,
  onToggleScrap,
  scrapDisabled,
  videoTitle,
}) {
  const {
    ariaLabel: scrapAriaLabel,
    title: scrapTitle,
  } = getVideoScrapActionCopy({
    isSaved,
    videoTitle,
  });
  const {
    ariaLabel: selectionAriaLabel,
    title: selectionTitle,
  } = getVideoSelectionActionCopy({
    isChecked,
    videoTitle,
  });

  return (
    <>
      <td className="px-4 py-5 text-center rounded-l-2xl">
        <button
          type="button"
          onClick={onToggleCheck}
          disabled={checkDisabled}
          title={checkDisabled ? '선택할 영상 ID가 없어 선택 상태를 바꾸지 않습니다.' : selectionTitle}
          aria-label={selectionAriaLabel}
          className="focus:outline-none rounded-lg p-1 hover:bg-white transition-colors disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
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
          disabled={scrapDisabled}
          title={scrapDisabled ? '보관할 영상 ID가 없어 온라인 스크랩북(Azure DB) 저장을 실행하지 않습니다.' : scrapTitle}
          aria-label={scrapAriaLabel}
          className="p-2 rounded-full hover:bg-yellow-100 transition-colors disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <Star className={`w-6 h-6 ${isSaved ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300 group-hover:text-yellow-400'}`} />
        </button>
      </td>
    </>
  );
}

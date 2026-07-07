import { MessageSquareText } from 'lucide-react';
import {
  COMMENT_API_BUTTON_LABEL,
  getCommentApiButtonProps,
} from '../utils/commentApiButtonProps';

export default function VideoCardCommentButton({ onFetchComments, video, videoTitle }) {
  const commentsButtonProps = getCommentApiButtonProps({
    className: 'flex items-center gap-1 rounded-full border border-indigo-100 bg-indigo-50 px-2 py-1 text-[11px] font-bold text-indigo-600 transition-colors hover:bg-indigo-100',
    onFetchComments,
    video,
    videoTitle,
  });

  return (
    <button {...commentsButtonProps}>
      <MessageSquareText className="w-3 h-3" /> {COMMENT_API_BUTTON_LABEL}
    </button>
  );
}

import { CheckSquare, Rocket, Star, TrendingUp } from 'lucide-react';
import { getVideoListRowBadgeItems } from '../utils/videoListRowBadgesProps';

const BADGE_ICONS = {
  candidate: <Rocket className="w-3 h-3" />,
  checked: <CheckSquare className="w-3 h-3" />,
  saved: <Star className="w-3 h-3 fill-yellow-400 text-yellow-500" />,
  strong: <TrendingUp className="w-3 h-3" />,
  tteotteotto: <Rocket className="w-3 h-3" />,
};

export default function VideoListRowBadges({
  isChecked,
  isProductionCandidate,
  isSaved,
  isStrongReaction,
  isTtoTto,
}) {
  const badgeItems = getVideoListRowBadgeItems({
    isChecked,
    isProductionCandidate,
    isSaved,
    isStrongReaction,
    isTtoTto,
  });

  return (
    <div className="flex flex-wrap items-center gap-2 mb-2">
      {badgeItems.filter((item) => item.isVisible).map((item) => (
        <span key={item.icon} className={item.className}>
          {BADGE_ICONS[item.icon]} {item.label}
        </span>
      ))}
    </div>
  );
}

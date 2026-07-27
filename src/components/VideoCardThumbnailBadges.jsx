import { Rocket, TrendingUp } from 'lucide-react';

import { getVideoCardThumbnailBadgeItems } from '../utils/videoCard';

export default function VideoCardThumbnailBadges({
  isStrongReaction,
  isTtoTto,
  rank,
}) {
  const badgeItems = getVideoCardThumbnailBadgeItems({
    isStrongReaction,
    isTtoTto,
    rank,
  });

  return (
    <div className="absolute left-3 top-3 flex flex-wrap gap-2">
      {badgeItems.filter((item) => item.isVisible).map((item) => (
        <span key={item.label} className={item.className} title={item.title}>
          {item.icon === 'candidate' && <Rocket className="w-3 h-3" />}
          {item.icon === 'strong' && <TrendingUp className="w-3 h-3" />}
          {item.label}
        </span>
      ))}
    </div>
  );
}

import { Layers3, Rocket, TrendingUp } from 'lucide-react';

import { getRadarCandidateBadgesViewProps } from '../utils/radarCandidates';

const BADGE_ICONS = {
  strong: TrendingUp,
  similarTopic: Layers3,
  ttoTto: Rocket,
};

export default function RadarCandidateBadges({ isStrong, isTtoTto, similarTopicCount }) {
  const { badges } = getRadarCandidateBadgesViewProps({ isStrong, isTtoTto, similarTopicCount });

  return (
    <div className="mb-2 flex flex-wrap gap-1.5">
      {badges.map((badge) => {
        const BadgeIcon = BADGE_ICONS[badge.iconName];

        return (
          <span key={badge.key} className={badge.className}>
            <BadgeIcon className="h-3 w-3" /> {badge.label}
          </span>
        );
      })}
    </div>
  );
}

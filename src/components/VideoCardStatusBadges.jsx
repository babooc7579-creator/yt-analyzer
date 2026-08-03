import { getVideoCardStatusBadgeItems } from '../utils/videoCard';

export default function VideoCardStatusBadges({ isChecked, isProductionCandidate, isSaved, similarTopicCount }) {
  const badgeItems = getVideoCardStatusBadgeItems({
    isChecked,
    isProductionCandidate,
    isSaved,
    similarTopicCount,
  });

  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5">
      {badgeItems.filter((item) => item.isVisible).map((item) => (
        <span key={item.label} className={item.className} title={item.title}>{item.label}</span>
      ))}
    </div>
  );
}

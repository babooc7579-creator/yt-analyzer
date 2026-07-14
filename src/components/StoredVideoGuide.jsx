import { Play, RefreshCw } from 'lucide-react';
import { getStoredVideoGuideCards } from '../utils/storedVideoGuide';

const ICONS = {
  load: Play,
  scan: RefreshCw,
};

export default function StoredVideoGuide() {
  const guideCards = getStoredVideoGuideCards();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {guideCards.map((card) => {
        const Icon = ICONS[card.icon];

        return (
          <div key={card.key} className={card.cardClassName} role="note">
            <div className="flex items-start gap-4">
              <Icon className={card.iconClassName} />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={card.badgeClassName}>안내</span>
                  <p className={card.titleClassName}>{card.title}</p>
                </div>
                <p className="text-xs text-slate-600 mt-1">{card.description}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

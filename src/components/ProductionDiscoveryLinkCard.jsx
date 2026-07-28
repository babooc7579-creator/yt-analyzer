import {
  DISCOVERY_RIGHTS_TONES,
  DISCOVERY_RIGHTS_WARNINGS,
  getDiscoveryLinkHost,
  getDiscoveryLinkPlatform,
  getDiscoveryLinkRightsStatusValue,
  getDiscoveryPlatformLabel,
} from '../constants/discoveryLinks';
import { getProductionDiscoveryLinkTitle } from '../utils/discoveryLinks';
import ProductionDiscoveryLinkActions from './ProductionDiscoveryLinkActions';
import ProductionDiscoveryLinkBadges from './ProductionDiscoveryLinkBadges';
import ProductionDiscoveryLinkBody from './ProductionDiscoveryLinkBody';

export default function ProductionDiscoveryLinkCard({
  link,
  moveState,
  onEditInDiscoveryLinks,
  onMove,
  onOpenScriptBoard,
}) {
  const isMoving = moveState === 'saving';
  const rightsStatus = getDiscoveryLinkRightsStatusValue(link);
  const rightsWarning = DISCOVERY_RIGHTS_WARNINGS[rightsStatus];
  const sourceHost = getDiscoveryLinkHost(link.url);
  const platformLabel = getDiscoveryPlatformLabel(getDiscoveryLinkPlatform(link));
  const linkTitle = getProductionDiscoveryLinkTitle(link);
  const rightsTone = DISCOVERY_RIGHTS_TONES[rightsStatus] || DISCOVERY_RIGHTS_TONES.unknown;

  return (
    <article className={`rounded-xl border p-4 ${rightsWarning ? rightsWarning.cardClass : 'border-slate-200 bg-slate-50'}`}>
      <ProductionDiscoveryLinkBadges
        platformLabel={platformLabel}
        rightsStatus={rightsStatus}
        rightsTone={rightsTone}
        sourceHost={sourceHost}
      />
      <ProductionDiscoveryLinkBody
        link={link}
        linkTitle={linkTitle}
        rightsWarning={rightsWarning}
      />
      <ProductionDiscoveryLinkActions
        isMoving={isMoving}
        link={link}
        linkTitle={linkTitle}
        moveState={moveState}
        onEditInDiscoveryLinks={onEditInDiscoveryLinks}
        onMove={onMove}
        onOpenScriptBoard={onOpenScriptBoard}
      />
    </article>
  );
}

import {
  DISCOVERY_RIGHTS_TONES,
  DISCOVERY_RIGHTS_WARNINGS,
  getDiscoveryLinkHost,
  getDiscoveryLinkPlatform,
  getDiscoveryLinkRightsStatusValue,
  getDiscoveryPlatformLabel,
} from '../constants/discoveryLinks';
import ProductionDiscoveryLinkActions from './ProductionDiscoveryLinkActions';
import ProductionDiscoveryLinkBadges from './ProductionDiscoveryLinkBadges';
import ProductionDiscoveryLinkBody from './ProductionDiscoveryLinkBody';

const getDiscoveryLinkTitle = (link) => {
  if (link.title) return link.title;
  return getDiscoveryLinkHost(link.url, '발견 링크');
};

export default function ProductionDiscoveryLinkCard({
  link,
  moveState,
  onEditInDiscoveryLinks,
  onMove,
}) {
  const isMoving = moveState === 'saving';
  const rightsStatus = getDiscoveryLinkRightsStatusValue(link);
  const rightsWarning = DISCOVERY_RIGHTS_WARNINGS[rightsStatus];
  const sourceHost = getDiscoveryLinkHost(link.url);
  const platformLabel = getDiscoveryPlatformLabel(getDiscoveryLinkPlatform(link));
  const linkTitle = getDiscoveryLinkTitle(link);
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
      />
    </article>
  );
}

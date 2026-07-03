import { AlertCircle } from 'lucide-react';
import {
  DISCOVERY_RIGHTS_TONES,
  DISCOVERY_RIGHTS_WARNINGS,
  getDiscoveryLinkHost,
  getDiscoveryLinkPlatform,
  getDiscoveryPlatformLabel,
  getDiscoveryRightsStatusLabel,
} from '../constants/discoveryLinks';
import ProductionDiscoveryLinkActions from './ProductionDiscoveryLinkActions';

const getDiscoveryLinkTitle = (link) => {
  if (link.title) return link.title;
  return getDiscoveryLinkHost(link.url, '발견 링크');
};

const getDiscoveryLinkRightsStatusValue = (link) => link.rightsStatus || 'unknown';

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
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-extrabold text-amber-800">링크 후보</span>
        <span className="rounded-full bg-slate-900 px-2 py-1 text-[10px] font-extrabold text-white">
          {platformLabel}
        </span>
        <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] font-extrabold text-slate-600">
          출처 {sourceHost}
        </span>
        <span className={`rounded-full px-2 py-1 text-[10px] font-extrabold ${rightsTone.compactBadge}`}>
          {getDiscoveryRightsStatusLabel(rightsStatus)}
        </span>
      </div>
      <h4 className="mt-3 line-clamp-2 text-sm font-extrabold text-slate-900" title={linkTitle}>
        {linkTitle}
      </h4>
      <p className="mt-1 break-all text-xs text-slate-500">{link.url}</p>
      {rightsWarning && (
        <div className={`mt-3 flex gap-2 rounded-lg border p-3 text-xs ${rightsWarning.panelClass}`}>
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-extrabold">{rightsWarning.title}</p>
            <p className="mt-1 leading-relaxed">{rightsWarning.description}</p>
          </div>
        </div>
      )}
      {link.memo ? (
        <p className="mt-3 line-clamp-3 rounded-lg bg-white p-3 text-xs leading-relaxed text-slate-600">
          {link.memo}
        </p>
      ) : null}
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

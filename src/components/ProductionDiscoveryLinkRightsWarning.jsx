import { AlertCircle } from 'lucide-react';

export default function ProductionDiscoveryLinkRightsWarning({ rightsWarning }) {
  if (!rightsWarning) return null;

  return (
    <div className={`mt-3 flex gap-2 rounded-lg border p-3 text-xs ${rightsWarning.panelClass}`}>
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <div>
        <p className="font-extrabold">{rightsWarning.title}</p>
        <p className="mt-1 leading-relaxed">{rightsWarning.description}</p>
        {rightsWarning.nextAction ? (
          <p className="mt-2 font-bold leading-relaxed">{rightsWarning.nextAction}</p>
        ) : null}
      </div>
    </div>
  );
}

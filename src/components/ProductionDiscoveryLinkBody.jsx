import ProductionDiscoveryLinkRightsWarning from './ProductionDiscoveryLinkRightsWarning';

export default function ProductionDiscoveryLinkBody({
  link,
  linkTitle,
  rightsWarning,
}) {
  return (
    <>
      <h4 className="mt-3 line-clamp-2 text-sm font-extrabold text-slate-900" title={linkTitle}>
        {linkTitle}
      </h4>
      <p className="mt-1 break-all text-xs text-slate-500">{link.url}</p>
      <ProductionDiscoveryLinkRightsWarning rightsWarning={rightsWarning} />
      {link.memo ? (
        <p className="mt-3 line-clamp-3 rounded-lg bg-white p-3 text-xs leading-relaxed text-slate-600">
          {link.memo}
        </p>
      ) : null}
    </>
  );
}

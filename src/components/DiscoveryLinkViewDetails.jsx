export default function DiscoveryLinkViewDetails({ link, title }) {
  return (
    <>
      <h3 className="mt-3 line-clamp-2 text-base font-extrabold text-slate-950" title={title}>
        {title}
      </h3>
      <p className="mt-1 break-all text-xs text-slate-500">{link.url}</p>
      {link.memo ? (
        <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">
          {link.memo}
        </p>
      ) : null}
    </>
  );
}

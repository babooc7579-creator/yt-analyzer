export default function ReferenceVaultGuideCard({
  className,
  description,
  icon: Icon,
  iconClassName,
  title,
  titleClassName,
}) {
  return (
    <div className={`rounded-xl border p-3 ${className}`}>
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${iconClassName}`} />
        <p className={`text-sm font-extrabold ${titleClassName}`}>{title}</p>
      </div>
      <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
        {description}
      </p>
    </div>
  );
}

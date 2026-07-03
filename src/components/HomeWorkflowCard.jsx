export default function HomeWorkflowCard({
  className,
  description,
  descriptionClassName,
  icon: Icon,
  iconClassName,
  title,
  titleClassName,
  value,
}) {
  return (
    <div className={`rounded-2xl border p-4 ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <p className={`text-sm font-extrabold ${titleClassName}`}>{title}</p>
        <Icon className={`h-4 w-4 ${iconClassName}`} />
      </div>
      <p className={`mt-2 text-xs leading-relaxed ${descriptionClassName}`}>{description}</p>
      <p className="mt-3 text-lg font-black text-white">{value}</p>
    </div>
  );
}

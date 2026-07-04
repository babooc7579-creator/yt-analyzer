export default function HomeOperatingGuidelineCard({ guideline }) {
  return (
    <div className={`rounded-xl border p-4 ${guideline.className}`}>
      <p className={`font-bold ${guideline.titleClassName}`}>{guideline.title}</p>
      <p className="mt-1 text-xs leading-relaxed">{guideline.description}</p>
    </div>
  );
}

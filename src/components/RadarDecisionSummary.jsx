import { getRadarDecisionSummaryViewProps } from '../utils/radarCandidates';

export default function RadarDecisionSummary({ summary }) {
  const { cards } = getRadarDecisionSummaryViewProps(summary);

  return (
    <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className={card.className}>
          <p className={card.labelClassName}>{card.label}</p>
          <p className="mt-1 text-lg font-black text-white">{card.value}</p>
        </div>
      ))}
    </div>
  );
}

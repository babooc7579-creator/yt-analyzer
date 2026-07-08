import { getProductionKanbanSummaryLegendItems } from '../utils/productionKanbanSummary';

export default function ProductionKanbanSummaryLegend() {
  const legendItems = getProductionKanbanSummaryLegendItems();

  return (
    <div className="mt-3 flex flex-wrap gap-2 border-t border-indigo-50 pt-3 text-[11px] font-bold text-slate-500">
      {legendItems.map((item) => (
        <span key={item.key} className={`rounded-full ${item.className}`}>
          {item.label}
        </span>
      ))}
    </div>
  );
}

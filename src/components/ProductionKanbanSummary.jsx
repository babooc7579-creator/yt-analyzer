import ProductionKanbanSummaryLegend from './ProductionKanbanSummaryLegend';
import ProductionKanbanSummaryMetrics from './ProductionKanbanSummaryMetrics';
import ProductionKanbanPriorityGuide from './ProductionKanbanPriorityGuide';
import { getProductionKanbanSummaryHeaderProps } from '../utils/productionKanbanSummary';

export default function ProductionKanbanSummary({
  discoveryLinkCandidateCount,
  productionSummary,
  videoCount,
}) {
  const headerProps = getProductionKanbanSummaryHeaderProps({
    discoveryLinkCandidateCount,
    videoCount,
  });

  return (
    <div className="rounded-2xl border border-indigo-100 bg-white p-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-extrabold text-indigo-700">{headerProps.eyebrow}</p>
          <h3 className="mt-1 text-xl font-extrabold text-slate-900">{headerProps.title}</h3>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            {headerProps.description}
          </p>
        </div>
        <p className="text-xs font-semibold text-slate-500">
          {headerProps.metric}
        </p>
      </div>
      <ProductionKanbanSummaryMetrics
        discoveryLinkCandidateCount={discoveryLinkCandidateCount}
        productionSummary={productionSummary}
      />
      <ProductionKanbanPriorityGuide
        discoveryLinkCandidateCount={discoveryLinkCandidateCount}
        productionSummary={productionSummary}
      />
      <ProductionKanbanSummaryLegend />
    </div>
  );
}

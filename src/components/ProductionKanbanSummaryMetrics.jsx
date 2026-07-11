import { Link as LinkIcon } from 'lucide-react';

import { getProductionKanbanSummaryMetricCards } from '../utils/productionKanbanSummary';
import ProductionKanbanScheduleSummary from './ProductionKanbanScheduleSummary';
import ProductionKanbanSummaryCard from './ProductionKanbanSummaryCard';

export default function ProductionKanbanSummaryMetrics({
  discoveryLinkCandidateCount,
  productionSummary,
}) {
  const metricCards = getProductionKanbanSummaryMetricCards({
    discoveryLinkCandidateCount,
    productionSummary,
  });

  return (
    <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-5">
      {metricCards.map((card) => (
        <ProductionKanbanSummaryCard
          key={card.key}
          label={card.showLinkIcon ? <><LinkIcon className="h-3 w-3" /> {card.label}</> : card.label}
          labelClassName={card.labelClassName}
          title={card.title}
          value={card.value}
          valueClassName={card.valueClassName}
          wrapperClassName={card.wrapperClassName}
        >
          {card.warningText ? (
            <p className="mt-1 text-[10px] font-bold text-rose-600">
              {card.warningText}
            </p>
          ) : null}
        </ProductionKanbanSummaryCard>
      ))}
      <ProductionKanbanScheduleSummary productionSummary={productionSummary} />
    </div>
  );
}

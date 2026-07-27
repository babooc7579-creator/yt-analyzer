import { Link as LinkIcon } from 'lucide-react';

import { getProductionKanbanSummaryMetricCards } from '../utils/productionKanbanSummary';
import ProductionKanbanScheduleSummary from './ProductionKanbanScheduleSummary';
import ProductionKanbanSummaryCard from './ProductionKanbanSummaryCard';

export default function ProductionKanbanSummaryMetrics({
  activeFilterMode,
  discoveryLinkCandidateCount,
  onFilterModeChange,
  productionSummary,
}) {
  const metricCards = getProductionKanbanSummaryMetricCards({
    discoveryLinkCandidateCount,
    productionSummary,
  });

  return (
    <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-5">
      {metricCards.map((card) => (
        <ProductionKanbanSummaryCard
          key={card.key}
          label={card.showLinkIcon ? <><LinkIcon className="h-3 w-3" /> {card.label}</> : card.label}
          labelClassName={card.labelClassName}
          selected={activeFilterMode === card.filterMode}
          onClick={typeof onFilterModeChange === 'function'
            ? () => onFilterModeChange(card.filterMode)
            : undefined}
          title={`${card.title} 눌러 해당 단계만 표시합니다. 온라인 저장소(Azure DB) 데이터는 변경하지 않습니다.`}
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
      <div className="col-span-2 md:col-span-1">
        <ProductionKanbanScheduleSummary productionSummary={productionSummary} />
      </div>
    </div>
  );
}

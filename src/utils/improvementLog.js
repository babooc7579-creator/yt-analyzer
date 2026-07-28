import {
  CREATOR_OS_IMPROVEMENT_AREAS,
  IMPROVEMENT_CHECKPOINT_STATUS,
} from '../constants/improvementLog';

const toArray = (items) => (Array.isArray(items) ? items : []);

export const getImprovementLogSummary = (
  areas = CREATOR_OS_IMPROVEMENT_AREAS,
) => toArray(areas).reduce((summary, area) => {
  summary.areaCount += 1;
  toArray(area?.checkpoints).forEach((checkpoint) => {
    summary.checkpointCount += 1;
    if (checkpoint.status === IMPROVEMENT_CHECKPOINT_STATUS.DONE) {
      summary.doneCount += 1;
    }
    if (checkpoint.status === IMPROVEMENT_CHECKPOINT_STATUS.IN_PROGRESS) {
      summary.inProgressCount += 1;
    }
    if (checkpoint.status === IMPROVEMENT_CHECKPOINT_STATUS.DECISION_REQUIRED) {
      summary.decisionRequiredCount += 1;
    }
  });
  return summary;
}, {
  areaCount: 0,
  checkpointCount: 0,
  decisionRequiredCount: 0,
  doneCount: 0,
  inProgressCount: 0,
});

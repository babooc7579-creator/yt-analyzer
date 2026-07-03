import { formatDateWithDots, getDateDistanceFromToday } from './dates';

export const getProductionScheduleSignal = (record) => {
  const distance = getDateDistanceFromToday(record?.targetPublishDate);
  if (distance === null) {
    return {
      label: '일정 미정',
      tone: 'bg-slate-100 text-slate-500',
    };
  }
  if (distance < 0) {
    return {
      label: `${Math.abs(distance)}일 지남`,
      tone: 'bg-rose-50 text-rose-600',
    };
  }
  if (distance === 0) {
    return {
      label: '오늘 예정',
      tone: 'bg-amber-100 text-amber-800',
    };
  }
  if (distance <= 3) {
    return {
      label: `${distance}일 남음`,
      tone: 'bg-amber-50 text-amber-700',
    };
  }
  return {
    label: formatDateWithDots(record.targetPublishDate),
    tone: 'bg-slate-100 text-slate-600',
  };
};

import { useMemo, useState } from 'react';

import {
  filterUploadCalendarItems,
  formatLocalDateKey,
  getCalendarMonthLabel,
  getCurrentMonthKey,
  getUploadCalendarGridDays,
  getUploadCalendarItems,
  getUploadCalendarSummary,
  getUnscheduledUploadCalendarItems,
  shiftCalendarMonth,
} from '../utils/uploadCalendar';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function useUploadCalendarState({
  initialTargetPublishDate = '',
  initialTargetVideoId = '',
  videoUserRecords,
  videos,
}) {
  const todayKey = useMemo(() => formatLocalDateKey(new Date()), []);
  const initialDate = DATE_PATTERN.test(String(initialTargetPublishDate))
    ? initialTargetPublishDate
    : todayKey;
  const [monthKey, setMonthKey] = useState(() => initialDate.slice(0, 7) || getCurrentMonthKey());
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [statusFilter, setStatusFilter] = useState('all');

  const allItems = useMemo(() => getUploadCalendarItems({ videoUserRecords, videos }), [videoUserRecords, videos]);
  const allUnscheduledItems = useMemo(
    () => getUnscheduledUploadCalendarItems({ videoUserRecords, videos }),
    [videoUserRecords, videos],
  );
  const visibleItems = useMemo(() => filterUploadCalendarItems(allItems, statusFilter), [allItems, statusFilter]);
  const visibleUnscheduledItems = useMemo(
    () => filterUploadCalendarItems(allUnscheduledItems, statusFilter),
    [allUnscheduledItems, statusFilter],
  );
  const gridDays = useMemo(() => getUploadCalendarGridDays({ items: visibleItems, monthKey, todayKey }), [monthKey, todayKey, visibleItems]);
  const selectedDayItems = visibleItems.filter((item) => item.date === selectedDate);
  const summary = useMemo(() => getUploadCalendarSummary({
    items: allItems,
    monthKey,
    todayKey,
    videoUserRecords,
  }), [allItems, monthKey, todayKey, videoUserRecords]);

  const moveMonth = (amount) => {
    const nextMonth = shiftCalendarMonth(monthKey, amount);
    setMonthKey(nextMonth);
    setSelectedDate(`${nextMonth}-01`);
  };

  const goToday = () => {
    setMonthKey(todayKey.slice(0, 7));
    setSelectedDate(todayKey);
  };

  return {
    allItems,
    allUnscheduledItems,
    goNextMonth: () => moveMonth(1),
    goPreviousMonth: () => moveMonth(-1),
    goToday,
    gridDays,
    initialTargetVideoId: String(initialTargetVideoId || '').trim(),
    monthKey,
    monthLabel: getCalendarMonthLabel(monthKey),
    productionRecordCount: allItems.length + summary.unscheduledCount,
    selectedDate,
    selectedDayItems,
    setSelectedDate,
    setStatusFilter,
    statusFilter,
    summary,
    todayKey,
    visibleItems,
    visibleUnscheduledItems,
  };
}

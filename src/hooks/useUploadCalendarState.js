import { useMemo, useState } from 'react';

import {
  filterUploadCalendarItems,
  formatLocalDateKey,
  getCalendarMonthLabel,
  getCurrentMonthKey,
  getUploadCalendarGridDays,
  getUploadCalendarItems,
  getUploadCalendarSummary,
  shiftCalendarMonth,
} from '../utils/uploadCalendar';

export function useUploadCalendarState({ videoUserRecords, videos }) {
  const todayKey = useMemo(() => formatLocalDateKey(new Date()), []);
  const [monthKey, setMonthKey] = useState(() => getCurrentMonthKey());
  const [selectedDate, setSelectedDate] = useState(todayKey);
  const [statusFilter, setStatusFilter] = useState('all');

  const allItems = useMemo(() => getUploadCalendarItems({ videoUserRecords, videos }), [videoUserRecords, videos]);
  const visibleItems = useMemo(() => filterUploadCalendarItems(allItems, statusFilter), [allItems, statusFilter]);
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
    goNextMonth: () => moveMonth(1),
    goPreviousMonth: () => moveMonth(-1),
    goToday,
    gridDays,
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
  };
}

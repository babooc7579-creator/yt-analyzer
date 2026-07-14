export const getDaysDiff = (uploadDate) => {
  const today = new Date();
  const targetDate = new Date(uploadDate);

  if (Number.isNaN(targetDate.getTime())) {
    return 1;
  }

  return Math.max(1, Math.ceil(Math.abs(today - targetDate) / (1000 * 60 * 60 * 24)));
};

export const isOlderThanDays = (dateValue, days) => {
  return getDaysDiff(dateValue) >= days;
};

export const getIsoTodayDate = () => new Date().toISOString().slice(0, 10);

export const formatDateWithDots = (date) => date ? date.split('-').join('.') : '';

export const formatKoreanDateTime = (value, fallback = '') => {
  if (!value) return fallback;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return fallback;

  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
};

export const formatShortKoreanDate = (value, fallback = '게시일 미상') => {
  if (!value) return fallback;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return fallback;

  const dateOnlyMatch = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  const year = dateOnlyMatch ? Number(dateOnlyMatch[1]) : date.getFullYear();
  const month = dateOnlyMatch ? Number(dateOnlyMatch[2]) : date.getMonth() + 1;
  const day = dateOnlyMatch ? Number(dateOnlyMatch[3]) : date.getDate();

  return `${String(year).slice(-2)}년 ${month}월 ${day}일`;
};

export const getDateDistanceFromToday = (date) => {
  if (!date) return null;

  const today = new Date(`${getIsoTodayDate()}T00:00:00`);
  const target = new Date(`${date}T00:00:00`);

  return Math.round((target - today) / 86400000);
};

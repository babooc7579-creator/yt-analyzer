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

export const getDateDistanceFromToday = (date) => {
  if (!date) return null;

  const today = new Date(`${getIsoTodayDate()}T00:00:00`);
  const target = new Date(`${date}T00:00:00`);

  return Math.round((target - today) / 86400000);
};

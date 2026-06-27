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

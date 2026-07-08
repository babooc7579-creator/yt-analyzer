export const toggleListValue = (items = [], value) => {
  const sourceItems = Array.isArray(items) ? items : [];

  return sourceItems.includes(value)
    ? sourceItems.filter((item) => item !== value)
    : [...sourceItems, value];
};

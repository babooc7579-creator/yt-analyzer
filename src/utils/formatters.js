export const formatCompactKo = (value) => {
  const numberValue = Number(value) || 0;

  if (numberValue >= 100000000) {
    return `${(numberValue / 100000000).toFixed(1).replace(/\.0$/, '')}억`;
  }

  if (numberValue >= 10000) {
    return `${(numberValue / 10000).toFixed(1).replace(/\.0$/, '')}만`;
  }

  return numberValue.toLocaleString();
};

export const formatPercent = (value, digits = 1) => {
  const numberValue = Number(value) || 0;
  return `${numberValue.toFixed(digits).replace(/\.0$/, '')}%`;
};

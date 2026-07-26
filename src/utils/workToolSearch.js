const normalizeSearchText = (value) => (
  String(value || '').normalize('NFKC').trim().toLocaleLowerCase('ko-KR')
);

export const countWorkTools = (groups = []) => (
  (Array.isArray(groups) ? groups : []).reduce(
    (count, group) => count + (Array.isArray(group?.tools) ? group.tools.length : 0),
    0
  )
);

export const filterWorkToolGroups = (groups = [], query = '') => {
  const normalizedQuery = normalizeSearchText(query);
  const safeGroups = Array.isArray(groups) ? groups : [];
  if (!normalizedQuery) return safeGroups;

  return safeGroups
    .map((group) => ({
      ...group,
      tools: (Array.isArray(group?.tools) ? group.tools : []).filter((tool) => (
        [
          group?.title,
          group?.description,
          tool?.label,
          tool?.description,
          tool?.badge,
          tool?.href,
        ]
          .map(normalizeSearchText)
          .some((value) => value.includes(normalizedQuery))
      )),
    }))
    .filter((group) => group.tools.length > 0);
};

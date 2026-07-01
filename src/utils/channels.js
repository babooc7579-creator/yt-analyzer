export const getLatestChannelScanDate = (channels = []) => (
  channels.reduce((latest, channel) => {
    const value = channel.lastScanSummary?.scannedAt || channel.lastScannedAt;
    if (!value) return latest;

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return latest;

    return !latest || date > latest ? date : latest;
  }, null)
);

export const getCloudOnlyTags = (channels = [], categories = []) => {
  const categorySet = new Set(categories);
  const tagSet = new Set();

  channels.forEach((channel) => {
    const tags = Array.isArray(channel.tags) ? channel.tags : [];
    [...tags, channel.category].forEach((tag) => {
      const cleanTag = typeof tag === 'string' ? tag.trim() : '';
      if (cleanTag) tagSet.add(cleanTag);
    });
  });

  return [...tagSet]
    .filter((tag) => !categorySet.has(tag))
    .sort((a, b) => a.localeCompare(b));
};

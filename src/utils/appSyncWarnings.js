export const getAppSyncWarnings = ({
  scrapbookSyncWarning,
  videoRecordsSyncWarning,
} = {}) => [
  videoRecordsSyncWarning,
  scrapbookSyncWarning,
].filter(Boolean);

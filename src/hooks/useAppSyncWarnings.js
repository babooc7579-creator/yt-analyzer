export function useAppSyncWarnings({
  scrapbookSyncWarning,
  videoRecordsSyncWarning,
}) {
  return [
    videoRecordsSyncWarning,
    scrapbookSyncWarning,
  ].filter(Boolean);
}

import { getAppSyncWarnings } from '../utils/appSyncWarnings';

export function useAppSyncWarnings({
  scrapbookSyncWarning,
  videoRecordsSyncWarning,
}) {
  return getAppSyncWarnings({
    scrapbookSyncWarning,
    videoRecordsSyncWarning,
  });
}

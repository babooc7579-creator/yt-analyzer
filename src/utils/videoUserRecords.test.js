import { describe, expect, it } from 'vitest';

import { PRODUCTION_STATUS, VIDEO_STATUS } from '../constants/status';
import {
  createRadarRestoredRecord,
  createUpdatedVideoUserRecord,
  createVideoStatusRecord,
  getCloudVideoUserRecord,
  getCloudVideoUserRecords,
  upsertVideoUserRecord,
} from './videoUserRecords';

describe('videoUserRecords utils', () => {
  it('normalizes old records with a single status into statusIds fallback', () => {
    expect(getCloudVideoUserRecord({
      videoId: 'v1',
      status: VIDEO_STATUS.WATCH_LATER,
    })).toMatchObject({
      videoId: 'v1',
      status: VIDEO_STATUS.WATCH_LATER,
      statusIds: [VIDEO_STATUS.WATCH_LATER],
    });
  });

  it('normalizes a record map and fills missing videoId from the map key', () => {
    expect(getCloudVideoUserRecords({
      v1: { status: VIDEO_STATUS.REVIEWED },
      v2: null,
    })).toEqual({
      v1: {
        videoId: 'v1',
        status: VIDEO_STATUS.REVIEWED,
        statusIds: [VIDEO_STATUS.REVIEWED],
      },
    });
  });

  it('upserts records by videoId and ignores records without videoId', () => {
    const initialRecords = { v1: { videoId: 'v1', status: VIDEO_STATUS.REVIEWED } };

    expect(upsertVideoUserRecord(initialRecords, {
      videoId: 'v2',
      status: VIDEO_STATUS.EXCLUDED,
    })).toMatchObject({
      v1: { status: VIDEO_STATUS.REVIEWED },
      v2: { status: VIDEO_STATUS.EXCLUDED },
    });

    expect(upsertVideoUserRecord(initialRecords, { status: VIDEO_STATUS.EXCLUDED })).toBe(initialRecords);
  });

  it('creates status records without dropping existing statusIds', () => {
    const updatedAt = '2026-07-06T00:00:00.000Z';
    const record = createVideoStatusRecord({
      v1: {
        videoId: 'v1',
        status: VIDEO_STATUS.WATCH_LATER,
        statusIds: [VIDEO_STATUS.WATCH_LATER],
      },
    }, 'v1', VIDEO_STATUS.PRODUCTION_CANDIDATE, { memo: 'candidate' }, updatedAt);

    expect(record).toMatchObject({
      videoId: 'v1',
      status: VIDEO_STATUS.PRODUCTION_CANDIDATE,
      memo: 'candidate',
      updatedAt,
    });
    expect(record.statusIds).toEqual([
      VIDEO_STATUS.WATCH_LATER,
      VIDEO_STATUS.PRODUCTION_CANDIDATE,
    ]);
  });

  it('replaces previous production statuses with the next production status', () => {
    const record = createVideoStatusRecord({
      v1: {
        videoId: 'v1',
        status: PRODUCTION_STATUS.ACTIVE,
        statusIds: [VIDEO_STATUS.PRODUCTION_CANDIDATE, PRODUCTION_STATUS.ACTIVE],
      },
    }, 'v1', PRODUCTION_STATUS.DONE);

    expect(record.status).toBe(PRODUCTION_STATUS.DONE);
    expect(record.statusIds).toEqual([PRODUCTION_STATUS.DONE]);
  });

  it('normalizes arbitrary updates with status fallback', () => {
    const record = createUpdatedVideoUserRecord({}, 'v1', {
      status: VIDEO_STATUS.TITLE_REFERENCE,
      titleMemo: 'good hook',
    }, 'now');

    expect(record).toMatchObject({
      videoId: 'v1',
      status: VIDEO_STATUS.TITLE_REFERENCE,
      titleMemo: 'good hook',
      updatedAt: 'now',
      statusIds: [VIDEO_STATUS.TITLE_REFERENCE],
    });
  });

  it('restores radar records by removing hidden statuses and adding unseen', () => {
    const record = createRadarRestoredRecord({
      status: VIDEO_STATUS.EXCLUDED,
      statusIds: [
        VIDEO_STATUS.WATCH_LATER,
        VIDEO_STATUS.REFERENCE_MATERIAL,
        VIDEO_STATUS.EXCLUDED,
      ],
    }, 'v1', 'now');

    expect(record).toMatchObject({
      videoId: 'v1',
      status: VIDEO_STATUS.UNSEEN,
      updatedAt: 'now',
    });
    expect(record.statusIds).toEqual([
      VIDEO_STATUS.REFERENCE_MATERIAL,
      VIDEO_STATUS.UNSEEN,
    ]);
  });
});

import { describe, expect, it } from 'vitest';

import { PRODUCTION_STATUS, VIDEO_STATUS } from '../constants/status';
import {
  VIDEO_USER_RECORD_SAVE_FAILED_MESSAGE,
  VIDEO_USER_RECORDS_CLEAR_FAILED_MESSAGE,
  VIDEO_USER_RECORDS_LOAD_FAILED_MESSAGE,
  createRadarRestoredRecord,
  createUpdatedVideoUserRecord,
  createVideoStatusRecord,
  createVideoUserRecordPatch,
  getCloudVideoUserRecord,
  getCloudVideoUserRecords,
  restoreVideoUserRecord,
  upsertVideoUserRecord,
} from './videoUserRecords';

describe('videoUserRecords utils', () => {
  it('keeps Cloud video user record fallback copy centralized', () => {
    expect(VIDEO_USER_RECORDS_LOAD_FAILED_MESSAGE).toBe('영상 판단 기록을 불러오지 못했습니다.');
    expect(VIDEO_USER_RECORD_SAVE_FAILED_MESSAGE).toBe('영상 판단 기록을 저장하지 못했습니다.');
    expect(VIDEO_USER_RECORDS_CLEAR_FAILED_MESSAGE).toBe('영상 판단 기록을 초기화하지 못했습니다.');
  });

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

  it('restores a previous record after an optimistic save failure', () => {
    const currentRecords = {
      v1: { videoId: 'v1', status: VIDEO_STATUS.PRODUCTION_CANDIDATE },
      v2: { videoId: 'v2', status: VIDEO_STATUS.REVIEWED },
    };
    const previousRecord = { videoId: 'v1', status: VIDEO_STATUS.WATCH_LATER };

    expect(restoreVideoUserRecord(currentRecords, 'v1', previousRecord)).toEqual({
      v1: previousRecord,
      v2: { videoId: 'v2', status: VIDEO_STATUS.REVIEWED },
    });
  });

  it('removes an optimistic record when there was no previous Cloud record', () => {
    expect(restoreVideoUserRecord({
      v1: { videoId: 'v1', status: VIDEO_STATUS.PRODUCTION_CANDIDATE },
      v2: { videoId: 'v2', status: VIDEO_STATUS.REVIEWED },
    }, 'v1')).toEqual({
      v2: { videoId: 'v2', status: VIDEO_STATUS.REVIEWED },
    });
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

  it('creates a Cloud patch with only explicit updates and protected identifiers', () => {
    expect(createVideoUserRecordPatch('v1', {
      scriptBody: '새 대본',
      targetPublishDate: undefined,
    }, 'now')).toEqual({
      scriptBody: '새 대본',
      videoId: 'v1',
      updatedAt: 'now',
    });

    expect(createVideoUserRecordPatch('v1', {
      note: '',
      videoId: 'wrong-id',
    }, 'now')).toEqual({
      note: '',
      videoId: 'v1',
      updatedAt: 'now',
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

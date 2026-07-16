import { describe, expect, it } from 'vitest';

import {
  CHANNEL_OPERATION_STAGES,
  getChannelOperationStage,
  getChannelOperationsJourney,
} from './channelOperations';

describe('channel operations utils', () => {
  it('keeps the operations workflow in management, registration, and scan order', () => {
    expect(CHANNEL_OPERATION_STAGES.map((stage) => stage.id)).toEqual(['manage', 'add', 'scan']);
    expect(CHANNEL_OPERATION_STAGES.map((stage) => stage.targetId)).toEqual([
      'channel-operations-manage',
      'channel-operations-add',
      'channel-operations-scan',
    ]);
  });

  it('falls back to channel management for unknown stages', () => {
    expect(getChannelOperationStage('scan').label).toBe('새 영상 수집');
    expect(getChannelOperationStage('unknown').id).toBe('manage');
  });

  it('guides an empty workspace to channel registration without starting collection', () => {
    const journey = getChannelOperationsJourney();

    expect(journey.title).toBe('먼저 소재를 모을 채널을 등록하세요');
    expect(journey.primaryAction).toMatchObject({ id: 'open-add', label: '새 채널 등록하기' });
    expect(journey.stageStatusById.manage.label).toBe('채널 없음');
    expect(journey.stageStatusById.scan.label).toBe('채널 선택 필요');
  });

  it('guides saved channels to selection before any API action', () => {
    const journey = getChannelOperationsJourney({
      savedChannels: [{ id: 'channel-1' }, { id: 'channel-2' }],
    });

    expect(journey.title).toBe('오늘 확인할 채널을 고르세요');
    expect(journey.description).toContain('선택만으로 API는 호출되지 않습니다');
    expect(journey.primaryAction.id).toBe('open-manage');
    expect(journey.stageStatusById.add.label).toBe('2개 등록됨');
  });

  it('separates Cloud stored-video lookup from optional YouTube collection', () => {
    const journey = getChannelOperationsJourney({
      savedChannels: [{ id: 'channel-1' }],
      selectedChannelIds: ['channel-1'],
    });

    expect(journey.title).toBe('채널 1개 선택 완료');
    expect(journey.primaryAction.id).toBe('load-stored');
    expect(journey.secondaryAction.id).toBe('open-scan');
    expect(journey.description).toContain('Cloud 영상을 먼저 조회');
    expect(journey.description).toContain('YouTube API 수집');
  });

  it('shows collection progress and stored-video completion from current runtime state', () => {
    const scanningJourney = getChannelOperationsJourney({
      isScanning: true,
      savedChannels: [{ id: 'channel-1' }],
      selectedChannelIds: ['channel-1'],
    });
    const readyJourney = getChannelOperationsJourney({
      savedChannels: [{ id: 'channel-1', lastScanSummary: { scannedAt: '2026-07-16T00:00:00.000Z' } }],
      selectedChannelIds: ['channel-1'],
      videos: [{ videoId: 'video-1' }, { videoId: 'video-2' }],
    });

    expect(scanningJourney.title).toContain('수집 중');
    expect(scanningJourney.primaryAction).toBeNull();
    expect(scanningJourney.stageStatusById.scan).toEqual({ label: '수집 중', tone: 'active' });
    expect(readyJourney.title).toBe('영상이 준비됐습니다');
    expect(readyJourney.primaryAction).toMatchObject({ id: 'open-videos', label: '저장 영상 2개 보기' });
    expect(readyJourney.secondaryAction.id).toBe('open-radar');
    expect(readyJourney.stageStatusById.scan.label).toBe('1개 수집 기록');
  });
});

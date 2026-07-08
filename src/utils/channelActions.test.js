import { describe, expect, it } from 'vitest';

import { CHANNEL_STATUS } from '../constants/status';
import {
  CHANNEL_ACTION_COPY,
  CHANNEL_LOAD_FAILED_MESSAGE,
  appendChannel,
  getChannelCloudActionError,
  getChannelDeleteConfirmMessage,
  getChannelDeleteName,
  getChannelLoadErrorMessage,
  removeChannelById,
  removeSelectedChannelId,
  replaceChannel,
  shouldDeselectChannelAfterUpdate,
} from './channelActions';

const channelA = {
  id: 'channel-a',
  title: 'Channel A',
};

const channelB = {
  id: 'channel-b',
  title: 'Channel B',
};

describe('channelActions utils', () => {
  it('keeps Cloud channel action copy centralized by action type', () => {
    expect(CHANNEL_ACTION_COPY.add).toEqual({
      failureMessage: '채널 추가에 실패했습니다.',
      actionLabel: '저장',
    });
    expect(CHANNEL_ACTION_COPY.bulkAdd).toEqual({
      failureMessage: '일괄 추가에 실패했습니다.',
      actionLabel: '일괄 저장',
    });
    expect(CHANNEL_ACTION_COPY.delete).toEqual({
      failureMessage: '채널 삭제에 실패했습니다.',
      actionLabel: '삭제',
    });
    expect(CHANNEL_ACTION_COPY.metadata).toEqual({
      failureMessage: '채널 정보를 저장하지 못했습니다.',
      actionLabel: '정보 저장',
    });
    expect(CHANNEL_ACTION_COPY.note).toEqual({
      failureMessage: '기록 저장에 실패했습니다.',
      actionLabel: '메모 저장',
    });
  });

  it('appends valid channels and ignores invalid channel objects', () => {
    expect(appendChannel([channelA], channelB)).toEqual([channelA, channelB]);
    expect(appendChannel([channelA], { title: 'No id' })).toEqual([channelA]);
    expect(appendChannel(null, channelA)).toEqual([channelA]);
  });

  it('replaces a channel by id while preserving other channels', () => {
    const nextChannel = {
      ...channelB,
      title: 'Updated B',
    };

    expect(replaceChannel([channelA, channelB], nextChannel)).toEqual([
      channelA,
      nextChannel,
    ]);
    expect(replaceChannel([channelA], { title: 'No id' })).toEqual([channelA]);
    expect(replaceChannel(null, channelA)).toEqual([]);
  });

  it('removes deleted channel and selected channel ids safely', () => {
    expect(removeChannelById([channelA, null, channelB], 'channel-a')).toEqual([null, channelB]);
    expect(removeChannelById(null, 'channel-a')).toEqual([]);
    expect(removeSelectedChannelId(['channel-a', 'channel-b'], 'channel-a')).toEqual(['channel-b']);
    expect(removeSelectedChannelId(null, 'channel-a')).toEqual([]);
  });

  it('deselects channels only when metadata update changes status away from active', () => {
    expect(shouldDeselectChannelAfterUpdate({
      status: CHANNEL_STATUS.PAUSED,
    })).toBe(true);
    expect(shouldDeselectChannelAfterUpdate({
      status: CHANNEL_STATUS.ACTIVE,
    })).toBe(false);
    expect(shouldDeselectChannelAfterUpdate({
      grade: 'S',
    })).toBeUndefined();
  });

  it('builds Cloud action error messages without duplicating completion text', () => {
    expect(getChannelCloudActionError('network down', 'fallback', '삭제')).toBe(
      'network down Cloud 채널 삭제 완료 처리하지 않았습니다. 연결을 확인한 뒤 다시 시도해 주세요.',
    );
    expect(getChannelCloudActionError('', '채널 삭제에 실패했습니다.', '삭제')).toBe(
      '채널 삭제에 실패했습니다. Cloud 채널 삭제 완료 처리하지 않았습니다. 연결을 확인한 뒤 다시 시도해 주세요.',
    );
    expect(getChannelCloudActionError('이미 완료 처리하지 않았습니다', 'fallback', '삭제')).toBe(
      '이미 완료 처리하지 않았습니다',
    );
  });

  it('builds Cloud channel load errors that avoid treating failed lookup as source data', () => {
    expect(CHANNEL_LOAD_FAILED_MESSAGE).toBe('채널 목록을 불러오지 못했습니다.');
    expect(getChannelLoadErrorMessage(new Error('network down'))).toBe(
      'network down Cloud 채널 목록 조회를 완료하지 못했습니다. 조회가 성공할 때까지 화면의 채널 목록을 기준 데이터로 보지 않습니다. 연결을 확인한 뒤 다시 시도해 주세요.',
    );
    expect(getChannelLoadErrorMessage(null)).toBe(
      '채널 목록을 불러오지 못했습니다. Cloud 채널 목록 조회를 완료하지 못했습니다. 조회가 성공할 때까지 화면의 채널 목록을 기준 데이터로 보지 않습니다. 연결을 확인한 뒤 다시 시도해 주세요.',
    );
  });

  it('builds a fallback channel delete name', () => {
    expect(getChannelDeleteName('Peak Viral Shorts')).toBe('Peak Viral Shorts');
    expect(getChannelDeleteName('')).toBe('이 채널');
    expect(getChannelDeleteName(null)).toBe('이 채널');
  });

  it('builds delete confirmation wording that protects YouTube source and stored videos', () => {
    const message = getChannelDeleteConfirmMessage('Peak Viral Shorts');

    expect(message).toContain("'Peak Viral Shorts' 채널을 Cloud 채널 목록에서 삭제할까요?");
    expect(message).toContain('저장 영상 조회와 새 영상 수집 대상에서 빠집니다');
    expect(message).toContain('YouTube 원본이나 이미 Cloud에 저장된 영상 데이터는 삭제하지 않습니다');
    expect(message).toContain('나중에 다시 보려면 채널을 다시 추가해야 합니다');
  });
});

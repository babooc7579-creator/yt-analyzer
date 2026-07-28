import { describe, expect, it } from 'vitest';

import {
  BULK_CHANNEL_EMPTY_INPUT_MESSAGE,
  BULK_CHANNEL_SAVE_ACTION_LABEL,
  CHANNEL_PREVIEW_DUPLICATE_MESSAGE,
  CHANNEL_PREVIEW_LOAD_FAILED_MESSAGE,
  CHANNEL_SAVE_ACTION_LABEL,
  getBulkChannelCreatePayload,
  getBulkChannelHandles,
  getBulkChannelSaveCompleteMessage,
  getBulkChannelSaveStartMessage,
  getChannelCreatePayload,
  getChannelSaveCompleteMessage,
  getChannelSaveFailureMessage,
  getChannelSaveStartMessage,
  getTrimmedChannelInput,
  isDuplicateChannel,
} from './channelAddActions';

describe('channelAddActions utils', () => {
  it('keeps channel add form messages and action labels centralized', () => {
    expect(CHANNEL_PREVIEW_LOAD_FAILED_MESSAGE).toBe('채널을 불러오지 못했습니다.');
    expect(CHANNEL_PREVIEW_DUPLICATE_MESSAGE).toBe('이미 등록된 채널입니다.');
    expect(BULK_CHANNEL_EMPTY_INPUT_MESSAGE).toBe('등록할 채널을 한 줄에 하나씩 입력해 주세요.');
    expect(CHANNEL_SAVE_ACTION_LABEL).toBe('저장');
    expect(BULK_CHANNEL_SAVE_ACTION_LABEL).toBe('일괄 저장');
  });

  it('trims single input and parses bulk channel handles safely', () => {
    expect(getTrimmedChannelInput('  @peakviral  ')).toBe('@peakviral');
    expect(getTrimmedChannelInput(null)).toBe('');
    expect(getBulkChannelHandles(' @a \n\n @b\n  https://youtube.com/@c  ')).toEqual([
      '@a',
      '@b',
      'https://youtube.com/@c',
    ]);
    expect(getBulkChannelHandles(null)).toEqual([]);
  });

  it('detects duplicate channels by id while ignoring invalid rows', () => {
    expect(isDuplicateChannel([
      null,
      { id: 'channel-1' },
      { title: 'No id' },
    ], 'channel-1')).toBe(true);
    expect(isDuplicateChannel([
      { id: 'channel-1' },
    ], 'channel-2')).toBe(false);
    expect(isDuplicateChannel(null, 'channel-1')).toBe(false);
  });

  it('builds single and bulk Cloud create payloads without mutating tags', () => {
    const tags = ['해외', '예능'];

    expect(getChannelCreatePayload({
      handle: '  @peakviral  ',
      language: 'EN',
      note: 'check hook',
      tags,
    })).toEqual({
      handle: '@peakviral',
      language: 'EN',
      note: 'check hook',
      tags,
    });

    expect(getBulkChannelCreatePayload({
      handles: ['@a', '@b'],
      language: 'KR',
      tags,
    })).toEqual({
      handles: ['@a', '@b'],
      language: 'KR',
      tags,
    });

    expect(getBulkChannelCreatePayload({
      handles: null,
      language: 'KR',
      tags: null,
    })).toEqual({
      handles: [],
      language: 'KR',
      tags: [],
    });
  });

  it('builds Cloud save failure messages without duplicating completion text', () => {
    expect(getChannelSaveFailureMessage(new Error('network down'))).toBe(
      'network down 온라인 저장소(Azure DB)의 채널 저장 완료 처리하지 않았습니다. 연결을 확인한 뒤 다시 시도해 주세요.',
    );
    expect(getChannelSaveFailureMessage(new Error('이미 완료 처리하지 않았습니다'))).toBe(
      '이미 완료 처리하지 않았습니다',
    );
    expect(getChannelSaveFailureMessage(null, '추가')).toBe(
      '채널 정보를 온라인 저장소(Azure DB)에 저장하지 못했습니다. 온라인 저장소(Azure DB)의 채널 추가 완료 처리하지 않았습니다. 연결을 확인한 뒤 다시 시도해 주세요.',
    );
  });

  it('builds save progress messages that separate Cloud storage from video scanning', () => {
    expect(getChannelSaveStartMessage()).toBe(
      '채널을 온라인 저장소(Azure DB)에 저장하는 중입니다. 새 영상 수집은 실행하지 않습니다.',
    );
    expect(getChannelSaveCompleteMessage()).toBe(
      '채널이 온라인 저장소(Azure DB)에 추가되었습니다. 새 영상은 선택 채널 새 영상 수집 버튼을 눌렀을 때만 확인합니다.',
    );
    expect(getBulkChannelSaveStartMessage(3)).toBe(
      '3개 채널 정보를 YouTube에서 확인한 뒤 온라인 저장소(Azure DB)에 저장하는 중입니다. 영상 수집은 실행하지 않습니다.',
    );
    expect(getBulkChannelSaveCompleteMessage({ total: 5, added: 4 })).toBe(
      '온라인 저장소(Azure DB) 일괄 추가 완료: 5개 중 4개가 저장되었습니다. 새 영상 수집은 실행하지 않았습니다.',
    );
  });
});

import { describe, expect, it } from 'vitest';

import {
  getScanIssueGuidance,
  getScanRetryLabel,
} from './scanIssueGuidance';

describe('scan issue guidance', () => {
  it('explains partial collection as incomplete Cloud coverage', () => {
    expect(getScanIssueGuidance({
      status: 'partial',
      savedVideosTotal: 250,
      channelTotalVideos: 400,
      estimatedMissingVideos: 150,
      coverageRate: 62.5,
    })).toMatchObject({
      title: '최신 수집은 완료됐지만 과거 영상 저장 범위가 아직 부족합니다',
      cause: expect.stringContaining('Cloud 저장 250개 / 채널 전체 400개 · 약 62.5%'),
      nextAction: expect.stringContaining('다음 과거 영상 100개 확인'),
      tone: 'partial',
    });
  });

  it.each([
    ['quota exceeded', 'API 사용 한도', '반복 실행하지 말고'],
    ['network timeout', '네트워크 또는 서버 연결', '잠시 뒤'],
    ['channel not found', '채널 정보를 YouTube에서 찾지 못했습니다', '채널 링크'],
    ['403 forbidden', '요청 권한', 'API 키'],
  ])('turns a technical failure into operator guidance: %s', (error, cause, nextAction) => {
    const guidance = getScanIssueGuidance({ status: 'failed', error });

    expect(guidance.cause).toContain(cause);
    expect(guidance.nextAction).toContain(nextAction);
  });

  it('does not invent a problem for successful or unscanned records', () => {
    expect(getScanIssueGuidance({ status: 'success' })).toBeNull();
    expect(getScanIssueGuidance({ status: 'never' })).toBeNull();
  });

  it('does not present a missing coverage value as zero percent', () => {
    const guidance = getScanIssueGuidance({
      status: 'partial',
      savedVideosTotal: 250,
      channelTotalVideos: 400,
      coverageRate: null,
    });

    expect(guidance.cause).toContain('Cloud 저장 250개 / 채널 전체 400개');
    expect(guidance.cause).not.toContain('0%');
  });

  it('uses distinct retry labels for partial and failed results', () => {
    expect(getScanRetryLabel('partial')).toBe('최신 영상 수집 준비');
    expect(getScanRetryLabel('failed')).toBe('다시 수집 준비');
  });
});

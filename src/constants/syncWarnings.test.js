import { describe, expect, it } from 'vitest';

import {
  SCRAPBOOK_SYNC_WARNINGS,
  SYNC_WARNING_BANNER_COPY,
  VIDEO_RECORDS_SYNC_WARNINGS,
} from './syncWarnings';

describe('syncWarnings constants', () => {
  it('marks video record fallback data as temporary browser records, not Cloud truth', () => {
    expect(VIDEO_RECORDS_SYNC_WARNINGS.loadFallback).toContain('Cloud 연결 실패');
    expect(VIDEO_RECORDS_SYNC_WARNINGS.loadFallback).toContain('임시 기록');
    expect(VIDEO_RECORDS_SYNC_WARNINGS.loadFallback).toContain('Cloud 기준 데이터가 아닙니다');
  });

  it('marks scrapbook fallback data as temporary browser records, not Cloud truth', () => {
    expect(SCRAPBOOK_SYNC_WARNINGS.loadFallback).toContain('Cloud 연결 실패');
    expect(SCRAPBOOK_SYNC_WARNINGS.loadFallback).toContain('임시 기록');
    expect(SCRAPBOOK_SYNC_WARNINGS.loadFallback).toContain('Cloud 기준 데이터가 아닙니다');
  });

  it('keeps save failure copy from looking like local-only success', () => {
    expect(VIDEO_RECORDS_SYNC_WARNINGS.saveFailed).toContain('Cloud에 저장되지 않았습니다');
    expect(SCRAPBOOK_SYNC_WARNINGS.saveFailed).toContain('브라우저 임시 기록으로 저장 완료 처리하지 않습니다');
  });

  it('states the Cloud-first fallback policy in the banner help text', () => {
    expect(SYNC_WARNING_BANNER_COPY.helpText).toContain('Cloud 응답만 기준');
    expect(SYNC_WARNING_BANNER_COPY.helpText).toContain('연결 실패 때만');
    expect(SYNC_WARNING_BANNER_COPY.helpText).toContain('자동 병합하지 않습니다');
    expect(SYNC_WARNING_BANNER_COPY.helpText).toContain('자동 업로드하지 않습니다');
  });
});

import { describe, expect, it } from 'vitest';

import {
  SCRAPBOOK_SYNC_WARNINGS,
  SYNC_WARNING_BANNER_COPY,
  VIDEO_RECORDS_CLEAR_CONFIRM_MESSAGE,
  VIDEO_RECORDS_FULL_CLEAR_SAFETY_PROPS,
  VIDEO_RECORDS_SYNC_WARNINGS,
} from './syncWarnings';

describe('syncWarnings constants', () => {
  it('marks video record fallback data as temporary browser records, not online-storage truth', () => {
    expect(VIDEO_RECORDS_SYNC_WARNINGS.loadFallback).toContain('온라인 저장소(Azure DB) 연결 실패');
    expect(VIDEO_RECORDS_SYNC_WARNINGS.loadFallback).toContain('임시 기록');
    expect(VIDEO_RECORDS_SYNC_WARNINGS.loadFallback).toContain('온라인 저장소(Azure DB) 기준 데이터가 아닙니다');
  });

  it('marks scrapbook fallback data as temporary browser records, not online-storage truth', () => {
    expect(SCRAPBOOK_SYNC_WARNINGS.loadFallback).toContain('온라인 저장소(Azure DB) 연결 실패');
    expect(SCRAPBOOK_SYNC_WARNINGS.loadFallback).toContain('임시 기록');
    expect(SCRAPBOOK_SYNC_WARNINGS.loadFallback).toContain('온라인 저장소(Azure DB) 기준 데이터가 아닙니다');
  });

  it('keeps save failure copy from looking like local-only success', () => {
    expect(VIDEO_RECORDS_SYNC_WARNINGS.saveFailed).toContain('온라인 저장소(Azure DB)에 저장되지 않았습니다');
    expect(SCRAPBOOK_SYNC_WARNINGS.saveFailed).toContain('브라우저 임시 기록으로 저장 완료 처리하지 않습니다');
    expect(SCRAPBOOK_SYNC_WARNINGS.productionSourceCleanupFailed).toContain('기존 소재 보관 기록은 삭제하지 않았습니다');
  });

  it('states the online-storage-first fallback policy in the banner help text', () => {
    expect(SYNC_WARNING_BANNER_COPY.title).toContain('일부 온라인 저장 기능');
    expect(SYNC_WARNING_BANNER_COPY.helpText).toContain('아래에 표시된 기능만');
    expect(SYNC_WARNING_BANNER_COPY.helpText).toContain('다른 온라인 저장소(Azure DB) 조회가 성공했다면 해당 데이터는 정상');
    expect(SYNC_WARNING_BANNER_COPY.helpText).toContain('자동 병합하거나 자동 업로드하지 않습니다');
  });

  it('keeps the full video-record delete action unavailable and describes its real scope', () => {
    expect(VIDEO_RECORDS_FULL_CLEAR_SAFETY_PROPS.show).toBe(false);
    expect(VIDEO_RECORDS_FULL_CLEAR_SAFETY_PROPS.title).toContain('제작 후보, 대본, 업로드 일정');
    expect(VIDEO_RECORDS_CLEAR_CONFIRM_MESSAGE).toContain('영상별 전체 작업 기록');
    expect(VIDEO_RECORDS_CLEAR_CONFIRM_MESSAGE).toContain('현재 사용자 화면에서는 제공하지 않습니다');
  });
});

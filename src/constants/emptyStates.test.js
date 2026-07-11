import { describe, expect, it } from 'vitest';

import {
  DISCOVERY_LINKS_EMPTY_STATE,
  PRODUCTION_KANBAN_EMPTY_STATE,
  REFERENCE_VAULT_EMPTY_STATE,
  SCRAPBOOK_EMPTY_STATE,
  VIDEO_FILTER_EMPTY_STATE,
} from './emptyStates';

describe('emptyStates constants', () => {
  it('keeps reference vault empty guidance clear about scan versus DB lookup', () => {
    expect(REFERENCE_VAULT_EMPTY_STATE.description).toContain('Cloud DB');
    expect(REFERENCE_VAULT_EMPTY_STATE.description).toContain('필요할 때만');
    expect(REFERENCE_VAULT_EMPTY_STATE.steps[0].description).toContain('영상 수집은 실행되지 않습니다');
    expect(REFERENCE_VAULT_EMPTY_STATE.steps[1].description).toContain('YouTube API');
    expect(REFERENCE_VAULT_EMPTY_STATE.steps[2].description).toContain('새 YouTube API 호출은 없습니다');
    expect(REFERENCE_VAULT_EMPTY_STATE.homeButton.title).toContain('YouTube API를 새로 호출하지 않습니다');
    expect(REFERENCE_VAULT_EMPTY_STATE.addChannelButton.title).toContain('영상 수집이나 YouTube API 호출은 실행하지 않습니다');
  });

  it('keeps scrapbook empty guidance tied to Cloud scrapbook storage', () => {
    expect(SCRAPBOOK_EMPTY_STATE.description).toContain('별표');
    expect(SCRAPBOOK_EMPTY_STATE.steps[1].description).toContain('Cloud DB');
    expect(SCRAPBOOK_EMPTY_STATE.steps[1].description).toContain('새 YouTube API 호출은 없습니다');
    expect(SCRAPBOOK_EMPTY_STATE.steps[2].description).toContain('Cloud 스크랩북');
  });

  it('keeps discovery links empty guidance manual and non-crawling', () => {
    expect(DISCOVERY_LINKS_EMPTY_STATE.description).toContain('직접 저장');
    expect(DISCOVERY_LINKS_EMPTY_STATE.description).toContain('Cloud 발견함');
    expect(DISCOVERY_LINKS_EMPTY_STATE.steps[0].description).toContain('수동');
    expect(DISCOVERY_LINKS_EMPTY_STATE.steps[2].description).toContain('자동 수집');
    expect(DISCOVERY_LINKS_EMPTY_STATE.steps[2].description).toContain('다운로드는 실행하지 않습니다');
  });

  it('keeps production empty guidance limited to explicit candidates', () => {
    expect(PRODUCTION_KANBAN_EMPTY_STATE.description).toContain('자동으로 제작 후보가 되지는 않습니다');
    expect(PRODUCTION_KANBAN_EMPTY_STATE.description).toContain('제작 후보로 표시하면');
    expect(PRODUCTION_KANBAN_EMPTY_STATE.description).not.toContain('제작 후보로 보내');
    expect(PRODUCTION_KANBAN_EMPTY_STATE.steps[0].description).toContain('제작 후보로 표시할 영상');
    expect(PRODUCTION_KANBAN_EMPTY_STATE.steps[1].description).toContain('Cloud DB');
    expect(PRODUCTION_KANBAN_EMPTY_STATE.steps[1].description).toContain('새 YouTube API 호출은 없습니다');
    expect(PRODUCTION_KANBAN_EMPTY_STATE.steps[2].title).toContain('표시하기');
    expect(PRODUCTION_KANBAN_EMPTY_STATE.steps[2].description).toContain('Cloud 발견함');
    expect(PRODUCTION_KANBAN_EMPTY_STATE.steps[2].description).toContain('제작 후보로 표시합니다');
    expect(PRODUCTION_KANBAN_EMPTY_STATE.referenceVaultButton.title).toContain('Cloud DB 조회');
    expect(PRODUCTION_KANBAN_EMPTY_STATE.discoveryLinksButton.title).toContain('자동 수집이나 다운로드는 실행하지 않습니다');
  });

  it('keeps filter empty guidance cautious about cost-bearing scans', () => {
    expect(VIDEO_FILTER_EMPTY_STATE.description).toContain('필터를 낮춰');
    expect(VIDEO_FILTER_EMPTY_STATE.description).toContain('필요할 때만');
    expect(VIDEO_FILTER_EMPTY_STATE.description).toContain('YouTube API를 호출할 수 있습니다');
  });
});

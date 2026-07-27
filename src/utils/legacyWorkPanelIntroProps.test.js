import { describe, expect, it, vi } from 'vitest';

import { getLegacyWorkPanelIntroViewProps } from './legacyWorkPanelIntroProps';

describe('legacyWorkPanelIntroProps utils', () => {
  it('builds legacy work panel intro copy that separates scan from lookup', () => {
    const props = getLegacyWorkPanelIntroViewProps({ apiKey: 'key' });

    expect(props.brandTitle).toBe('타임머신 CRM');
    expect(props.workflowTitle).toBe('오늘의 작업 흐름');
    expect(props.workflowDescription).toBe('채널 등록·선택 → 수집된 영상 정보 확인 → 필요할 때만 새 영상 수집');
    expect(props.workflowSteps).toHaveLength(3);
    expect(props.workflowSteps[1].description).toContain('온라인 저장소(Azure DB)');
    expect(props.workflowSteps[1].description).toContain('새 YouTube API 호출은 없습니다');
    expect(props.workflowSteps[2].description).toContain('YouTube API');
    expect(props.apiKeyInputProps).toMatchObject({
      'aria-label': '댓글 Top 10 조회용 YouTube API Key',
      placeholder: 'YouTube API Key (댓글 스캔에만 필요)',
      type: 'password',
      value: 'key',
    });
  });

  it('connects the API key input without calling the handler eagerly', () => {
    const onChangeApiKey = vi.fn();
    const props = getLegacyWorkPanelIntroViewProps({ onChangeApiKey });

    expect(onChangeApiKey).not.toHaveBeenCalled();
    props.apiKeyInputProps.onChange({ target: { value: 'new-key' } });
    expect(onChangeApiKey).toHaveBeenCalledWith('new-key');
  });
});

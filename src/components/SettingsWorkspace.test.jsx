import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import SettingsWorkspace from './SettingsWorkspace';

describe('SettingsWorkspace', () => {
  it('explains category, Cloud, and API boundaries in one settings screen', () => {
    const html = renderToStaticMarkup(
      <SettingsWorkspace
        apiKey=""
        categorySettingsProps={{
          categories: ['랭킹형', '영화'],
          cloudOnlyTags: ['예능'],
          newCategoryName: '',
          restorableCategories: ['해짜', '예능'],
          setCategories: vi.fn(),
          setNewCategoryName: vi.fn(),
        }}
        deploymentStatusUrl="https://github.com/babooc7579-creator/yt-analyzer/actions"
        diagnostics={{
          apiKeyConfigured: false,
          runtimeError: '',
          syncWarnings: [],
        }}
        functionApiBase="/api"
        onChangeApiKey={vi.fn()}
        onRefreshChannels={vi.fn()}
        refreshingChannels={false}
        savedChannelCount={10}
      />,
    );

    expect(html).toContain('data-testid="creator-route-settings"');
    expect(html).toContain('분야 목록 추가·숨김·이름 변경');
    expect(html).toContain('온라인 저장소(Azure DB)의 채널 10개');
    expect(html).toContain('레이더의 분야 필터는 실제 온라인 저장소(Azure DB)의 채널에 붙은 태그를 자동 집계합니다');
    expect(html).toContain('화면 분야 목록은 브라우저 설정입니다');
    expect(html).toContain('수집 영상 목록 불러오기');
    expect(html).toContain('YouTube API 호출 없음');
    expect(html).toContain('새 영상 수집, 채널 정보 확인·등록, 댓글 Top 10은 YouTube API를 사용할 수 있습니다');
    expect(html).not.toContain('새 영상 수집만 YouTube API를 사용합니다');
    expect(html).toContain('/api');
    expect(html).toContain('댓글 Top 10용 YouTube API Key');
    expect(html).toContain('새로고침하면 사라지며 온라인 저장소(Azure DB), localStorage, 저장소에 저장하지 않습니다');
    expect(html).toContain('현재 영상 판단 기록과 스크랩북 동기화 경고가 없습니다');
    expect(html).toContain('현재 화면에서 보고된 오류가 없습니다');
    expect(html).toContain('GitHub Actions에서 배포 상태 확인');
    expect(html).toContain('온라인 저장소(Azure DB)의 채널 다시 불러오기');
    expect(html).toContain('숨긴 분야 다시 표시');
    expect(html).toContain('이 브라우저의 화면 목록에만 복원합니다');
    expect(html).toContain('즐겨찾기 추가·숨김·순서 변경');
    expect(html).toContain('변경사항 저장');
    expect(html).toContain('업무 도구함에서 확인');
  });

  it('shows Cloud sync warnings and the current runtime error without making requests', () => {
    const html = renderToStaticMarkup(
      <SettingsWorkspace
        apiKey="configured-key"
        categorySettingsProps={{ categories: [], cloudOnlyTags: [] }}
        deploymentStatusUrl="https://github.com/babooc7579-creator/yt-analyzer/actions"
        diagnostics={{
          apiKeyConfigured: true,
          errorGuidance: {
            title: '온라인 저장 API(Azure)가 요청을 처리하지 못했습니다',
            description: '잠시 뒤 다시 시도하세요.',
          },
          runtimeError: '수집 영상 요청 실패',
          syncWarnings: ['온라인 저장소(Azure DB) 연결 실패로 임시 기록 표시 중'],
        }}
        functionApiBase="/api"
        onChangeApiKey={vi.fn()}
        onRefreshChannels={vi.fn()}
        refreshingChannels={true}
        savedChannelCount={0}
      />,
    );

    expect(html).toContain('입력됨');
    expect(html).toContain('온라인 저장소(Azure DB) 연결 실패로 임시 기록 표시 중');
    expect(html).toContain('수집 영상 요청 실패');
    expect(html).toContain('type="password"');
    expect(html).toContain('새로고침하면 사라지며 온라인 저장소(Azure DB), localStorage, 저장소에 저장하지 않습니다');
    expect(html).toContain('온라인 저장 API(Azure)가 요청을 처리하지 못했습니다');
    expect(html).toContain('온라인 저장소(Azure DB)의 채널 조회 중');
    expect(html).toContain('w-full');
  });
});

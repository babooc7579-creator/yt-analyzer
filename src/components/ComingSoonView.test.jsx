import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import ComingSoonView from './ComingSoonView';

describe('ComingSoonView', () => {
  it('renders the not-yet-connected notice without implying data work', () => {
    const html = renderToStaticMarkup(
      <ComingSoonView
        item={{
          label: '설정',
          sectionTitle: '운영 설정',
          summary: '나중에 연결될 설정 화면입니다.',
        }}
        onOpenHome={() => 'home'}
      />,
    );

    expect(html).toContain('creator-route-coming-soon');
    expect(html).toContain('운영 설정');
    expect(html).toContain('설정 준비중');
    expect(html).toContain('아직 연결되지 않은 설계 자리입니다');
    expect(html).toContain('새 API 호출');
    expect(html).toContain('DB 변경');
    expect(html).toContain('localStorage 삭제');
    expect(html).toContain('title="오늘의 레이더로 돌아갑니다. 데이터 조회나 저장 작업은 실행하지 않습니다."');
    expect(html).toContain('aria-label="오늘의 레이더로 돌아가기, 데이터 조회나 저장 작업 없음"');
  });

  it('omits the home navigation button when no handler is provided', () => {
    const html = renderToStaticMarkup(
      <ComingSoonView
        item={{
          label: 'API 사용량',
          sectionTitle: '운영 데이터',
        }}
      />,
    );

    expect(html).toContain('API 사용량 준비중');
    expect(html).not.toContain('오늘의 레이더로 돌아가기');
    expect(html).not.toContain('<button');
  });
});

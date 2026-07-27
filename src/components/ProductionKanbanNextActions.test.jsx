import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import ProductionKanbanNextActions from './ProductionKanbanNextActions';

const noop = () => {};

describe('ProductionKanbanNextActions', () => {
  it('renders navigation-only next actions for production work', () => {
    const html = renderToStaticMarkup(
      <ProductionKanbanNextActions
        actions={[
          {
            ariaLabel: '업로드 캘린더 열기, 온라인 저장소(Azure DB) 저장 일정 조회이며 YouTube API 호출 없음',
            iconKey: 'uploadCalendar',
            key: 'upload-calendar',
            label: '업로드 일정 보기',
            onClick: noop,
            title: '업로드 캘린더를 열어 Cloud에 저장된 목표 날짜를 확인합니다. YouTube API를 호출하지 않습니다.',
            variant: 'amber',
          },
          {
            ariaLabel: '수집 영상 목록 화면 열기, 온라인 저장소(Azure DB) 조회이며 YouTube API 호출 없음',
            iconKey: 'referenceVault',
            key: 'reference-vault',
            label: '수집 영상 더 보기',
            onClick: noop,
            title: '수집 영상 목록 화면을 엽니다. 온라인 저장소(Azure DB)에 보관된 수집 영상 정보를 조회하며 YouTube API를 새로 호출하지 않습니다.',
            variant: 'indigo',
          },
          {
            ariaLabel: '발견함 열기, 외부 자동 수집이나 다운로드 없음',
            iconKey: 'discoveryLinks',
            key: 'discovery-links',
            label: '발견함 링크 정리',
            onClick: noop,
            title: '발견함을 열어 링크 후보를 확인합니다. 외부 자동 수집이나 다운로드는 실행하지 않습니다.',
            variant: 'secondary',
          },
        ]}
      />,
    );

    expect(html).toContain('다음 행동');
    expect(html).toContain('화면 이동만으로 YouTube API나 외부 자동 수집은 실행하지 않습니다.');
    expect(html).toContain('업로드 일정 보기');
    expect(html).toContain('Cloud에 저장된 목표 날짜');
    expect(html).toContain('수집 영상 더 보기');
    expect(html).toContain('온라인 저장소(Azure DB)에 보관된 수집 영상 정보를 조회하며 YouTube API를 새로 호출하지 않습니다.');
    expect(html).toContain('발견함 링크 정리');
    expect(html).toContain('외부 자동 수집이나 다운로드는 실행하지 않습니다.');
  });
});

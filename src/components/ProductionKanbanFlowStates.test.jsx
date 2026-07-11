import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { PRODUCTION_STATUS } from '../constants/status';
import ProductionKanbanEmptyState from './ProductionKanbanEmptyState';
import ProductionVideoMoveStatus from './ProductionVideoMoveStatus';
import ProductionVideoSaveStatus from './ProductionVideoSaveStatus';

const noop = () => {};

describe('Production kanban flow states', () => {
  it('renders empty state with safe navigation to radar, stored videos, and discovery links', () => {
    const html = renderToStaticMarkup(
      <ProductionKanbanEmptyState
        onOpenDiscoveryLinks={noop}
        onOpenHome={noop}
        onOpenReferenceVault={noop}
      />,
    );

    expect(html).toContain('아직 제작 후보가 없습니다');
    expect(html).toContain('오늘 레이더로');
    expect(html).toContain('저장 영상 탐색');
    expect(html).toContain('발견 링크 저장');
    expect(html).toContain('Cloud DB 조회이며 YouTube API를 새로 호출하지 않습니다.');
    expect(html).toContain('외부 사이트 자동 수집이나 다운로드는 실행하지 않습니다.');
  });

  it('renders production move failure as not saved instead of silently completing', () => {
    const html = renderToStaticMarkup(
      <ProductionVideoMoveStatus
        columnId={PRODUCTION_STATUS.ACTIVE}
        moveState="error"
      />,
    );

    expect(html).toContain('Cloud 상태 저장 실패. 저장 완료 처리하지 않았습니다. 다시 눌러 주세요.');
  });

  it('renders draft save success and failure messages separately', () => {
    const successHtml = renderToStaticMarkup(<ProductionVideoSaveStatus saveState="saved" />);
    const errorHtml = renderToStaticMarkup(<ProductionVideoSaveStatus saveState="error" />);

    expect(successHtml).toContain('Cloud에 저장됐습니다.');
    expect(errorHtml).toContain('Cloud 저장 실패. 저장 완료 처리하지 않았습니다. 다시 저장해 주세요.');
  });
});

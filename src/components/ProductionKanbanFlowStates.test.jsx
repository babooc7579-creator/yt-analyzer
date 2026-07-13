import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { PRODUCTION_STATUS } from '../constants/status';
import ProductionDiscoveryLinksSection from './ProductionDiscoveryLinksSection';
import ProductionKanban from './ProductionKanban';
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

  it('renders discovery link candidate count separately from video candidates', () => {
    const html = renderToStaticMarkup(
      <ProductionDiscoveryLinksSection
        linkMoveStates={{}}
        links={[
          { id: 'link-1', rightsStatus: 'needs_check', title: '첫 번째 링크', updatedAt: '2026-07-10T00:00:00.000Z', url: 'https://example.com/1' },
          { id: 'link-2', title: '두 번째 링크', updatedAt: '2026-07-12T00:00:00.000Z', url: 'https://example.com/2' },
          { id: 'link-3', rightsStatus: 'do_not_use', title: '세 번째 링크', updatedAt: '2026-07-09T00:00:00.000Z', url: 'https://example.com/3' },
        ]}
        onMoveLink={noop}
        onOpenDiscoveryLinks={noop}
      />,
    );

    expect(html).toContain('링크 후보 3개');
    expect(html).toContain('Cloud 발견함에서 제작 후보로 표시한 외부 링크 수입니다. 영상 후보와 별도로 표시합니다.');
    expect(html).toContain('먼저 처리할 권리 확인 링크 2개가 위에 표시됩니다.');
    expect(html).toContain('별도 제작 DB');
    expect(html).toContain('자동 수집이나 다운로드는 실행하지 않습니다.');
    expect(html).toContain('링크 후보 확인 순서');
    expect(html).toContain('원본 열기나 링크 복사로 직접 확인합니다');
    expect(html).toContain('권리 확인 후 사용');
    expect(html).toContain('다음 행동: 원본 링크 열기');
    expect(html).toContain('사용 금지 표시');
    expect(html).toContain('다음 행동: 제작 후보에서 제외');
    expect(html).toContain('링크 기록은 삭제하지 않습니다');
    expect(html.indexOf('세 번째 링크')).toBeLessThan(html.indexOf('첫 번째 링크'));
    expect(html.indexOf('첫 번째 링크')).toBeLessThan(html.indexOf('두 번째 링크'));
  });

  it('opens with a calendar item search without changing production records', () => {
    const html = renderToStaticMarkup(
      <ProductionKanban
        initialSearchQuery="예약 영상"
        initialSearchSource="upload-calendar"
        initialTargetVideoId="v1"
        onMoveVideo={noop}
        onOpenDiscoveryLinks={noop}
        onOpenHome={noop}
        onOpenReferenceVault={noop}
        onOpenUploadCalendar={noop}
        onUpdateDiscoveryLink={noop}
        onUpdateVideoRecord={noop}
        videoUserRecords={{
          v1: { statusIds: [PRODUCTION_STATUS.CANDIDATE] },
          v2: { statusIds: [PRODUCTION_STATUS.CANDIDATE] },
        }}
        videos={[
          { videoId: 'v1', title: '예약 영상' },
          { videoId: 'v2', title: '예약 영상' },
        ]}
      />,
    );

    expect(html).toContain('value="예약 영상"');
    expect(html).toContain('캘린더에서 가져온 검색');
    expect(html).toContain('영상 한 건을 찾고 있습니다');
    expect(html).toContain('캘린더로 돌아가기');
    expect((html.match(/예약 영상/g) || []).length).toBeGreaterThan(0);
    expect(html).not.toContain('video-2');
  });
});

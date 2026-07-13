import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { PRODUCTION_FOCUS_COLUMN_ID } from '../constants/productionKanban';
import { PRODUCTION_STATUS } from '../constants/status';
import ProductionVideoMoveActions from './ProductionVideoMoveActions';

describe('ProductionVideoMoveActions', () => {
  it('renders non-current production move actions as Cloud record updates without YouTube API calls', () => {
    const html = renderToStaticMarkup(
      <ProductionVideoMoveActions
        columnId={PRODUCTION_STATUS.CANDIDATE}
        isMoving={false}
        onFocus={() => 'focus video'}
        onMove={() => 'move video'}
        record={{}}
        video={{ videoId: 'video-1' }}
        videoTitle="검토할 영상"
      />,
    );

    expect(html).not.toContain('제작 후보로');
    expect(html).toContain('오늘 집중');
    expect(html).toContain('제작 중으로');
    expect(html).toContain('업로드 완료');
    expect(html).toContain('검토할 영상 제작 중 상태로 변경, Cloud 판단 기록 저장, YouTube API 호출 없음');
    expect(html).toContain('제작 진행 상태를 업로드 완료로 변경하고 완료일을 Cloud 판단 기록에 저장합니다. YouTube API를 새로 호출하지 않습니다.');
    expect(html).not.toContain('disabled=""');
  });

  it('renders a focus release action for a pinned production candidate', () => {
    const html = renderToStaticMarkup(
      <ProductionVideoMoveActions
        columnId={PRODUCTION_FOCUS_COLUMN_ID}
        isMoving={false}
        onFocus={() => 'focus video'}
        onMove={() => 'move video'}
        record={{ focusPinnedAt: '2026-07-13T09:00:00.000Z' }}
        video={{ videoId: 'video-1' }}
        videoTitle="오늘 영상"
      />,
    );

    expect(html).toContain('집중 해제');
    expect(html).toContain('오늘 집중 고정만 해제하고 제작 후보 상태는 유지합니다');
    expect(html).toContain('제작 중으로');
    expect(html).toContain('업로드 완료');
  });

  it('disables all move actions when the video has no id', () => {
    const html = renderToStaticMarkup(
      <ProductionVideoMoveActions
        columnId={PRODUCTION_STATUS.DONE}
        isMoving={false}
        onMove={() => 'move video'}
        record={{}}
        video={{}}
        videoTitle="임시 영상"
      />,
    );

    expect(html).toContain('제작 후보로');
    expect(html).toContain('제작 중으로');
    expect(html).not.toContain('업로드 완료');
    expect(html.match(/disabled=""/g)).toHaveLength(2);
  });

  it('renders moving labels and disables actions while a Cloud update is running', () => {
    const html = renderToStaticMarkup(
      <ProductionVideoMoveActions
        columnId={PRODUCTION_STATUS.ACTIVE}
        isMoving
        onMove={() => 'move video'}
        record={{}}
        video={{ videoId: 'video-1' }}
        videoTitle="검토할 영상"
      />,
    );

    expect(html.match(/변경 중.../g)).toHaveLength(2);
    expect(html.match(/disabled=""/g)).toHaveLength(2);
  });
});

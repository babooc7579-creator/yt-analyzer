import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { PRODUCTION_STATUS } from '../constants/status';
import ProductionVideoCard from './ProductionVideoCard';

describe('ProductionVideoCard workflow', () => {
  const renderCard = () => renderToStaticMarkup(
    <ProductionVideoCard
      columnId={PRODUCTION_STATUS.CANDIDATE}
      isDirty
      moveState=""
      onFocus={() => {}}
      onMove={() => {}}
      onSave={() => {}}
      onUpdateDraft={() => {}}
      record={{
        draftTitle: '내 영상 제목',
        note: '첫 장면을 빠르게 보여주기',
        targetPublishDate: '2026-07-30',
      }}
      saveState=""
      scheduleSignal={{ label: '일정 있음', tone: 'bg-emerald-50 text-emerald-700' }}
      video={{
        channelTitle: '참고 채널',
        multiplier: 3.2,
        thumbnail: 'https://example.com/thumb.jpg',
        title: '참고할 원본 영상',
        videoId: 'video-1',
      }}
    />,
  );

  it('renders the production work in source, draft, and next-stage order', () => {
    const html = renderCard();
    const sourceStepIndex = html.indexOf('1. 원본 확인');
    const draftStepIndex = html.indexOf('2. 제작안 작성 · Cloud 저장');
    const moveStepIndex = html.indexOf('3. 다음 제작 단계 선택');

    expect(sourceStepIndex).toBeGreaterThan(-1);
    expect(draftStepIndex).toBeGreaterThan(sourceStepIndex);
    expect(moveStepIndex).toBeGreaterThan(draftStepIndex);
    expect(html).toContain('원본 보기');
    expect(html).toContain('작업 묶음 복사');
    expect(html).toContain('URL 복사');
    expect(html).toContain('업로드 26.07.30');
    expect(html).toContain('작업 준비 완료');
    expect(html).toContain('저장 전');
    expect(html).toContain('Cloud 저장 · API 호출 없음');
    expect(html).toContain('오늘 집중과 제작 상태 변경은 Cloud 판단 기록에 저장합니다.');
  });

  it('opens the same YouTube source from both the thumbnail and title', () => {
    const html = renderCard();

    expect(html.match(/href="https:\/\/youtube.com\/watch\?v=video-1"/g)).toHaveLength(3);
    expect(html.match(/aria-label="참고할 원본 영상 YouTube 원본 영상 열기"/g)).toHaveLength(2);
  });
});

import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import RadarCandidateDecisionActions from './RadarCandidateDecisionActions';

const noop = () => {};

describe('RadarCandidateDecisionActions', () => {
  it('puts the production decision before secondary review actions', () => {
    const html = renderToStaticMarkup(
      <RadarCandidateDecisionActions
        isSaved={false}
        onMarkVideoStatus={noop}
        onPromoteToProduction={noop}
        onToggleScrap={noop}
        pendingAction=""
        video={{ videoId: 'video-1', title: '판단할 영상' }}
        videoTitle="판단할 영상"
      />,
    );

    expect(html).toContain('2. 판단을 저장하세요');
    expect(html).toContain('다음 후보가 자동으로 이어집니다');
    expect(html).toContain('아직 만들지 않을 영상');
    expect(html.indexOf('제작 후보로')).toBeLessThan(html.indexOf('소재 보관'));
    expect(html.indexOf('소재 보관')).toBeLessThan(html.indexOf('봤음'));
    expect(html).toContain('나중에 보기');
    expect(html).toContain('후보에서 제외');
  });

  it('shows a single Cloud save status while every decision is locked', () => {
    const html = renderToStaticMarkup(
      <RadarCandidateDecisionActions
        isSaved={false}
        onMarkVideoStatus={noop}
        onPromoteToProduction={noop}
        onToggleScrap={noop}
        pendingAction="production"
        video={{ videoId: 'video-1', title: '저장 중 영상' }}
        videoTitle="저장 중 영상"
      />,
    );

    expect(html).toContain('스크랩북 보관과 제작 후보 표시를 온라인 저장소(Azure DB)에 저장하는 중입니다');
    expect(html.match(/disabled=""/g)).toHaveLength(5);
  });
});

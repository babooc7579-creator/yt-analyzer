import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import VideoListRowBadges from './VideoListRowBadges';

describe('VideoListRowBadges', () => {
  it('renders visible badge labels with explanatory titles', () => {
    const html = renderToStaticMarkup(
      <VideoListRowBadges
        isChecked
        isProductionCandidate
        isSaved
        isStrongReaction
        isTtoTto
      />,
    );

    expect(html).toContain('스크랩북 보관');
    expect(html).toContain('온라인 스크랩북(Azure DB)에 보관된 영상입니다. 제작 후보 여부와는 별도입니다.');
    expect(html).toContain('제작 후보');
    expect(html).toContain('제작 후보함에 표시됩니다.');
    expect(html).toContain('또터또 후보');
    expect(html).toContain('성공 예측이 아닙니다.');
  });
});

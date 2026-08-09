import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import ReferenceVaultSummary from './ReferenceVaultSummary';

describe('ReferenceVaultSummary', () => {
  it('shows the selected channel names and summarizes the remaining scope', () => {
    const html = renderToStaticMarkup(
      <ReferenceVaultSummary
        channelCount={21}
        scrapCount={1}
        onChangeSelectedChannels={() => {}}
        selectedChannelCount={7}
        selectedChannelScopes={[
          { id: '1', title: 'TechByTosh', videoCount: 95 },
          { id: '2', title: 'David Fortin', videoCount: 251 },
          { id: '3', title: 'Kevin Stratvert', videoCount: 120 },
          { id: '4', title: 'The AI Productivity Coach', videoCount: 80 },
          { id: '5', title: 'Mike Tholfsen', videoCount: 70 },
          { id: '6', title: 'Scott Brant', videoCount: 40 },
          { id: '7', title: 'Office Skills with Amy', videoCount: 30 },
        ]}
        selectedChannelTitles={[
          'TechByTosh',
          'David Fortin',
          'Kevin Stratvert',
          'The AI Productivity Coach',
          'Mike Tholfsen',
          'Scott Brant',
          'Office Skills with Amy',
        ]}
        ttoTtoCount={20}
        videoCount={251}
        visibleScrapCount={0}
      />,
    );

    expect(html).toContain('현재 수집 영상 조회 대상 채널');
    expect(html).toContain('현재 조회 대상 · 선택 채널 7개');
    expect(html).toContain('TechByTosh');
    expect(html).toContain('95개');
    expect(html).toContain('Mike Tholfsen');
    expect(html).toContain('외 2개');
    expect(html).not.toContain('Scott Brant');
    expect(html).toContain('선택 채널 변경');
    expect(html).toContain('sm:w-auto');
  });

  it('explains that no channel has been selected yet', () => {
    const html = renderToStaticMarkup(
      <ReferenceVaultSummary selectedChannelCount={0} selectedChannelTitles={[]} />,
    );

    expect(html).toContain('현재 조회 대상 · 선택 채널 0개');
    expect(html).toContain('오늘 볼 채널을 선택하면 어떤 채널의 영상인지 여기에 표시됩니다.');
  });
});

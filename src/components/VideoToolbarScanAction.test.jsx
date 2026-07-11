import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import VideoToolbarScanAction from './VideoToolbarScanAction';

describe('VideoToolbarScanAction', () => {
  it('renders selected-channel scan copy as a YouTube API action', () => {
    const html = renderToStaticMarkup(
      <VideoToolbarScanAction
        handleManualScan={() => 'scan'}
        isScanning={false}
        scanTargetCount={2}
        selectedChannelCount={3}
      />,
    );

    expect(html).toContain('선택 채널 새 영상 수집 (2/3개)');
    expect(html).toContain('aria-label="선택 범위 새 영상 수집, YouTube API 호출"');
    expect(html).toContain('체크한 채널 중 운영중 채널만 YouTube API로 새 영상 여부를 확인합니다');
    expect(html).toContain('보류/제외 채널은 수집하지 않습니다');
    expect(html).not.toContain('disabled=""');
  });

  it('renders disabled copy when there are no scan targets', () => {
    const html = renderToStaticMarkup(
      <VideoToolbarScanAction
        handleManualScan={() => 'scan'}
        isScanning={false}
        scanTargetCount={0}
        selectedChannelCount={0}
      />,
    );

    expect(html).toContain('disabled=""');
    expect(html).toContain('전체 운영중 채널 새 영상 수집 (0개)');
    expect(html).toContain('운영중 채널이 0개라 새 영상 수집을 실행하지 않습니다');
    expect(html).toContain('aria-label="새 영상 수집 불가, 운영중 채널 없음"');
  });

  it('renders scanning state while keeping the action disabled', () => {
    const html = renderToStaticMarkup(
      <VideoToolbarScanAction
        handleManualScan={() => 'scan'}
        isScanning
        scanTargetCount={2}
        selectedChannelCount={2}
      />,
    );

    expect(html).toContain('disabled=""');
    expect(html).toContain('새 영상 수집 중...');
    expect(html).toContain('aria-label="선택 범위 새 영상 수집, YouTube API 호출"');
  });
});

import { describe, expect, it } from 'vitest';

import { shouldShowLoginRecovery } from './creatorActionFeedback';

describe('shouldShowLoginRecovery', () => {
  it.each([
    '401 Unauthorized',
    '접근 권한이 없습니다',
    'Failed to fetch',
    'CORS request blocked',
    '네트워크 연결 실패',
  ])('shows recovery for authentication or connection errors: %s', (message) => {
    expect(shouldShowLoginRecovery(message)).toBe(true);
  });

  it.each([
    '',
    '이미 저장된 채널입니다.',
    '채널 URL을 입력해 주세요.',
    '선택한 운영중 채널이 없습니다.',
  ])('does not show recovery for local input guidance: %s', (message) => {
    expect(shouldShowLoginRecovery(message)).toBe(false);
  });
});

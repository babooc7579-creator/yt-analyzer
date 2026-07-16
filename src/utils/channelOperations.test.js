import { describe, expect, it } from 'vitest';

import { CHANNEL_OPERATION_STAGES, getChannelOperationStage } from './channelOperations';

describe('channel operations utils', () => {
  it('keeps the operations workflow in management, registration, and scan order', () => {
    expect(CHANNEL_OPERATION_STAGES.map((stage) => stage.id)).toEqual(['manage', 'add', 'scan']);
    expect(CHANNEL_OPERATION_STAGES.map((stage) => stage.targetId)).toEqual([
      'channel-operations-manage',
      'channel-operations-add',
      'channel-operations-scan',
    ]);
  });

  it('falls back to channel management for unknown stages', () => {
    expect(getChannelOperationStage('scan').label).toBe('새 영상 수집');
    expect(getChannelOperationStage('unknown').id).toBe('manage');
  });
});

import { beforeEach, describe, expect, it, vi } from 'vitest';

const { effectCleanups, refs, stateSetters } = vi.hoisted(() => ({
  effectCleanups: [],
  refs: [],
  stateSetters: [],
}));

vi.mock('react', () => ({
  useEffect: vi.fn((effect) => {
    const cleanup = effect();
    if (typeof cleanup === 'function') effectCleanups.push(cleanup);
  }),
  useRef: vi.fn((initialValue) => {
    const ref = { current: initialValue };
    refs.push(ref);
    return ref;
  }),
  useState: vi.fn((initialValue) => {
    const setter = vi.fn();
    stateSetters.push(setter);
    return [initialValue, setter];
  }),
}));

vi.mock('../utils/clipboard', () => ({
  copyTextToClipboard: vi.fn(() => Promise.resolve()),
}));

vi.mock('../utils/prompts', () => ({
  buildAIRemakePrompt: vi.fn(() => 'AI remake prompt'),
}));

import { copyTextToClipboard } from '../utils/clipboard';
import { buildAIRemakePrompt } from '../utils/prompts';
import { useVideoSelection } from './useVideoSelection';

const installTimerMocks = () => {
  const clearTimeoutMock = vi.fn();
  const setTimeoutMock = vi.fn(() => 123);

  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      clearTimeout: clearTimeoutMock,
      setTimeout: setTimeoutMock,
    },
  });

  return { clearTimeoutMock, setTimeoutMock };
};

describe('useVideoSelection', () => {
  beforeEach(() => {
    effectCleanups.length = 0;
    refs.length = 0;
    stateSetters.length = 0;
    vi.clearAllMocks();
    installTimerMocks();
  });

  it('initializes selection and copy feedback state with safe defaults', () => {
    const selection = useVideoSelection();

    expect(selection.checkedVideos).toEqual([]);
    expect(selection.copiedPrompt).toBe(false);
    expect(selection.promptCopyError).toBe(false);
  });

  it('clears checked videos and toggles video selection through the list updater', () => {
    const selection = useVideoSelection();

    selection.clearCheckedVideos();
    expect(stateSetters[0]).toHaveBeenCalledWith([]);

    selection.toggleCheckVideo('video-1');
    expect(stateSetters[0]).toHaveBeenLastCalledWith(expect.any(Function));

    const updater = stateSetters[0].mock.calls.at(-1)[0];
    expect(updater([])).toEqual(['video-1']);
    expect(updater(['video-1', 'video-2'])).toEqual(['video-2']);
  });

  it('skips prompt copy when no target videos are selected', async () => {
    const selection = useVideoSelection();

    await expect(selection.copyPromptForVideos([])).resolves.toBe(false);

    expect(buildAIRemakePrompt).not.toHaveBeenCalled();
    expect(copyTextToClipboard).not.toHaveBeenCalled();
  });

  it('copies the generated AI prompt and schedules success feedback reset', async () => {
    const { setTimeoutMock } = installTimerMocks();
    const selection = useVideoSelection();
    const targetVideos = [{ videoId: 'video-1', title: 'Clip' }];

    await expect(selection.copyPromptForVideos(targetVideos)).resolves.toBe(true);

    expect(buildAIRemakePrompt).toHaveBeenCalledWith(targetVideos);
    expect(copyTextToClipboard).toHaveBeenCalledWith('AI remake prompt');
    expect(stateSetters[1]).toHaveBeenCalledWith(true);
    expect(stateSetters[2]).toHaveBeenCalledWith(false);
    expect(setTimeoutMock).toHaveBeenCalledWith(expect.any(Function), 3000);
    expect(refs.at(-1).current).toBe(123);

    const resetFeedback = setTimeoutMock.mock.calls[0][0];
    resetFeedback();
    expect(stateSetters[1]).toHaveBeenLastCalledWith(false);
    expect(stateSetters[2]).toHaveBeenLastCalledWith(false);
  });

  it('sets copy error feedback when clipboard copy fails', async () => {
    copyTextToClipboard.mockRejectedValueOnce(new Error('copy failed'));
    const selection = useVideoSelection();

    await expect(selection.copyPromptForVideos([{ videoId: 'video-1' }])).resolves.toBe(false);

    expect(stateSetters[1]).toHaveBeenCalledWith(false);
    expect(stateSetters[2]).toHaveBeenCalledWith(true);
  });

  it('clears an existing feedback timer before scheduling a new one and on cleanup', async () => {
    const { clearTimeoutMock } = installTimerMocks();
    const selection = useVideoSelection();
    refs.at(-1).current = 456;

    await selection.copyPromptForVideos([{ videoId: 'video-1' }]);

    expect(clearTimeoutMock).toHaveBeenCalledWith(456);
    effectCleanups.at(-1)();
    expect(clearTimeoutMock).toHaveBeenLastCalledWith(123);
  });
});

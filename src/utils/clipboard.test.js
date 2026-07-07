import { afterEach, describe, expect, it, vi } from 'vitest';

import { copyTextToClipboard } from './clipboard';

const createFakeDocument = ({ execResult = true } = {}) => {
  const textarea = {
    setAttribute: vi.fn(),
    select: vi.fn(),
    style: {},
    value: '',
  };
  const appendChild = vi.fn();
  const removeChild = vi.fn();
  const execCommand = vi.fn(() => execResult);

  return {
    appendChild,
    execCommand,
    fakeDocument: {
      body: {
        appendChild,
        removeChild,
      },
      createElement: vi.fn(() => textarea),
      execCommand,
    },
    removeChild,
    textarea,
  };
};

describe('clipboard utils', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('throws copy_failed for empty text', async () => {
    await expect(copyTextToClipboard('')).rejects.toThrow('copy_failed');
  });

  it('uses navigator clipboard writeText when available', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', {
      clipboard: {
        writeText,
      },
    });

    await expect(copyTextToClipboard('hello')).resolves.toBeUndefined();

    expect(writeText).toHaveBeenCalledWith('hello');
  });

  it('falls back to textarea copy when clipboard API is blocked', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('blocked'));
    const {
      appendChild,
      fakeDocument,
      removeChild,
      textarea,
    } = createFakeDocument({ execResult: true });
    vi.stubGlobal('navigator', {
      clipboard: {
        writeText,
      },
    });
    vi.stubGlobal('document', fakeDocument);

    await expect(copyTextToClipboard('fallback text')).resolves.toBeUndefined();

    expect(writeText).toHaveBeenCalledWith('fallback text');
    expect(fakeDocument.createElement).toHaveBeenCalledWith('textarea');
    expect(textarea.value).toBe('fallback text');
    expect(textarea.setAttribute).toHaveBeenCalledWith('readonly', '');
    expect(textarea.style.position).toBe('fixed');
    expect(textarea.style.opacity).toBe('0');
    expect(appendChild).toHaveBeenCalledWith(textarea);
    expect(textarea.select).toHaveBeenCalledTimes(1);
    expect(fakeDocument.execCommand).toHaveBeenCalledWith('copy');
    expect(removeChild).toHaveBeenCalledWith(textarea);
  });

  it('throws copy_failed when fallback copy fails', async () => {
    const { fakeDocument, textarea, removeChild } = createFakeDocument({ execResult: false });
    vi.stubGlobal('navigator', {});
    vi.stubGlobal('document', fakeDocument);

    await expect(copyTextToClipboard('cannot copy')).rejects.toThrow('copy_failed');

    expect(textarea.select).toHaveBeenCalledTimes(1);
    expect(removeChild).toHaveBeenCalledWith(textarea);
  });
});

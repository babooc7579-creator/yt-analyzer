import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import ChannelBulkInputBox from './ChannelBulkInputBox';
import ChannelLanguageSelect from './ChannelLanguageSelect';
import ChannelPreviewInput from './ChannelPreviewInput';
import ChannelPreviewNoteField from './ChannelPreviewNoteField';

const expectVisibleLightControl = (markup) => {
  expect(markup).toContain('bg-white');
  expect(markup).toContain('text-slate-900');
};

describe('channel registration form input visibility', () => {
  it('keeps the typed channel value visible on the light input background', () => {
    const markup = renderToStaticMarkup(
      <ChannelPreviewInput
        handlePreviewChannel={vi.fn()}
        newChannelInput="@visible-channel"
        previewLoading={false}
        setNewChannelInput={vi.fn()}
      />,
    );

    expect(markup).toContain('value="@visible-channel"');
    expectVisibleLightControl(markup);
    expect(markup).toContain('placeholder:text-slate-400');
    expect(markup).not.toContain('disabled=""');
    expect(markup).toContain('flex flex-col gap-2 sm:flex-row');
    expect(markup).toContain('min-w-0 w-full');
    expect(markup).toContain('sm:w-auto');
  });

  it('disables YouTube confirmation until a channel value is entered', () => {
    const markup = renderToStaticMarkup(
      <ChannelPreviewInput
        handlePreviewChannel={vi.fn()}
        newChannelInput="   "
        previewLoading={false}
        setNewChannelInput={vi.fn()}
      />,
    );

    expect(markup).toContain('disabled=""');
    expect(markup).toContain('채널 정보를 입력하면 YouTube에서 정보만 확인할 수 있습니다');
    expect(markup).toContain('입력만으로 API 호출이나 저장은 실행되지 않습니다');
  });

  it('keeps the bulk input, note, and language controls readable', () => {
    const controls = [
      renderToStaticMarkup(
        <ChannelBulkInputBox
          bulkInput="@first-channel"
          bulkLoading={false}
          recognizedLineCount={1}
          setBulkInput={vi.fn()}
        />,
      ),
      renderToStaticMarkup(
        <ChannelPreviewNoteField note="reference note" setNote={vi.fn()} />,
      ),
      renderToStaticMarkup(
        <ChannelLanguageSelect language="ko" setLanguage={vi.fn()} />,
      ),
    ];

    controls.forEach(expectVisibleLightControl);
  });
});

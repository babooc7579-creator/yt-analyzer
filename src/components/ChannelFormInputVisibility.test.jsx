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

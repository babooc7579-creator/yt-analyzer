import { describe, expect, it } from 'vitest';

import viteConfig from '../vite.config.js';

describe('Vite production chunk configuration', () => {
  it('keeps React and UI icons in stable vendor chunks', () => {
    expect(viteConfig.build?.rollupOptions?.output?.manualChunks).toEqual({
      'react-vendor': ['react', 'react-dom'],
      'ui-icons': ['lucide-react'],
    });
  });
});

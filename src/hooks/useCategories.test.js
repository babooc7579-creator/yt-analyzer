import { beforeEach, describe, expect, it, vi } from 'vitest';

const { readJsonStorageMock, stateSetters, writeJsonStorageMock } = vi.hoisted(() => ({
  readJsonStorageMock: vi.fn(() => ['뉴스', '예능']),
  stateSetters: [],
  writeJsonStorageMock: vi.fn(() => true),
}));

vi.mock('react', () => ({
  useEffect: vi.fn((effect) => effect()),
  useState: vi.fn((initialValue) => {
    const setter = vi.fn();
    stateSetters.push(setter);

    return [
      typeof initialValue === 'function' ? initialValue() : initialValue,
      setter,
    ];
  }),
}));

vi.mock('../services/storage', () => ({
  STORAGE_KEYS: {
    categories: 'yt_crm_categories',
  },
  readJsonStorage: readJsonStorageMock,
  writeJsonStorage: writeJsonStorageMock,
}));

import { useEffect, useState } from 'react';
import { DEFAULT_CATEGORIES } from '../constants/categories';
import { STORAGE_KEYS, readJsonStorage, writeJsonStorage } from '../services/storage';
import { useCategories } from './useCategories';

describe('useCategories', () => {
  beforeEach(() => {
    stateSetters.length = 0;
    readJsonStorageMock.mockReturnValue(['뉴스', '예능']);
    writeJsonStorageMock.mockReturnValue(true);
    vi.clearAllMocks();
  });

  it('loads category names from the existing browser cache and writes the current list back', () => {
    const categoriesHook = useCategories();

    expect(useState).toHaveBeenCalledWith(expect.any(Function));
    expect(readJsonStorage).toHaveBeenCalledWith(STORAGE_KEYS.categories, DEFAULT_CATEGORIES);
    expect(categoriesHook.categories).toEqual(['뉴스', '예능']);
    expect(categoriesHook.setCategories).toBe(stateSetters[0]);
    expect(useEffect).toHaveBeenCalledWith(expect.any(Function), [['뉴스', '예능']]);
    expect(writeJsonStorage).toHaveBeenCalledWith(STORAGE_KEYS.categories, ['뉴스', '예능']);
  });

  it('falls back to default categories when browser cache has no valid list', () => {
    readJsonStorageMock.mockReturnValueOnce(null);

    const categoriesHook = useCategories();

    expect(categoriesHook.categories).toBe(DEFAULT_CATEGORIES);
    expect(writeJsonStorage).toHaveBeenCalledWith(STORAGE_KEYS.categories, DEFAULT_CATEGORIES);
  });
});

import { useEffect, useState } from 'react';
import { DEFAULT_CATEGORIES } from '../constants/categories';
import { STORAGE_KEYS, readJsonStorage, writeJsonStorage } from '../services/storage';

export function useCategories() {
  const [categories, setCategories] = useState(() => (
    readJsonStorage(STORAGE_KEYS.categories, DEFAULT_CATEGORIES) || DEFAULT_CATEGORIES
  ));

  useEffect(() => {
    writeJsonStorage(STORAGE_KEYS.categories, categories);
  }, [categories]);

  return {
    categories,
    setCategories,
  };
}

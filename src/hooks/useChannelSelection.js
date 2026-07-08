import { useState } from 'react';
import { toggleListValue } from '../utils/selection';

export function useChannelSelection(initialCategory) {
  const [selectedCategoryTab, setSelectedCategoryTab] = useState(initialCategory);
  const [selectedChannelIds, setSelectedChannelIds] = useState([]);

  const toggleChannelSelection = (channelId) => {
    setSelectedChannelIds((prev) => toggleListValue(prev, channelId));
  };

  return {
    selectedCategoryTab,
    selectedChannelIds,
    setSelectedCategoryTab,
    setSelectedChannelIds,
    toggleChannelSelection,
  };
}

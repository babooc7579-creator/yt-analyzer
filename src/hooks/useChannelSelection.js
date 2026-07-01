import { useState } from 'react';

export function useChannelSelection(initialCategory) {
  const [selectedCategoryTab, setSelectedCategoryTab] = useState(initialCategory);
  const [selectedChannelIds, setSelectedChannelIds] = useState([]);

  const toggleChannelSelection = (channelId) => {
    setSelectedChannelIds(prev => (
      prev.includes(channelId)
        ? prev.filter(selectedId => selectedId !== channelId)
        : [...prev, channelId]
    ));
  };

  return {
    selectedCategoryTab,
    selectedChannelIds,
    setSelectedCategoryTab,
    setSelectedChannelIds,
    toggleChannelSelection,
  };
}

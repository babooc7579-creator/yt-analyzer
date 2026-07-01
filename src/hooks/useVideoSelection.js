import { useState } from 'react';
import { buildAIRemakePrompt } from '../utils/prompts';

export function useVideoSelection() {
  const [checkedVideos, setCheckedVideos] = useState([]);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const clearCheckedVideos = () => {
    setCheckedVideos([]);
  };

  const toggleCheckVideo = (videoId) => {
    setCheckedVideos(prev => (
      prev.includes(videoId)
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    ));
  };

  const copyPromptForVideos = (targetVideos) => {
    if (targetVideos.length === 0) return;

    navigator.clipboard.writeText(buildAIRemakePrompt(targetVideos));
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 3000);
  };

  return {
    checkedVideos,
    clearCheckedVideos,
    copiedPrompt,
    copyPromptForVideos,
    toggleCheckVideo,
  };
}

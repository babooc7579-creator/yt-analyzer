import { useEffect, useRef, useState } from 'react';
import { copyTextToClipboard } from '../utils/clipboard';
import { buildAIRemakePrompt } from '../utils/prompts';

export function useVideoSelection() {
  const [checkedVideos, setCheckedVideos] = useState([]);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const copiedPromptTimerRef = useRef(null);

  useEffect(() => () => {
    if (copiedPromptTimerRef.current) {
      window.clearTimeout(copiedPromptTimerRef.current);
    }
  }, []);

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

  const copyPromptForVideos = async (targetVideos) => {
    if (!targetVideos?.length) return false;

    try {
      await copyTextToClipboard(buildAIRemakePrompt(targetVideos));
      if (copiedPromptTimerRef.current) {
        window.clearTimeout(copiedPromptTimerRef.current);
      }
      setCopiedPrompt(true);
      copiedPromptTimerRef.current = window.setTimeout(() => setCopiedPrompt(false), 3000);
      return true;
    } catch {
      setCopiedPrompt(false);
      return false;
    }
  };

  return {
    checkedVideos,
    clearCheckedVideos,
    copiedPrompt,
    copyPromptForVideos,
    toggleCheckVideo,
  };
}

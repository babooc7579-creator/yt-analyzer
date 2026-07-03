import { useEffect, useRef, useState } from 'react';
import { copyTextToClipboard } from '../utils/clipboard';
import { buildAIRemakePrompt } from '../utils/prompts';

export function useVideoSelection() {
  const [checkedVideos, setCheckedVideos] = useState([]);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [promptCopyError, setPromptCopyError] = useState(false);
  const promptCopyTimerRef = useRef(null);

  useEffect(() => () => {
    if (promptCopyTimerRef.current) {
      window.clearTimeout(promptCopyTimerRef.current);
    }
  }, []);

  const resetPromptCopyFeedback = () => {
    if (promptCopyTimerRef.current) {
      window.clearTimeout(promptCopyTimerRef.current);
    }
    promptCopyTimerRef.current = window.setTimeout(() => {
      setCopiedPrompt(false);
      setPromptCopyError(false);
    }, 3000);
  };

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
      setCopiedPrompt(true);
      setPromptCopyError(false);
      resetPromptCopyFeedback();
      return true;
    } catch {
      setCopiedPrompt(false);
      setPromptCopyError(true);
      resetPromptCopyFeedback();
      return false;
    }
  };

  return {
    checkedVideos,
    clearCheckedVideos,
    copiedPrompt,
    copyPromptForVideos,
    promptCopyError,
    toggleCheckVideo,
  };
}

import { useMemo, useState } from 'react';
import {
  getNextThumbnailCandidateIndex,
  getYouTubeThumbnailCandidates,
} from '../utils/youtubeThumbnails';

export default function YouTubeThumbnailImage({
  preferredQuality = 'high',
  src = '',
  videoId = '',
  ...imageProps
}) {
  const candidates = useMemo(() => getYouTubeThumbnailCandidates({
    preferredQuality,
    src,
    videoId,
  }), [preferredQuality, src, videoId]);
  const candidateKey = candidates.join('|');
  const [fallbackState, setFallbackState] = useState({ candidateKey, index: 0 });
  const currentIndex = fallbackState.candidateKey === candidateKey ? fallbackState.index : 0;

  const handleError = () => {
    const nextIndex = getNextThumbnailCandidateIndex({
      candidateCount: candidates.length,
      currentIndex,
    });

    if (nextIndex === currentIndex) return;
    setFallbackState({ candidateKey, index: nextIndex });
  };

  return (
    <img
      {...imageProps}
      src={candidates[currentIndex] || src}
      onError={handleError}
      decoding="async"
      loading={imageProps.loading || 'lazy'}
    />
  );
}

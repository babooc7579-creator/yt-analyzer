import KeywordExplorerWorkspace from './KeywordExplorerWorkspace';
import { useStoredVideoLoadFeedback } from '../hooks/useStoredVideoLoadFeedback';

export default function CreatorKeywordExplorerRoute(props) {
  const feedback = useStoredVideoLoadFeedback({
    loading: props.loading,
    onLoad: props.onLoadStoredVideos,
    selectionKey: props.selectedChannelKey,
  });

  return <KeywordExplorerWorkspace {...props} {...feedback} />;
}

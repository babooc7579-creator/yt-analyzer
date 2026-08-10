import TtoTtoExplorerWorkspace from './TtoTtoExplorerWorkspace';
import { useStoredVideoLoadFeedback } from '../hooks/useStoredVideoLoadFeedback';

export default function CreatorTtoTtoRoute(props) {
  const feedback = useStoredVideoLoadFeedback({
    loading: props.loading,
    onLoad: props.onLoadStoredVideos,
    selectionKey: props.selectedChannelKey,
    sharedLoadResult: props.storedVideoLoadResult,
  });

  return <TtoTtoExplorerWorkspace {...props} {...feedback} />;
}

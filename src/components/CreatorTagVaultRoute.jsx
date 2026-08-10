import TagVaultWorkspace from './TagVaultWorkspace';
import { useStoredVideoLoadFeedback } from '../hooks/useStoredVideoLoadFeedback';

export default function CreatorTagVaultRoute(props) {
  const feedback = useStoredVideoLoadFeedback({
    loading: props.loading,
    onLoad: props.onLoadStoredVideos,
    selectionKey: props.selectedChannelKey,
    sharedLoadResult: props.storedVideoLoadResult,
  });

  return <TagVaultWorkspace {...props} {...feedback} />;
}

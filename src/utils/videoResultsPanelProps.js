import { REFERENCE_VAULT_EMPTY_STATE } from '../constants/emptyStates';

const toArray = (items) => (Array.isArray(items) ? items : []);
const isFunction = (value) => typeof value === 'function';

export const getReferenceVaultEmptyStateActions = ({
  onOpenAddChannel,
  onOpenHome,
} = {}) => ([
  isFunction(onOpenHome) ? {
    key: 'home',
    iconKey: 'home',
    label: REFERENCE_VAULT_EMPTY_STATE.homeButton.label,
    title: REFERENCE_VAULT_EMPTY_STATE.homeButton.title,
    ariaLabel: REFERENCE_VAULT_EMPTY_STATE.homeButton.ariaLabel,
    onClick: onOpenHome,
  } : null,
  isFunction(onOpenAddChannel) ? {
    key: 'add-channel',
    iconKey: 'add-channel',
    label: REFERENCE_VAULT_EMPTY_STATE.addChannelButton.label,
    title: REFERENCE_VAULT_EMPTY_STATE.addChannelButton.title,
    ariaLabel: REFERENCE_VAULT_EMPTY_STATE.addChannelButton.ariaLabel,
    onClick: onOpenAddChannel,
  } : null,
]).filter(Boolean);

export const getVideoResultsPanelViewProps = ({
  checkedVideos,
  filteredVideos,
  isProductionCandidate,
  isVideoSaved,
  onFetchComments,
  onOpenAddChannel,
  onOpenHome,
  onPromoteToProduction,
  onToggleCheck,
  onToggleScrap,
  showWorkPanel,
  videos,
}) => {
  const checkedVideoList = toArray(checkedVideos);
  const filteredVideoList = toArray(filteredVideos);
  const videoList = toArray(videos);

  const getVideoCardProps = (video, index) => ({
    video,
    rank: index + 1,
    isChecked: checkedVideoList.includes(video.videoId),
    isSaved: isVideoSaved(video.videoId),
    isProductionCandidate: isProductionCandidate(video.videoId),
    showWorkPanel,
    onToggleCheck,
    onToggleScrap,
    onPromoteToProduction,
    onFetchComments,
  });

  return {
    checkedVideoList,
    filteredVideoList,
    getVideoCardProps,
    referenceVaultEmptyStateProps: {
      actions: getReferenceVaultEmptyStateActions({
        onOpenAddChannel,
        onOpenHome,
      }),
    },
    listTableProps: {
      videos: filteredVideoList,
      checkedVideos: checkedVideoList,
      isVideoSaved,
      isProductionCandidate,
      toggleCheckVideo: onToggleCheck,
      toggleScrapVideo: onToggleScrap,
      promoteVideoToProduction: onPromoteToProduction,
      fetchTopComments: onFetchComments,
    },
    videoList,
  };
};

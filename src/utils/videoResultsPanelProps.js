import {
  REFERENCE_VAULT_EMPTY_STATE,
  VIDEO_FILTER_EMPTY_STATE,
} from '../constants/emptyStates';

const toArray = (items) => (Array.isArray(items) ? items : []);
const isFunction = (value) => typeof value === 'function';

export const getReferenceVaultEmptyStateActions = ({
  onOpenChannelWatchlist,
  onOpenHome,
} = {}) => ([
  isFunction(onOpenChannelWatchlist) ? {
    key: 'channel-watchlist',
    iconKey: 'channel-watchlist',
    label: REFERENCE_VAULT_EMPTY_STATE.channelWatchlistButton.label,
    title: REFERENCE_VAULT_EMPTY_STATE.channelWatchlistButton.title,
    ariaLabel: REFERENCE_VAULT_EMPTY_STATE.channelWatchlistButton.ariaLabel,
    onClick: onOpenChannelWatchlist,
  } : null,
  isFunction(onOpenHome) ? {
    key: 'home',
    iconKey: 'home',
    label: REFERENCE_VAULT_EMPTY_STATE.homeButton.label,
    title: REFERENCE_VAULT_EMPTY_STATE.homeButton.title,
    ariaLabel: REFERENCE_VAULT_EMPTY_STATE.homeButton.ariaLabel,
    onClick: onOpenHome,
  } : null,
]).filter(Boolean);

export const getVideoFilterEmptyStateActions = ({
  onResetFilters,
} = {}) => ([
  isFunction(onResetFilters) ? {
    key: 'reset-filters',
    iconKey: 'reset-filters',
    label: VIDEO_FILTER_EMPTY_STATE.resetButton.label,
    title: VIDEO_FILTER_EMPTY_STATE.resetButton.title,
    ariaLabel: VIDEO_FILTER_EMPTY_STATE.resetButton.ariaLabel,
    onClick: onResetFilters,
  } : null,
]).filter(Boolean);

export const getVideoResultsPanelViewProps = ({
  checkedVideos,
  filteredVideos,
  isProductionCandidate,
  isVideoSaved,
  onFetchComments,
  onOpenChannelWatchlist,
  onOpenHome,
  onOpenSelectedScan,
  onLoadStoredVideos,
  onPromoteToProduction,
  onResetFilters,
  onToggleCheck,
  onToggleScrap,
  showWorkPanel,
  selectedChannelCount,
  storedVideoLoadPending,
  storedVideoLoadResult,
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
        onOpenChannelWatchlist,
        onOpenHome,
      }),
      loading: storedVideoLoadPending,
      loadResult: storedVideoLoadResult,
      onLoadStoredVideos,
      onOpenSelectedScan,
      selectedChannelCount,
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
    videoFilterEmptyStateProps: {
      actions: getVideoFilterEmptyStateActions({
        onResetFilters,
      }),
    },
    videoList,
  };
};

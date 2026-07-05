const toArray = (items) => (Array.isArray(items) ? items : []);

export function buildLayoutProps({
  activeCreatorItem,
  addChannelNote,
  changeNoteText,
  closeNotesModal,
  closeTopCommentsModal,
  commentModal,
  creatorView,
  discoveryCandidateCount,
  notesModal,
  openCreatorView,
  savedChannels,
  savedVideos,
  selectedChannelIds,
  syncWarnings,
  videos,
}) {
  const channelList = toArray(savedChannels);
  const savedVideoList = toArray(savedVideos);
  const selectedChannels = toArray(selectedChannelIds);
  const videoList = toArray(videos);

  return {
    activeCreatorItem,
    channelCount: channelList.length,
    commentModal,
    creatorView,
    discoveryCandidateCount,
    notesModal,
    onAddNote: addChannelNote,
    onChangeNoteText: changeNoteText,
    onCloseNotes: closeNotesModal,
    onCloseTopComments: closeTopCommentsModal,
    onOpenCreatorView: openCreatorView,
    savedVideoCount: savedVideoList.length,
    selectedChannelCount: selectedChannels.length,
    syncWarnings,
    videoCount: videoList.length,
  };
}

export function getLegacyAsideProps(props) {
  return {
    checkedVideoCount: props.checkedVideos.length,
    savedVideoCount: props.savedVideos.length,
    selectedChannelCount: props.selectedChannelIds.length,
    videoCount: props.totalVideoCount,
  };
}

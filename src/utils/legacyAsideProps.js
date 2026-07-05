const toArray = (items) => (Array.isArray(items) ? items : []);

export function getLegacyAsideProps(props = {}) {
  return {
    checkedVideoCount: toArray(props.checkedVideos).length,
    savedVideoCount: toArray(props.savedVideos).length,
    selectedChannelCount: toArray(props.selectedChannelIds).length,
    videoCount: props.totalVideoCount,
  };
}

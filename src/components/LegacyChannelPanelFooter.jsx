import LoadStoredVideosButton from './LoadStoredVideosButton';

export default function LegacyChannelPanelFooter({
  error,
  loading,
  onLoadStoredVideos,
  progressMsg,
  selectedChannelCount,
}) {
  return (
    <>
      <LoadStoredVideosButton
        loading={loading}
        selectedChannelCount={selectedChannelCount}
        onLoad={onLoadStoredVideos}
      />
      {error && <p className="mt-2 text-xs text-red-500 text-center">{error}</p>}
      {progressMsg && !error && (
        <p className="mt-2 text-xs text-indigo-600 text-center font-medium">{progressMsg}</p>
      )}
    </>
  );
}

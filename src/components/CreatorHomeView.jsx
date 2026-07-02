import HomeActionShortcuts from './HomeActionShortcuts';
import HomeOperatingGuidelines from './HomeOperatingGuidelines';
import HomeRadarSummary from './HomeRadarSummary';
import RadarCandidateStrip from './RadarCandidateStrip';

export default function CreatorHomeView({
  clearRadarDecisions,
  isVideoSaved,
  latestScanText,
  markRadarVideoStatus,
  openRadarCandidateCount,
  onOpenView,
  productionCandidateCount,
  promoteVideoToProduction,
  restoreVideoToRadar,
  savedChannels,
  savedVideos,
  toggleScrapVideo,
  ttoTtoAssetCount,
  videoUserRecords,
  videos,
}) {
  return (
    <div className="grid grid-cols-1 gap-4 2xl:grid-cols-[1.2fr_0.8fr]">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/30">
        <HomeRadarSummary
          savedChannelCount={savedChannels.length}
          loadedVideoCount={videos.length}
          savedVideoCount={savedVideos.length}
          latestScanText={latestScanText}
          ttoTtoAssetCount={ttoTtoAssetCount}
          openRadarCandidateCount={openRadarCandidateCount}
          productionCandidateCount={productionCandidateCount}
        />

        <RadarCandidateStrip
          videos={videos}
          savedVideos={savedVideos}
          videoUserRecords={videoUserRecords}
          isVideoSaved={isVideoSaved}
          onToggleScrap={toggleScrapVideo}
          onMarkVideoStatus={markRadarVideoStatus}
          onPromoteToProduction={promoteVideoToProduction}
          onRestoreVideo={restoreVideoToRadar}
          onClearDecisions={clearRadarDecisions}
          onOpenVault={() => onOpenView({ id: 'vault-all' })}
          onOpenScrapbook={() => onOpenView({ id: 'studio-scrapbook' })}
        />

        <HomeActionShortcuts
          onOpenAddChannel={() => onOpenView({ id: 'ops-add-channel' })}
          onOpenDiscoveryLinks={() => onOpenView({ id: 'vault-sources' })}
          onOpenSelectedScan={() => onOpenView({ id: 'ops-selected-scan' })}
          onOpenVault={() => onOpenView({ id: 'vault-all' })}
        />
      </section>

      <HomeOperatingGuidelines />
    </div>
  );
}

import { getRadarCandidateTitleLinkViewProps } from '../utils/radarCandidates';

export default function RadarCandidateTitleLink({ videoTitle, videoUrl }) {
  const viewProps = getRadarCandidateTitleLinkViewProps({ videoTitle, videoUrl });

  return (
    <a
      href={viewProps.videoUrl}
      target="_blank"
      rel="noreferrer"
      className="line-clamp-2 text-sm font-extrabold leading-snug text-white hover:text-rose-100"
      title={viewProps.title}
      aria-label={viewProps['aria-label']}
    >
      {viewProps.videoTitle}
    </a>
  );
}

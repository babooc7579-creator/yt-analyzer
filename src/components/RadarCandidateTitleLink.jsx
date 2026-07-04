export default function RadarCandidateTitleLink({ videoTitle, videoUrl }) {
  return (
    <a
      href={videoUrl}
      target="_blank"
      rel="noreferrer"
      className="line-clamp-2 text-sm font-extrabold leading-snug text-white hover:text-rose-100"
      title={videoTitle}
      aria-label={`${videoTitle} YouTube 원본 영상 열기`}
    >
      {videoTitle}
    </a>
  );
}

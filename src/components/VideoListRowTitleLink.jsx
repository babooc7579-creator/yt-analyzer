export default function VideoListRowTitleLink({ videoTitle, videoUrl }) {
  return (
    <a
      href={videoUrl}
      target="_blank"
      rel="noreferrer"
      className="text-base font-extrabold text-slate-900 hover:text-indigo-600 line-clamp-2 leading-snug mb-2"
      title={videoTitle}
      aria-label={`${videoTitle} YouTube 원본 영상 열기`}
    >
      {videoTitle}
    </a>
  );
}

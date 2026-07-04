export default function VideoCardTitleLink({ videoTitle, videoUrl }) {
  return (
    <a
      href={videoUrl}
      target="_blank"
      rel="noreferrer"
      className="line-clamp-2 text-base font-extrabold leading-snug text-slate-900 hover:text-indigo-600"
      title={videoTitle}
      aria-label={`${videoTitle} YouTube 원본 영상 열기`}
    >
      {videoTitle}
    </a>
  );
}

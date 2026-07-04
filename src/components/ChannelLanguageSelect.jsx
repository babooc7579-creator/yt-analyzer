import { LANGUAGES } from '../constants/languages';

export default function ChannelLanguageSelect({
  language,
  setLanguage,
}) {
  return (
    <select
      value={language}
      onChange={(event) => setLanguage(event.target.value)}
      className="w-full text-sm px-2 py-2 bg-white border border-indigo-200 rounded-lg outline-none cursor-pointer font-medium"
      title="채널 기본 언어 선택"
      aria-label="채널 기본 언어 선택"
    >
      {LANGUAGES.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}
    </select>
  );
}

import { LANGUAGES } from '../constants/languages';
import { getChannelLanguageSelectCopy } from '../utils/channelAddCopy';

export default function ChannelLanguageSelect({
  language,
  setLanguage,
}) {
  const copy = getChannelLanguageSelectCopy();

  return (
    <select
      value={language}
      onChange={(event) => setLanguage(event.target.value)}
      className="w-full text-sm px-2 py-2 bg-white border border-indigo-200 rounded-lg outline-none cursor-pointer font-medium"
      title={copy.title}
      aria-label={copy.ariaLabel}
    >
      {LANGUAGES.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}
    </select>
  );
}

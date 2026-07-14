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
      className="w-full cursor-pointer rounded-lg border border-indigo-200 bg-white px-2 py-2 text-sm font-medium text-slate-900 outline-none focus:border-indigo-400"
      title={copy.title}
      aria-label={copy.ariaLabel}
    >
      {LANGUAGES.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}
    </select>
  );
}

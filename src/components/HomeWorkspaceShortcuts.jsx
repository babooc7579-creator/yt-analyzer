import { CalendarDays, Search, Tags } from 'lucide-react';

import { getHomeWorkspaceShortcutItems } from '../utils/homeActionShortcuts';
import HomeActionShortcutButton from './HomeActionShortcutButton';

const HOME_WORKSPACE_SHORTCUT_ICONS = {
  calendar: CalendarDays,
  search: Search,
  tags: Tags,
};

export default function HomeWorkspaceShortcuts({
  onOpenKeywordExplorer,
  onOpenTagVault,
  onOpenUploadCalendar,
}) {
  const shortcuts = getHomeWorkspaceShortcutItems({
    onOpenKeywordExplorer,
    onOpenTagVault,
    onOpenUploadCalendar,
  });

  return (
    <section className="mt-6 border-t border-slate-800 pt-5" aria-labelledby="home-workspace-shortcuts-title">
      <div>
        <p className="text-[11px] font-extrabold text-cyan-300">실사용 도구</p>
        <h3 id="home-workspace-shortcuts-title" className="mt-1 text-base font-black text-white">찾기부터 일정 확인까지 바로 이어가기</h3>
        <p className="mt-1 text-xs leading-5 text-slate-400">
          아래 버튼은 화면만 이동합니다. 자동 수집, Cloud 저장, 상태 변경은 실행하지 않습니다.
        </p>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
        {shortcuts.map(({ key, ...shortcut }) => (
          <HomeActionShortcutButton
            key={key}
            {...shortcut}
            icon={HOME_WORKSPACE_SHORTCUT_ICONS[shortcut.iconName]}
          />
        ))}
      </div>
    </section>
  );
}

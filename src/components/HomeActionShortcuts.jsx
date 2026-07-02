import { Bookmark, Link as LinkIcon, Plus, RefreshCw } from 'lucide-react';

function ShortcutButton({
  title,
  description,
  hint,
  icon: Icon,
  onClick,
  className,
  titleClassName,
  hintClassName,
  iconClassName,
  iconHoverClassName,
}) {
  return (
    <button
      onClick={onClick}
      className={`group rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 ${className}`}
      type="button"
    >
      <div className="flex items-center justify-between gap-3">
        <p className={`text-sm font-extrabold ${titleClassName}`}>{title}</p>
        <Icon className={`h-4 w-4 transition-transform ${iconClassName} ${iconHoverClassName}`} />
      </div>
      <p className="mt-2 text-xs leading-relaxed text-slate-400">{description}</p>
      <p className={`mt-3 text-[10px] font-bold ${hintClassName}`}>{hint}</p>
    </button>
  );
}

export default function HomeActionShortcuts({
  onOpenAddChannel,
  onOpenDiscoveryLinks,
  onOpenSelectedScan,
  onOpenVault,
}) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-4">
      <ShortcutButton
        title="1. 새 채널 등록"
        description="소재를 모을 채널을 먼저 클라우드 목록에 저장합니다."
        hint="오퍼레이션 관제로 이동"
        icon={Plus}
        onClick={onOpenAddChannel}
        className="border-indigo-400/20 bg-indigo-500/10 hover:border-indigo-300/50 hover:bg-indigo-500/15"
        titleClassName="text-indigo-200"
        hintClassName="text-indigo-300"
        iconClassName="text-indigo-300"
        iconHoverClassName="group-hover:scale-110"
      />
      <ShortcutButton
        title="2. 선택 채널 수집"
        description="체크한 채널만 YouTube API로 새 영상 여부를 확인합니다."
        hint="수집 범위 직접 통제"
        icon={RefreshCw}
        onClick={onOpenSelectedScan}
        className="border-emerald-400/20 bg-emerald-500/10 hover:border-emerald-300/50 hover:bg-emerald-500/15"
        titleClassName="text-emerald-200"
        hintClassName="text-emerald-300"
        iconClassName="text-emerald-300"
        iconHoverClassName="group-hover:rotate-45"
      />
      <ShortcutButton
        title="3. 보관함 탐색"
        description="저장된 영상 보드에서 카드 보기와 리스트 보기로 후보를 고릅니다."
        hint="레퍼런스 금고 열기"
        icon={Bookmark}
        onClick={onOpenVault}
        className="border-blue-400/20 bg-blue-500/10 hover:border-blue-300/50 hover:bg-blue-500/15"
        titleClassName="text-blue-200"
        hintClassName="text-blue-300"
        iconClassName="text-blue-300"
        iconHoverClassName="group-hover:scale-110"
      />
      <ShortcutButton
        title="4. 발견함 저장"
        description="외부에서 본 링크를 Cloud 발견함에 남기고 나중에 검토합니다."
        hint="API 호출 없이 링크만 저장"
        icon={LinkIcon}
        onClick={onOpenDiscoveryLinks}
        className="border-amber-400/20 bg-amber-500/10 hover:border-amber-300/50 hover:bg-amber-500/15"
        titleClassName="text-amber-200"
        hintClassName="text-amber-300"
        iconClassName="text-amber-300"
        iconHoverClassName="group-hover:scale-110"
      />
    </div>
  );
}

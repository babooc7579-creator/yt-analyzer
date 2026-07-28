import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Cloud, Eye, EyeOff, LibraryBig, Plus, RotateCcw, Save, Trash2 } from 'lucide-react';

import {
  EMPTY_WORK_TOOL_PREFERENCES,
  WORK_TOOL_GROUPS,
  getAllConfiguredWorkTools,
  normalizeWorkToolPreferences,
} from '../constants/workTools';
import {
  getSafeWorkToolUrl,
  registerWorkToolBeforeUnloadGuard,
  validateWorkToolPreferences,
} from '../utils/workToolSettings';

const createEmptyTool = () => ({
  label: '',
  description: '',
  href: '',
  groupId: 'personal',
  badge: '개인 도구',
});

const createCustomToolId = () => (
  `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
);

export default function WorkToolSettingsPanel({
  error = '',
  loading = false,
  onDirtyChange,
  onOpenWorkTools,
  onReload,
  onSave,
  preferences = EMPTY_WORK_TOOL_PREFERENCES,
  saving = false,
}) {
  const [draft, setDraft] = useState(() => normalizeWorkToolPreferences(preferences));
  const [newTool, setNewTool] = useState(createEmptyTool);
  const [dirty, setDirty] = useState(false);
  const [notice, setNotice] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    setDraft(normalizeWorkToolPreferences(preferences));
    setDirty(false);
  }, [preferences]);

  useEffect(() => registerWorkToolBeforeUnloadGuard({
    hasUnsavedChanges: dirty,
    target: typeof window === 'undefined' ? undefined : window,
  }), [dirty]);

  useEffect(() => {
    onDirtyChange?.(dirty);

    return () => {
      if (dirty) onDirtyChange?.(false);
    };
  }, [dirty, onDirtyChange]);

  const allTools = useMemo(() => getAllConfiguredWorkTools(draft), [draft]);
  const hiddenIds = useMemo(() => new Set(draft.hiddenDefaultToolIds), [draft.hiddenDefaultToolIds]);

  const updateDraft = (updater) => {
    setDraft((current) => normalizeWorkToolPreferences(
      typeof updater === 'function' ? updater(current) : updater
    ));
    setDirty(true);
    setNotice('');
    setValidationError('');
  };

  const updateCustomTool = (id, field, value) => {
    updateDraft((current) => ({
      ...current,
      customTools: current.customTools.map((tool) => (
        tool.id === id ? { ...tool, [field]: value } : tool
      )),
    }));
  };

  const toggleDefaultTool = (id) => {
    updateDraft((current) => {
      const hidden = new Set(current.hiddenDefaultToolIds);
      if (hidden.has(id)) hidden.delete(id);
      else hidden.add(id);
      return { ...current, hiddenDefaultToolIds: [...hidden] };
    });
  };

  const moveTool = (id, direction) => {
    const ids = allTools.map((tool) => tool.id);
    const currentIndex = ids.indexOf(id);
    const nextIndex = currentIndex + direction;
    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= ids.length) return;
    [ids[currentIndex], ids[nextIndex]] = [ids[nextIndex], ids[currentIndex]];
    updateDraft((current) => ({ ...current, toolOrder: ids }));
  };

  const removeCustomTool = (id) => {
    updateDraft((current) => ({
      ...current,
      customTools: current.customTools.filter((tool) => tool.id !== id),
      toolOrder: current.toolOrder.filter((toolId) => toolId !== id),
    }));
  };

  const addCustomTool = () => {
    const label = newTool.label.trim();
    const href = getSafeWorkToolUrl(newTool.href);
    if (!label) {
      setValidationError('도구 이름을 입력해 주세요.');
      return;
    }
    if (!href) {
      setValidationError('https:// 또는 http://로 시작하는 올바른 주소를 입력해 주세요.');
      return;
    }

    const tool = {
      ...newTool,
      id: createCustomToolId(),
      label,
      description: newTool.description.trim(),
      href,
      badge: newTool.badge.trim() || '개인 도구',
    };
    updateDraft((current) => ({
      ...current,
      customTools: [...current.customTools, tool],
      toolOrder: [...allTools.map((item) => item.id), tool.id],
    }));
    setNewTool(createEmptyTool());
  };

  const save = async () => {
    const validation = validateWorkToolPreferences(draft);
    if (!validation.success) {
      setValidationError(validation.message);
      setNotice('');
      return { success: false };
    }

    const result = await onSave?.(draft);
    if (result?.success) {
      setDirty(false);
      setNotice('업무 도구 설정을 온라인 저장소(Azure DB)에 저장했습니다.');
    }
    return result;
  };

  const restoreDefaults = () => {
    setDraft(EMPTY_WORK_TOOL_PREFERENCES);
    setDirty(true);
    setNotice('');
    setValidationError('');
  };

  return (
    <section className="border border-slate-700 bg-slate-900/90 p-5" aria-labelledby="work-tool-settings-title">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="text-xs font-extrabold text-cyan-300">업무 도구 관리</p>
          <h3 id="work-tool-settings-title" className="mt-1 text-lg font-black text-white">즐겨찾기 추가·숨김·순서 변경</h3>
          <p className="mt-2 max-w-3xl text-xs leading-5 text-slate-400">
            저장한 설정은 온라인 저장소(Azure DB) 기준으로 모든 브라우저에 적용됩니다. 외부 사이트의 검색 데이터는 수집하지 않습니다.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
          <button
            type="button"
            onClick={onOpenWorkTools}
            disabled={dirty || saving || typeof onOpenWorkTools !== 'function'}
            title={dirty ? '변경사항을 온라인 저장소(Azure DB)에 저장한 뒤 실제 업무 도구함에서 확인할 수 있습니다.' : '저장된 설정이 적용된 업무 도구함으로 이동합니다. 외부 사이트는 자동으로 열지 않습니다.'}
            className="inline-flex min-h-10 items-center justify-center gap-2 border border-blue-400/30 bg-blue-500/10 px-3 py-2 text-xs font-bold text-blue-100 hover:bg-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LibraryBig className="h-3.5 w-3.5" />
            업무 도구함에서 확인
          </button>
          <button
            type="button"
            onClick={restoreDefaults}
            disabled={saving}
            className="inline-flex min-h-10 items-center justify-center gap-2 border border-slate-600 bg-slate-950 px-3 py-2 text-xs font-bold text-slate-200 hover:border-amber-400 disabled:opacity-50"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            기본값으로 되돌리기
          </button>
          <button
            type="button"
            onClick={save}
            disabled={!dirty || saving}
            className="inline-flex min-h-10 items-center justify-center gap-2 border border-cyan-400/40 bg-cyan-500/15 px-3 py-2 text-xs font-bold text-cyan-100 hover:bg-cyan-500/25 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />
            {saving ? '저장 중...' : '변경사항 저장'}
          </button>
        </div>
      </div>

      {loading && (
        <p role="status" className="mt-4 border border-blue-400/20 bg-blue-500/10 px-3 py-2 text-xs text-blue-100">
          온라인 저장소(Azure DB)에서 업무 도구 설정을 불러오는 중입니다.
        </p>
      )}
      {error && (
        <div role="alert" className="mt-4 flex flex-col gap-2 border border-rose-400/25 bg-rose-500/10 px-3 py-3 text-xs text-rose-100 sm:flex-row sm:items-center sm:justify-between">
          <span>{error} 기본 도구는 계속 사용할 수 있지만 변경사항은 저장되지 않았습니다.</span>
          <button type="button" onClick={onReload} className="shrink-0 border border-rose-300/30 px-3 py-1.5 font-bold hover:bg-rose-500/10">
            다시 불러오기
          </button>
        </div>
      )}
      {notice && <p role="status" className="mt-4 border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-100">{notice}</p>}
      {dirty && !notice && (
        <p role="status" className="mt-4 text-xs font-bold text-amber-200">
          저장하지 않은 변경사항이 있습니다. 다른 메뉴로 이동하거나 화면을 닫기 전에 온라인 저장소(Azure DB)에 저장해 주세요.
        </p>
      )}

      <div className="mt-5 space-y-2">
        {allTools.map((tool, index) => {
          const hidden = tool.isDefault && hiddenIds.has(tool.id);
          return (
            <article key={tool.id} className="border border-slate-700 bg-slate-950/60 p-3">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveTool(tool.id, -1)}
                    disabled={index === 0 || saving}
                    aria-label={`${tool.label} 위로 이동`}
                    title="위로 이동"
                    className="border border-slate-700 p-2 text-slate-300 hover:text-white disabled:opacity-30"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveTool(tool.id, 1)}
                    disabled={index === allTools.length - 1 || saving}
                    aria-label={`${tool.label} 아래로 이동`}
                    title="아래로 이동"
                    className="border border-slate-700 p-2 text-slate-300 hover:text-white disabled:opacity-30"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>

                {tool.isDefault ? (
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-extrabold text-white">{tool.label}</h4>
                      <span className="border border-blue-400/20 bg-blue-500/10 px-2 py-1 text-[10px] font-bold text-blue-200">기본 도구</span>
                      {hidden && <span className="text-[10px] font-bold text-amber-200">도구함에서 숨김</span>}
                    </div>
                    <p className="mt-1 break-all text-xs leading-5 text-slate-400">{tool.href}</p>
                  </div>
                ) : (
                  <div className="grid min-w-0 flex-1 grid-cols-1 gap-2 xl:grid-cols-2">
                    <input
                      aria-label={`${tool.label} 이름`}
                      value={tool.label}
                      onChange={(event) => updateCustomTool(tool.id, 'label', event.target.value)}
                      className="border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                    />
                    <input
                      aria-label={`${tool.label} 주소`}
                      value={tool.href}
                      onChange={(event) => updateCustomTool(tool.id, 'href', event.target.value)}
                      className="border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                    />
                    <input
                      aria-label={`${tool.label} 설명`}
                      value={tool.description || ''}
                      onChange={(event) => updateCustomTool(tool.id, 'description', event.target.value)}
                      className="border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                    />
                    <select
                      aria-label={`${tool.label} 분류`}
                      value={tool.groupId || 'personal'}
                      onChange={(event) => updateCustomTool(tool.id, 'groupId', event.target.value)}
                      className="border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                    >
                      <option value="personal">나의 업무 도구</option>
                      {WORK_TOOL_GROUPS.map((group) => <option key={group.id} value={group.id}>{group.title}</option>)}
                    </select>
                  </div>
                )}

                <div className="flex shrink-0 gap-2">
                  {tool.isDefault ? (
                    <button
                      type="button"
                      onClick={() => toggleDefaultTool(tool.id)}
                      disabled={saving}
                      className="inline-flex items-center gap-2 border border-slate-600 px-3 py-2 text-xs font-bold text-slate-200 hover:border-cyan-400"
                    >
                      {hidden ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                      {hidden ? '다시 표시' : '숨기기'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => removeCustomTool(tool.id)}
                      disabled={saving}
                      aria-label={`${tool.label} 삭제`}
                      title="개인 도구 삭제"
                      className="inline-flex items-center gap-2 border border-rose-400/30 px-3 py-2 text-xs font-bold text-rose-200 hover:bg-rose-500/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      삭제
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <form
        className="mt-5 border border-dashed border-cyan-400/30 bg-cyan-500/5 p-4"
        aria-labelledby="add-work-tool-title"
        onSubmit={(event) => {
          event.preventDefault();
          addCustomTool();
        }}
      >
        <div className="flex items-center gap-2">
          <Plus className="h-4 w-4 text-cyan-300" />
          <h4 id="add-work-tool-title" className="text-sm font-extrabold text-white">개인 도구 추가</h4>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-2">
          <input
            aria-label="새 업무 도구 이름"
            placeholder="도구 이름"
            value={newTool.label}
            onChange={(event) => setNewTool((current) => ({ ...current, label: event.target.value }))}
            className="border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
          />
          <input
            aria-label="새 업무 도구 주소"
            placeholder="https://..."
            value={newTool.href}
            onChange={(event) => setNewTool((current) => ({ ...current, href: event.target.value }))}
            className="border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
          />
          <input
            aria-label="새 업무 도구 설명"
            placeholder="이 도구를 언제 사용하는지"
            value={newTool.description}
            onChange={(event) => setNewTool((current) => ({ ...current, description: event.target.value }))}
            className="border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
          />
          <select
            aria-label="새 업무 도구 분류"
            value={newTool.groupId}
            onChange={(event) => setNewTool((current) => ({ ...current, groupId: event.target.value }))}
            className="border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
          >
            <option value="personal">나의 업무 도구</option>
            {WORK_TOOL_GROUPS.map((group) => <option key={group.id} value={group.id}>{group.title}</option>)}
          </select>
        </div>
        {validationError && <p role="alert" className="mt-2 text-xs font-bold text-rose-200">{validationError}</p>}
        <button
          type="submit"
          disabled={saving}
          className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 border border-cyan-400/40 bg-cyan-500/15 px-3 py-2 text-xs font-bold text-cyan-100 hover:bg-cyan-500/25 sm:w-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          목록에 추가
        </button>
        <p className="mt-2 text-[11px] leading-4 text-slate-500">목록에 추가한 뒤 상단의 ‘변경사항 저장’을 눌러야 온라인 저장소(Azure DB)에 반영됩니다.</p>
      </form>

      {dirty && (
        <div className="sticky bottom-2 z-10 mt-4 flex flex-col gap-3 border border-amber-400/30 bg-slate-950/95 p-3 shadow-2xl sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-bold leading-5 text-amber-100">
            변경사항은 아직 이 화면에만 있습니다. 온라인 저장소(Azure DB) 저장을 완료해야 다른 기기에도 반영됩니다.
          </p>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="inline-flex min-h-10 w-full shrink-0 items-center justify-center gap-2 border border-cyan-400/40 bg-cyan-500/20 px-4 py-2 text-xs font-black text-cyan-50 hover:bg-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            <Save className="h-3.5 w-3.5" />
            {saving ? '저장 중...' : '변경사항 저장'}
          </button>
        </div>
      )}

      <footer className="mt-4 flex items-center gap-2 text-[11px] text-slate-500">
        <Cloud className="h-3.5 w-3.5" />
        기본 도구는 삭제하지 않고 숨김 처리하며, 기본값 복원 후 온라인 저장소(Azure DB) 저장으로 되돌릴 수 있습니다.
      </footer>
    </section>
  );
}

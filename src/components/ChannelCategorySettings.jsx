import ChannelCategoryAddInput from './ChannelCategoryAddInput';
import ChannelCategoryChip from './ChannelCategoryChip';
import ChannelCloudOnlyTagsNotice from './ChannelCloudOnlyTagsNotice';

export default function ChannelCategorySettings({
  cancelRenameCategory,
  categories,
  cloudOnlyTags = [],
  confirmRenameCategory,
  newCategoryName,
  renameLoading,
  renameValue,
  renamingCategory,
  setCategories,
  setNewCategoryName,
  setRenameValue,
  startRenameCategory,
}) {
  const hideCategoryFromLocalList = (category) => {
    const confirmed = window.confirm(
      `'${category}' 카테고리를 화면 목록에서 숨길까요?\n\n이미 채널에 붙은 Cloud 태그는 삭제되지 않습니다. 나중에 같은 이름으로 카테고리를 다시 추가하면 목록에 다시 보입니다.`
    );
    if (!confirmed) return;
    setCategories(categories.filter((currentCategory) => currentCategory !== category));
  };

  const addCategoryToLocalList = () => {
    if (!newCategoryName || categories.includes(newCategoryName)) return;
    setCategories([...categories, newCategoryName]);
    setNewCategoryName('');
  };

  return (
    <div className="mb-3 p-2 bg-white rounded border border-indigo-200 shadow-inner">
      <ChannelCategoryAddInput
        newCategoryName={newCategoryName}
        onAddCategory={addCategoryToLocalList}
        setNewCategoryName={setNewCategoryName}
      />
      <div className="flex flex-wrap gap-1">
        {categories.map((cat) => (
          <ChannelCategoryChip
            cancelRenameCategory={cancelRenameCategory}
            category={cat}
            confirmRenameCategory={confirmRenameCategory}
            hideCategoryFromLocalList={hideCategoryFromLocalList}
            isRenaming={renamingCategory === cat}
            key={cat}
            renameLoading={renameLoading}
            renameValue={renameValue}
            setRenameValue={setRenameValue}
            startRenameCategory={startRenameCategory}
          />
        ))}
      </div>
      <p className="text-[9px] text-slate-400 mt-1.5">⚙️ 이름 변경은 Cloud 태그를 바꿉니다. 휴지통은 화면 목록에서만 숨기며, 이미 채널에 붙은 Cloud 태그는 삭제하지 않습니다.</p>
      <ChannelCloudOnlyTagsNotice cloudOnlyTags={cloudOnlyTags} />
    </div>
  );
}

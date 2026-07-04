import ChannelCategoryChip from './ChannelCategoryChip';

export default function ChannelCategoryChipList({
  cancelRenameCategory,
  categories,
  confirmRenameCategory,
  hideCategoryFromLocalList,
  renameLoading,
  renameValue,
  renamingCategory,
  setRenameValue,
  startRenameCategory,
}) {
  return (
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
  );
}

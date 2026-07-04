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
      {categories.map((cat) => {
        const chipProps = {
          cancelRenameCategory,
          category: cat,
          confirmRenameCategory,
          hideCategoryFromLocalList,
          isRenaming: renamingCategory === cat,
          renameLoading,
          renameValue,
          setRenameValue,
          startRenameCategory,
        };

        return (
          <ChannelCategoryChip key={cat} {...chipProps} />
        );
      })}
    </div>
  );
}

import ChannelCategoryChip from './ChannelCategoryChip';

const toArray = (items) => (Array.isArray(items) ? items : []);

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
  const categoryList = toArray(categories);

  return (
    <div className="flex flex-wrap gap-1">
      {categoryList.map((cat) => {
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

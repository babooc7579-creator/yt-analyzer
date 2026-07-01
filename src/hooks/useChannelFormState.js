import { useState } from 'react';

export function useChannelFormState() {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isEditingCategory, setIsEditingCategory] = useState(false);

  const [newChannelInput, setNewChannelInput] = useState('');
  const [newChannelTags, setNewChannelTags] = useState([]);
  const [newChannelLang, setNewChannelLang] = useState('EN');
  const [newChannelNote, setNewChannelNote] = useState('');
  const [channelPreview, setChannelPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const [addMode, setAddMode] = useState('single');
  const [bulkInput, setBulkInput] = useState('');
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkResult, setBulkResult] = useState(null);

  const [renamingCategory, setRenamingCategory] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const [renameLoading, setRenameLoading] = useState(false);

  const cancelChannelPreview = () => {
    setChannelPreview(null);
    setNewChannelInput('');
    setNewChannelTags([]);
    setNewChannelNote('');
  };

  const resetBulkAdd = () => {
    setBulkInput('');
    setBulkResult(null);
    setAddMode('single');
    setNewChannelTags([]);
  };

  const toggleNewChannelTag = (tag) => {
    setNewChannelTags(prev => (
      prev.includes(tag)
        ? prev.filter(currentTag => currentTag !== tag)
        : [...prev, tag]
    ));
  };

  const startRenameCategory = (category) => {
    setRenamingCategory(category);
    setRenameValue(category);
  };

  const cancelRenameCategory = () => {
    setRenamingCategory(null);
    setRenameValue('');
  };

  return {
    addMode,
    bulkInput,
    bulkLoading,
    bulkResult,
    cancelChannelPreview,
    cancelRenameCategory,
    channelPreview,
    isEditingCategory,
    newCategoryName,
    newChannelInput,
    newChannelLang,
    newChannelNote,
    newChannelTags,
    previewLoading,
    renameLoading,
    renameValue,
    renamingCategory,
    resetBulkAdd,
    setAddMode,
    setBulkInput,
    setBulkLoading,
    setBulkResult,
    setChannelPreview,
    setIsEditingCategory,
    setNewCategoryName,
    setNewChannelInput,
    setNewChannelLang,
    setNewChannelNote,
    setPreviewLoading,
    setRenameLoading,
    setRenameValue,
    startRenameCategory,
    toggleNewChannelTag,
  };
}

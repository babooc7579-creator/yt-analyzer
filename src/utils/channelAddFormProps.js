const toInputText = (value) => (typeof value === 'string' ? value : '');

export const getRecognizedBulkChannelLineCount = (bulkInput) => (
  toInputText(bulkInput)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .length
);

export const getChannelAddFormViewProps = ({
  addMode,
  setAddMode,
  bulkInput,
  setBulkInput,
  bulkLoading,
  bulkResult,
  resetBulkAdd,
  handleBulkAdd,
  categories,
  cloudOnlyTags = [],
  setCategories,
  newCategoryName,
  setNewCategoryName,
  isEditingCategory,
  setIsEditingCategory,
  renamingCategory,
  renameValue,
  setRenameValue,
  renameLoading,
  startRenameCategory,
  confirmRenameCategory,
  cancelRenameCategory,
  newChannelInput,
  setNewChannelInput,
  newChannelTags,
  toggleNewChannelTag,
  newChannelLang,
  setNewChannelLang,
  newChannelNote,
  setNewChannelNote,
  channelPreview,
  previewLoading,
  handlePreviewChannel,
  cancelChannelPreview,
  handleSaveChannel,
  loading,
}) => ({
  bulkAddFormProps: {
    bulkInput,
    bulkLoading,
    bulkResult,
    categories,
    handleBulkAdd,
    newChannelLang,
    newChannelTags,
    resetBulkAdd,
    setBulkInput,
    setNewChannelLang,
    toggleNewChannelTag,
  },
  categorySettingsProps: {
    cancelRenameCategory,
    categories,
    cloudOnlyTags,
    confirmRenameCategory,
    newCategoryName,
    renameLoading,
    renameValue,
    renamingCategory,
    setCategories,
    setNewCategoryName,
    setRenameValue,
    startRenameCategory,
  },
  headerProps: {
    addMode,
    channelPreview,
    isEditingCategory,
    setAddMode,
    setIsEditingCategory,
  },
  singleAddFormProps: {
    cancelChannelPreview,
    categories,
    channelPreview,
    handlePreviewChannel,
    handleSaveChannel,
    loading,
    newChannelInput,
    newChannelLang,
    newChannelNote,
    newChannelTags,
    previewLoading,
    setNewChannelInput,
    setNewChannelLang,
    setNewChannelNote,
    toggleNewChannelTag,
  },
});

export const getChannelBulkAddFormInnerProps = ({
  bulkInput,
  bulkLoading,
  bulkResult,
  handleBulkAdd,
  newChannelLang,
  resetBulkAdd,
  setBulkInput,
  setNewChannelLang,
}) => {
  const inputText = toInputText(bulkInput);

  return {
    inputBoxProps: {
      bulkInput: inputText,
      bulkLoading,
      recognizedLineCount: getRecognizedBulkChannelLineCount(inputText),
      setBulkInput,
    },
    languageSelectProps: {
      language: newChannelLang,
      setLanguage: setNewChannelLang,
    },
    resultPanelProps: {
      bulkResult,
      resetBulkAdd,
    },
    submitButtonProps: {
      bulkInput: inputText,
      bulkLoading,
      handleBulkAdd,
    },
  };
};

export const getChannelSingleAddFormInnerProps = ({
  cancelChannelPreview,
  categories,
  channelPreview,
  handlePreviewChannel,
  handleSaveChannel,
  loading,
  newChannelInput,
  newChannelLang,
  newChannelNote,
  newChannelTags,
  previewLoading,
  setNewChannelInput,
  setNewChannelLang,
  setNewChannelNote,
  toggleNewChannelTag,
}) => ({
  previewEditorProps: {
    cancelChannelPreview,
    categories,
    channelPreview,
    handleSaveChannel,
    loading,
    newChannelLang,
    newChannelNote,
    newChannelTags,
    setNewChannelLang,
    setNewChannelNote,
    toggleNewChannelTag,
  },
  previewInputProps: {
    handlePreviewChannel,
    newChannelInput,
    previewLoading,
    setNewChannelInput,
  },
});

export const getChannelPreviewEditorProps = ({
  cancelChannelPreview,
  channelPreview,
  handleSaveChannel,
  loading,
  newChannelLang,
  newChannelNote,
  setNewChannelLang,
  setNewChannelNote,
}) => ({
  actionsProps: {
    cancelChannelPreview,
    handleSaveChannel,
    loading,
  },
  languageSelectProps: {
    language: newChannelLang,
    setLanguage: setNewChannelLang,
  },
  noteFieldProps: {
    note: newChannelNote,
    setNote: setNewChannelNote,
  },
  summaryProps: {
    cancelChannelPreview,
    channelPreview,
  },
});

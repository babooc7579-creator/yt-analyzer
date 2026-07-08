export const copyTextToClipboard = async (text) => {
  if (typeof text === 'string' ? text.trim().length === 0 : !text) {
    throw new Error('copy_failed');
  }

  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fall back to the textarea path below for browsers that block Clipboard API.
    }
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  let didCopy = false;
  try {
    didCopy = document.execCommand('copy');
  } finally {
    document.body.removeChild(textarea);
  }

  if (!didCopy) throw new Error('copy_failed');
};

export interface TpSaveFileOptions {
  suggestedName: string;
  description: string;
  mimeType: string;
  extension: string;
}

interface TpWritableFileStream {
  write(data: Blob): Promise<void>;
  close(): Promise<void>;
}

interface TpFileSystemFileHandle {
  name: string;
  createWritable(): Promise<TpWritableFileStream>;
}

interface TpSaveFilePickerWindow extends Window {
  showSaveFilePicker?: (options: {
    suggestedName: string;
    types: Array<{ description: string; accept: Record<string, string[]> }>;
  }) => Promise<TpFileSystemFileHandle>;
}

export interface TpSaveTarget {
  filename: string;
  handle?: TpFileSystemFileHandle;
}

function withExtension(filename: string, extension: string): string {
  const trimmed = filename.trim();
  if (trimmed.toLowerCase().endsWith(extension.toLowerCase())) return trimmed;
  return `${trimmed || 'download'}${extension}`;
}

export async function chooseSaveTarget(options: TpSaveFileOptions): Promise<TpSaveTarget | null> {
  const picker = (window as TpSaveFilePickerWindow).showSaveFilePicker;
  if (picker) {
    try {
      const handle = await picker({
        suggestedName: options.suggestedName,
        types: [{ description: options.description, accept: { [options.mimeType]: [options.extension] } }],
      });
      return { filename: withExtension(handle.name, options.extension), handle };
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return null;
      throw error;
    }
  }
  let filename = options.suggestedName;
  try {
    const answer = window.prompt('Save as', options.suggestedName);
    if (answer === null) return null;
    filename = answer;
  } catch {
    // DOM test environments may not implement prompt; retain the suggested filename.
  }
  return { filename: withExtension(filename, options.extension) };
}

export async function saveBlob(blob: Blob, target: TpSaveTarget): Promise<void> {
  if (target.handle) {
    const writable = await target.handle.createWritable();
    await writable.write(blob);
    await writable.close();
    return;
  }
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = target.filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

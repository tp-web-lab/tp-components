export {}; // transforme le fichier en module

declare global {
  interface Window {
    showOpenFilePicker?: (options?: {
      multiple?: boolean;
      types?: Array<{
        description?: string;
        accept: Record<string, string[]>;
      }>;
    }) => Promise<FileSystemFileHandle[]>;
  }

  interface Window {
    __tp_sql_schema__?: Array<{
      name: string;
      columns: string[];
    }>;
  }

  interface FileSystemFileHandle {
    kind: 'file';
    name: string;
    getFile(): Promise<File>;
  }
}

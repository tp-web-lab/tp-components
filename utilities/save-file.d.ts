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
export interface TpSaveTarget {
    filename: string;
    handle?: TpFileSystemFileHandle;
}
export declare function chooseSaveTarget(options: TpSaveFileOptions): Promise<TpSaveTarget | null>;
export declare function saveBlob(blob: Blob, target: TpSaveTarget): Promise<void>;
export {};

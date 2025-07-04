import type { PayloadRequest, TypeWithID } from 'payload';
import type { BunnyAdapterOptions, BunnyStorageOptions, BunnyVideoMeta } from './types.js';
export declare const getStorageUrl: (region: string | undefined) => string;
export declare const getVideoFromDoc: (doc: TypeWithID | undefined, filename: string) => {
    docId: string | number;
    videoId: string;
    videoMeta: BunnyVideoMeta | null;
} | undefined;
export declare const isImage: (mimeType: string) => boolean;
export declare const isVideo: (mimeType: string) => boolean;
export declare const validateOptions: (storageOptions: BunnyStorageOptions) => void;
export declare const purgeBunnyCache: (url: string, options: BunnyAdapterOptions["purge"], req?: PayloadRequest) => Promise<boolean>;

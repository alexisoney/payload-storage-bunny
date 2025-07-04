import type { HandleUpload } from '@payloadcms/plugin-cloud-storage/types';
import type { BunnyAdapterOptions } from './types.js';
type Args = {
    prefix?: string;
} & BunnyAdapterOptions;
export declare const getHandleUpload: ({ prefix, purge, storage, stream }: Args) => HandleUpload;
export {};

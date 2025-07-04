import type { CollectionConfig } from 'payload';
import type { BunnyStorageOptions } from './types.js';
export declare const getAdminThumbnail: (collection: CollectionConfig, options: BunnyStorageOptions) => ({ doc }: {
    doc: Record<string, unknown>;
}) => null | string;

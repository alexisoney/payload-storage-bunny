import type { StaticHandler } from '@payloadcms/plugin-cloud-storage/types';
import type { PayloadRequest } from 'payload';
import type { BunnyAdapterOptions } from './types.js';
export declare const storageStaticHandler: (req: PayloadRequest, data: Parameters<StaticHandler>[1], filename: string, storage: BunnyAdapterOptions["storage"], prefix?: string) => Promise<Response>;

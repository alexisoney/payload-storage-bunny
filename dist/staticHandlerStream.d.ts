import type { PayloadRequest } from 'payload';
import type { BunnyAdapterOptions, BunnyVideoMeta } from './types.js';
export declare const streamStaticHandler: (req: PayloadRequest, stream: NonNullable<BunnyAdapterOptions["stream"]>, { collection, docId, videoId, videoMeta, }: {
    collection: string;
    docId: number | string;
    videoId: string;
    videoMeta: BunnyVideoMeta | null;
}) => Promise<Response>;

import { posix } from 'node:path';
import { isImage } from './utils.js';
export const getAdminThumbnail = (collection, options)=>{
    return ({ doc })=>{
        const { adminThumbnail = true, storage, stream } = options.options;
        let timestamp = '';
        if (doc.updatedAt) {
            timestamp = Date.parse(doc.updatedAt).toString();
        } else if (doc.createdAt) {
            timestamp = Date.parse(doc.createdAt).toString();
        }
        const collectionOptions = options.collections[collection.slug];
        const usePayloadAccessControl = typeof collectionOptions === 'object' ? collectionOptions.disablePayloadAccessControl !== true : false;
        if (doc.mimeType && isImage(doc.mimeType) && doc.filename && typeof doc.filename === 'string') {
            const queryParams = new URLSearchParams();
            if (timestamp) {
                queryParams.append('t', timestamp);
            }
            if (adminThumbnail !== true && typeof adminThumbnail === 'object') {
                if (adminThumbnail.queryParams) {
                    Object.entries(adminThumbnail.queryParams).forEach(([key, value])=>queryParams.append(key, String(value)));
                }
                if (adminThumbnail.appendTimestamp && timestamp && !queryParams.has('t')) {
                    queryParams.append('t', timestamp);
                }
            }
            const baseUrl = usePayloadAccessControl ? `/api/${collection.slug}/file/${doc.filename}` : `https://${storage.hostname}/${posix.join(typeof doc.prefix === 'string' ? doc.prefix : '', doc.filename)}`;
            const queryString = queryParams.toString();
            return queryString ? `${baseUrl}?${queryString}` : baseUrl;
        }
        if (stream && doc.bunnyVideoId && typeof doc.bunnyVideoId === 'string') {
            return usePayloadAccessControl ? `/api/${collection.slug}/file/bunny:stream:${doc.bunnyVideoId}:thumbnail.jpg` : `https://${stream.hostname}/${doc.bunnyVideoId}/thumbnail.jpg`;
        }
        return null;
    };
};

//# sourceMappingURL=adminThumbnail.js.map
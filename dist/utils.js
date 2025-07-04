import ky, { HTTPError } from 'ky';
export const getStorageUrl = (region)=>{
    if (!region) {
        return 'storage.bunnycdn.com';
    }
    return `${region}.storage.bunnycdn.com`;
};
export const getVideoFromDoc = (doc, filename)=>{
    if (doc && typeof doc === 'object' && 'id' in doc && 'filename' in doc && doc.filename === filename && 'bunnyVideoId' in doc && typeof doc.bunnyVideoId === 'string') {
        return {
            docId: doc.id,
            videoId: doc.bunnyVideoId,
            videoMeta: 'bunnyVideoMeta' in doc ? doc.bunnyVideoMeta : null
        };
    }
    return undefined;
};
export const isImage = (mimeType)=>mimeType.startsWith('image/');
export const isVideo = (mimeType)=>mimeType.startsWith('video/');
export const validateOptions = (storageOptions)=>{
    const errors = [];
    if (storageOptions.options.storage.hostname.includes('storage.bunnycdn.com')) {
        errors.push('Hostname in storage settings cannot contain "storage.bunnycdn.com"');
    }
    if (storageOptions.options.purge) {
        const { purge } = storageOptions.options;
        if (purge.enabled && !purge.apiKey) {
            errors.push('When purge is enabled, an API key must be provided');
        }
    }
    if (storageOptions.options.stream) {
        const collectionsWithAccessControl = Object.entries(storageOptions.collections).filter(([_, collection])=>typeof collection === 'object' && collection.disablePayloadAccessControl !== true);
        const mp4FallbackEnabled = storageOptions.options.stream.mp4Fallback?.enabled || !!storageOptions.options.stream.mp4FallbackQuality;
        if (collectionsWithAccessControl.length > 0 && !mp4FallbackEnabled) {
            const collectionNames = collectionsWithAccessControl.map(([key])=>key).join(', ');
            errors.push(`Collections [${collectionNames}] have disablePayloadAccessControl disabled, mp4Fallback must be enabled`);
        }
    }
    if (errors.length > 0) {
        throw new Error(`Bunny Storage configuration error: ${errors.join('; ')}. Please refer to the documentation: https://github.com/maximseshuk/payload-storage-bunny`);
    }
};
export const purgeBunnyCache = async (url, options, req)=>{
    if (!options || !options.enabled) {
        return false;
    }
    try {
        await ky.post('https://api.bunny.net/purge', {
            headers: {
                AccessKey: options.apiKey
            },
            searchParams: {
                async: options.async || false,
                url
            },
            timeout: 30000
        });
        return true;
    } catch (err) {
        if (req) {
            if (err instanceof HTTPError) {
                const errorResponse = await err.response.text();
                req.payload.logger.error({
                    action: 'Cache purge',
                    error: {
                        response: errorResponse,
                        status: err.response.status,
                        statusText: err.response.statusText
                    },
                    url
                });
            } else {
                req.payload.logger.error({
                    action: 'Cache purge',
                    error: err,
                    url
                });
            }
        }
        return false;
    }
};

//# sourceMappingURL=utils.js.map
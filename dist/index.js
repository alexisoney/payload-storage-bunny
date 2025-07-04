import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage';
import { getAdminThumbnail } from './adminThumbnail.js';
import { getGenerateURL } from './generateURL.js';
import { getHandleDelete } from './handleDelete.js';
import { getHandleUpload } from './handleUpload.js';
import { getStaticHandler } from './staticHandler.js';
import { validateOptions } from './utils.js';
export const bunnyStorage = (bunnyStorageOptions)=>(incomingConfig)=>{
        if (bunnyStorageOptions.enabled === false) {
            return incomingConfig;
        }
        validateOptions(bunnyStorageOptions);
        const adapter = bunnyInternal(bunnyStorageOptions);
        const collectionsWithAdapter = Object.entries(bunnyStorageOptions.collections).reduce((acc, [slug, collOptions])=>({
                ...acc,
                [slug]: {
                    ...collOptions === true ? {} : collOptions,
                    adapter
                }
            }), {});
        const config = {
            ...incomingConfig,
            collections: (incomingConfig.collections || []).map((collection)=>{
                if (!collectionsWithAdapter[collection.slug]) {
                    return collection;
                }
                return {
                    ...collection,
                    upload: {
                        ...typeof collection.upload === 'object' ? collection.upload : {},
                        ...bunnyStorageOptions.options.adminThumbnail ? {
                            adminThumbnail: getAdminThumbnail(collection, bunnyStorageOptions)
                        } : {},
                        disableLocalStorage: true
                    }
                };
            })
        };
        return cloudStoragePlugin({
            collections: collectionsWithAdapter
        })(config);
    };
const bunnyInternal = ({ options })=>{
    const fields = options.stream ? [
        {
            name: 'bunnyVideoId',
            type: 'text',
            admin: {
                disabled: true,
                hidden: true
            }
        },
        ...options.stream.mp4Fallback?.enabled || !!options.stream.mp4FallbackQuality ? [
            {
                name: 'bunnyVideoMeta',
                type: 'json',
                hidden: true
            }
        ] : []
    ] : [];
    return ({ collection, prefix })=>{
        return {
            name: 'bunny',
            fields,
            generateURL: getGenerateURL(options),
            handleDelete: getHandleDelete(options),
            handleUpload: getHandleUpload({
                ...options,
                prefix
            }),
            staticHandler: getStaticHandler({
                ...options,
                collection,
                prefix
            })
        };
    };
};

//# sourceMappingURL=index.js.map
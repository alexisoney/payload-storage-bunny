import { posix } from 'node:path';
export const storageStaticHandler = async (req, data, filename, storage, prefix = '')=>{
    const rangeHeader = req.headers.get('range');
    const requestHeaders = new Headers();
    if (rangeHeader) {
        requestHeaders.set('Range', rangeHeader);
    }
    const url = `https://${storage.hostname}/${posix.join(prefix, filename)}`;
    const response = await fetch(url, {
        headers: requestHeaders
    });
    if (!response.ok && response.status !== 206) {
        return new Response(null, {
            status: 404,
            statusText: 'Not Found'
        });
    }
    const etagFromHeaders = req.headers.get('etag') || req.headers.get('if-none-match');
    const objectEtag = response.headers.get('etag');
    if (etagFromHeaders && objectEtag && etagFromHeaders === objectEtag) {
        const responseHeaders = new Headers();
        response.headers.forEach((value, key)=>{
            responseHeaders.set(key, value);
        });
        return new Response(null, {
            headers: responseHeaders,
            status: 304
        });
    }
    const responseHeaders = new Headers();
    response.headers.forEach((value, key)=>{
        responseHeaders.set(key, value);
    });
    return new Response(response.body, {
        headers: responseHeaders,
        status: response.status
    });
};

//# sourceMappingURL=staticHandlerStorage.js.map
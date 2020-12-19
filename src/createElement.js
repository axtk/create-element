import VolatileStorage from 'volatile-storage';
import buildConfig from '../lib/buildConfig';
import createAPIClient from '../lib/createAPIClient';

export default config => {
    const {
        endpoint,
        templateContainer,
        compile,
        onError,
        cacheMaxAge,
        cacheCapacity,
        cacheStorage,
        cacheNamespace,
        version,
    } = buildConfig(config);

    let api, cache;

    if (endpoint) {
        cache = new VolatileStorage({
            maxAge: cacheMaxAge,
            capacity: cacheCapacity,
            storage: cacheStorage,
            ns: cacheNamespace,
            version,
        });

        api = createAPIClient({
            baseURL: endpoint,
        });
    }

    return async (elementName, data, serverSideTemplateRendering = false) => {
        let innerHTML;

        if (serverSideTemplateRendering && api) {
            try {
                let response = await api.post(elementName, {data});
                innerHTML = response.data;
            }
            catch(e) {
                if (onError) onError(e);
            }
        }
        else {
            let s, tmplElement = document.querySelector(
                `${templateContainer}[data-element="${elementName}"]`
            );

            if (tmplElement)
                s = tmplElement.innerHTML;
            else if (api) {
                s = await cache.getItem(elementName);

                if (!s) {
                    try {
                        let response = await api.get(elementName);
                        await cache.setItem(elementName, s = response.data);
                    }
                    catch(e) {
                        if (onError) onError(e);
                    }
                }
            }

            innerHTML = compile(s, data);
        }

        let fragment = document.createDocumentFragment();

        if (innerHTML) {
            let buffer = Object.assign(document.createElement('body'), {innerHTML});

            while (buffer.childNodes.length)
                fragment.appendChild(buffer.firstChild);
        }

        return fragment;
    };
};

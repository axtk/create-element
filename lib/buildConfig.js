import {getDocumentConfig} from 'document-config';
import compile from './compile';

const props = [
    'endpoint',
    'templateContainer',
    'cacheMaxAge',
    'cacheStorage',
    'cacheNamespace',
    'cacheCapacity',
    'version',
];

const transform = {
    cacheMaxAge: Number,
    cacheCapacity: Number,
    cacheStorage: x => window[x],
};

export default (config = {}) => {
    const {ns} = config;

    return {
        compile,
        templateContainer: 'template',
        cacheNamespace: ns,
        ...getDocumentConfig({ns, props, transform}),
        ...config,
    };
};

'use strict';

import config from './config/config';

export default [
    {
        method: '*',
        path: '/{path*}',
        handler: {
            proxy: {
                passThrough: true,
                mapUri(request) {
                    const url = `${config.get('OUTBOUND_URL')}${request.path}`;
                    return {
                        uri: url + (request.url.search || '')
                    };
                },
            },
        },
    },
];

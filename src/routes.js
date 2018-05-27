'use strict';

const config = require('./config/config');

module.exports = [
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

'use strict';

import Hapi from 'hapi';
import h2o2 from 'h2o2';
import routes from './routes';

const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

const init = async () => {
    try {
        await server.register({ plugin: h2o2 });
        await server.start();

        server.route(routes);

        console.log(`Server running at: ${server.info.uri}`);
    }
    catch (e) {
        console.log('Failed to start server', e);
    }
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();

'use strict';

const hostToPrefix = 'huitparfait.fr';

module.exports = {
  name: 'prefix-www.plugin',
  register (server) {
    server.ext('onRequest', (request, h) => {
      const host = request.headers['x-forwarded-host'] || request.headers.host;
      if (host !== hostToPrefix) {
        return h.continue;
      }
      return h
        .redirect('https://www.' + hostToPrefix + request.url.path)
        .takeover()
        .code(301);
    });
  },
};

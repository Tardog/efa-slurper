'use strict';

const EfaRequest = require('./lib/EfaRequest');
const http = require('http');

http.createServer((request, response) => {

    let vrrEfaRequest = new EfaRequest('efa.vrr.de');

    vrrEfaRequest.sendRequest('Bochum', 'Hbf', 'Dortmund', 'Hbf', (body) => {
        response.writeHead(200, {'content-type': 'text/html'});
        response.end(body);
    });

}).listen(8080, '127.0.0.1');
console.log('Server running…');

'use strict';

const TimetableRequest = require('./lib/TimetableRequest');
const http = require('http');

/**
 * Temporary implementation of the server.
 *
 * @TODO: Replace with Express or something similar.
 * @TODO: Parse querystring for options.
 */
http.createServer((request, response) => {

    let timetableRequestVrr = new TimetableRequest('efa.vrr.de');

    timetableRequestVrr.sendRequest('Bochum', 'Hbf', (payload) => {
        let output;

        response.writeHead(200, {'content-type': 'text/html'});

        if (payload.statusCode === 200) {
            output = payload.body;
        } else {
            output = '<p>An error occured! The returned status code was: ' + payload.statusCode + '</p>'
        }

        response.end(output);
    });

}).listen(8080, '127.0.0.1');

console.log('Server ready');

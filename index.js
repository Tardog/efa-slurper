'use strict';

const http = require('http');
const url = require('url');
const querystring = require('querystring');
const TimetableRequest = require('./lib/TimetableRequest');

const defaultCity = 'Bochum';
const defaultStation = 'Hbf';

/**
 * Temporary implementation of the server.
 *
 * @TODO: Replace with Express or something similar.
 */
http.createServer((request, response) => {

    let timetableRequestVrr = new TimetableRequest('efa.vrr.de');

    let urlObj = url.parse(request.url);
    let query = querystring.parse(urlObj.query);

    let city = query.city ? query.city : defaultCity;
    let station = query.station ? query.station : defaultStation;

    timetableRequestVrr.sendRequest(city, station, (payload) => {
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

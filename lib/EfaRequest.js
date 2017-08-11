const http = require('http');
const querystring = require('querystring');

class EfaRequest {
    constructor(efaUrl) {
        this.efaUrl = efaUrl;
    }

    sendRequest(fromCity, fromStation, toCity, toStation, callback) {
        var data = [];
        var postData = querystring.stringify({
            place_origin: fromCity,
            type_origin: 'stop',
            name_origin: fromStation,
            place_destination: toCity,
            type_destination: 'stop',
            name_destination: toStation
        });

        const options = {
            host: this.efaUrl,
            path: '/vrr/XSLT_TRIP_REQUEST2',
            method: 'POST',
            port: 80,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postData.length
            }
        };

        var req = http.request(options, (response) => {

            response.on('readable', () => {
                data.push(response.read());
            });

            response.on('end', () => {
                var body = data.join('');
                callback(body);
            })
        });

        req.write(postData);
        req.end();
    }
}

module.exports = EfaRequest;

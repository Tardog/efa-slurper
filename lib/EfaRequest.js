'use strict';

const http = require('http');
const cheerio = require('cheerio');
const querystring = require('querystring');
const util = require('util');

const TYPE_TIMETABLE = 'timetable';

/**
 * Handles requests to EFA services.
 */
class EfaRequest {

    constructor(efaUrl) {
        this.efaUrl = efaUrl;
        this.requestType = null;
    }

    /**
     * Call the EFA server with options and post data.
     * The payload with the request result is passed to the given callback.
     *
     * @param {object} options
     * @param {object} postData
     * @param {function} callback
     */
    call(options, postData, callback) {
        var responseData = [];
        var requestBody = querystring.stringify(postData);

        options.headers = {
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            'Content-Length': requestBody.length
        }

        var req = http.request(options, (response) => {

            if (response.statusCode === 200 || response.headers['content-type'] === 'text/html') {
                response.on('readable', () => {
                    responseData.push(response.read());
                });
            }

            response.on('end', () => {
                var content = responseData.join('');
                var payload = {
                    body: null,
                    statusCode: response.statusCode
                };

                if (content) {
                    payload.body = this.getResultHtml(content);
                }

                callback(payload);
            })
        });

        req.write(requestBody);
        req.end();
    }

    /**
     * Extract the relevant part of response content to get only the results.
     *
     * @param {string} content
     *
     * @return {string}
     */
    getResultHtml(content) {
        let $ = cheerio.load(content);
        var html = '<!DOCTYPE html><html><head><title>Abfahrtsmonitor</title><meta charset="utf-8"></head><body>%s</body></html>';
        var body;

        switch (this.requestType) {
            case TYPE_TIMETABLE:
                body = $('body > form > table > tbody > tr > td:nth-child(3)').html();
        }

        html = util.format(html, body);

        return html;
    }
}

module.exports = EfaRequest;

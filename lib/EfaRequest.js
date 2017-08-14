const http = require('http');
const cheerio = require('cheerio');
const querystring = require('querystring');

/**
 * Handles requests to EFA services and parses the result from the response.
 */
class EfaRequest {

    constructor(efaUrl) {
        this.efaUrl = efaUrl;
        this.requestType = null;
        this.requestPath = '';
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
        const responseData = [];
        const requestBody = querystring.stringify(postData);
        const newOptions = options;

        newOptions.headers = {
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            'Content-Length': requestBody.length,
        };

        const req = http.request(newOptions, (response) => {
            if (response.statusCode === 200 || response.headers['content-type'] === 'text/html') {
                response.on('readable', () => {
                    responseData.push(response.read());
                });
            }

            response.on('end', () => {
                const content = responseData.join('');
                const payload = {
                    body: null,
                    statusCode: response.statusCode,
                };

                if (content) {
                    payload.body = this.getResultHtml(content);
                }

                callback(payload);
            });
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
        return content;
    }
}

module.exports = EfaRequest;

const http = require('http');
const querystring = require('querystring');
const sanitizeHtml = require('sanitize-html');

/**
 * Handles requests to EFA services and parses the result from the response.
 */
class EfaRequest {

    constructor(efaUrl, pathSuffix) {
        this.efaUrl = efaUrl;
        this.requestType = null;
        this.requestPath = pathSuffix;
        this.tagWhitelist = ['table', 'tr', 'td', 'tbody', 'img'];
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
        const expandOptions = options;

        expandOptions.headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': requestBody.length,
        };

        const req = http.request(expandOptions, (response) => {
            if (response.statusCode === 200 && response.headers['content-type'] === 'text/html') {
                response.setEncoding('latin1');
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
        return this.sanitize(content);
    }

    /**
     * Remove all HTML tags not on the whitelist from a string.
     *
     * @param {string} dirty
     *
     * @return {string}
     */
    sanitize(dirty) {
        return sanitizeHtml(dirty, {
            allowedTags: this.tagWhitelist
        });
    }
}

module.exports = EfaRequest;

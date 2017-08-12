const http = require('http');
const cheerio = require('cheerio');

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
     * @param {string} postData
     */
    call(options, postData, callback) {
        var responseData = [];

        var req = http.request(options, (response) => {

            if (response.statusCode === 200 || response.headers['content-type'] === 'text/html') {
                response.on('readable', () => {
                    responseData.push(response.read());
                });
            }

            response.on('end', () => {
                var content = responseData.join('');
                payload = {
                    body: null,
                    statusCode: response.statusCode
                };

                if (content) {
                    payload.body = this.getResultHtml(content);
                }

                callback(payload);
            })
        });

        req.write(postData);
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

        switch (this.requestType) {
            case TYPE_TIMETABLE:
                return $('body > form > table > tbody > tr > td:nth-child(3)').html();

            default:
                return '';
        }
    }
}

module.exports = EfaRequest;

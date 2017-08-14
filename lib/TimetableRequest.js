const EfaRequest = require('./EfaRequest');
const cheerio = require('cheerio');

/**
 * Extends the EfaRequest class to handle timetable request specifically.
 */
class TimetableRequest extends EfaRequest {

    constructor(efaUrl) {
        super(efaUrl);
        this.requestPath = '/vrr/XSLT_DM_REQUEST';
        this.requestType = 'timetable';
    }

    /**
     * Request a timetable for all lines going from a city/station.
     *
     * @param {string} city
     * @param {string} station
     * @param {function} callback
     */
    sendRequest(city, station, callback) {
        const postData = {
            place_dm: city,
            type_dm: 'stop',
            name_dm: station,
            dmLineSelectionAll: 1,
            mode: 'direct',
            useRealtime: 1,
            language: 'de',
        };

        const options = {
            host: this.efaUrl,
            path: this.requestPath,
            method: 'POST',
            port: 80,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postData.length,
            },
        };

        super.call(options, postData, callback);
    }

    /**
     * Extract the relevant part of response content to get only the results.
     *
     * @param {string} content
     *
     * @return {string}
     */
    getResultHtml(content) {
        const $ = cheerio.load(content, {
            decodeEntities: false
        });
        let body = $('body > form > table > tbody > tr > td:nth-child(3)').html();

        return body;
    }
}

module.exports = TimetableRequest;

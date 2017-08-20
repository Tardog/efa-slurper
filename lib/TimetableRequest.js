const EfaRequest = require('./EfaRequest');
const cheerio = require('cheerio');

/**
 * Extends the EfaRequest class to handle timetable request specifically.
 */
class TimetableRequest extends EfaRequest {

    constructor(efaUrl, pathSuffix) {
        super(efaUrl);
        this.requestPath = pathSuffix + '/XSLT_DM_REQUEST';
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
        const options = {
            host: this.efaUrl,
            path: this.requestPath,
            method: 'POST',
            port: 80
        };

        const postData = {
            place_dm: city,
            type_dm: 'stop',
            name_dm: station,
            dmLineSelectionAll: 1,
            mode: 'direct',
            useRealtime: 1,
            language: 'de',
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

        // Remove some unnecessary markup from the page
        $('img[src="images/dummy.gif"]').remove();
        $('img[src="images/drucker.jpg"]').closest('tr.bgColor').remove();
        $('input[name="reset"]').closest('tr.buttonBgColor').remove();
        $('img[alt="Abweichung"]').closest('tr').remove();
        $('.logoHeader').closest('table[width="100%"]').remove();
        $('table').removeAttr('width');

        let body = $('body > form > table > tbody > tr > td:nth-child(3)');

        return body.html();
    }
}

module.exports = TimetableRequest;

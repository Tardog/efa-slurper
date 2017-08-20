const EfaRequest = require('./EfaRequest');
const cheerio = require('cheerio');

/**
 * Extends the EfaRequest class to handle trip request specifically.
 */
class TripRequest extends EfaRequest {

    constructor(efaUrl, pathSuffix) {
        super(efaUrl);
        this.requestPath = pathSuffix + '/XSLT_DM_REQUEST';
        this.requestType = 'timetable';
    }

    /**
     * Request trip information from origin to destination at the given depature time/date.
     *
     * @param {string} originCity
     * @param {string} originStation
     * @param {string} destCity
     * @param {string} destStation
     * @param {Date} departure
     * @param {function} callback
     */
    sendRequest(originCity, originStation, destCity, destStation, departure, callback) {
        const options = {
            host: this.efaUrl,
            path: this.requestPath,
            method: 'POST',
            port: 80
        };

        const postData = {
            place_origin: originCity,
            type_origin: 'stop',
            name_origin: originStation,
            place_destination: destCity,
            type_destination: 'stop',
            name_destination: destStation,
            routeType: 'LEASTTIME',
            changeSpeed: 'normal',
            itdTripDateTimeDepArr: 'dep',
            itdTimeHour: departure.getHours(),
            itdTimeMinute: departure.getMinutes(),
            itdDateDay: departure.getDay(),
            itdDateMonth: departure.getMonth(),
            itdDateYear: departure.getFullYear(),
            language: 'de',
            useRealtime: 1,
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

module.exports = TripRequest;

const url = require('url');
const TimetableRequest = require('../lib/TimetableRequest');
const config = require('./config');

/**
 * Get timetable results for the given city and station.
 *
 * @param {string} city
 * @param {string} station
 *
 * @return {Promise}
 */
function getTimetable(city, station) {
    const timetableRequestVrr = new TimetableRequest(config.efaUrl);

    return new Promise((resolve, reject) => {
        timetableRequestVrr.sendRequest(city, station, (payload) => {
            if (payload.statusCode === 200) {
                resolve(payload.body);
            } else {
                reject('<p>An error occured! The returned status code was: ' + payload.statusCode + '</p>');
            }
        });
    });
}

/**
 * Display a timetable with parameters from the request.
 *
 * @param {Request} req
 * @param {Response} res
 */
function timetableAction(req, res) {
    res.set('content-type', 'text/html; charset=utf-8');
    res.status(200);

    const title = 'Abfahrtsmonitor';
    const city = req.params.city ? req.params.city : config.defaultCity;
    const station = req.params.station ? req.params.station : config.defaultStation;

    getTimetable(city, station)
        .then((output) => {
            res.render('timetable', { title, body: output });
        }, (error) => {
            res.render('timetable', { title, body: error });
        });
}

/**
 * Call the appropriate data request function for the current path.
 * Pass the result to the given callback.
 *
 * @param {Request} req
 * @param {function} callback
 */
function refreshAction(req, callback) {
    const requestPath = url.parse(req.headers.referer).pathname;
    const splitPath = requestPath.split('/');
    const city = splitPath[2] !== undefined ? splitPath[2] : config.defaultCity;
    const station = splitPath[3] !== undefined ? splitPath[3] : config.defaultStation;

    switch (splitPath[1]) {
        case 'timetable':
            getTimetable(city, station)
                .then((output) => {
                    callback(output);
                }, (error) => {
                    callback(error);
                });
    }
}

module.exports = {
    timetableAction,
    refreshAction,
};

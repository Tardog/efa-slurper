'use strict';

module.exports = {
    timetableAction: timetableAction
}

const util = require('util');
const TimetableRequest = require('../lib/TimetableRequest');
const config = require('./config');

/**
 * Display a timetable with parameters from the request.
 *
 * @param {object} req
 * @param {object} res
 */
function timetableAction(req, res) {
    res.set('content-type', 'text/html; charset=utf-8');
    res.status(200);
    const title = 'Abfahrtsmonitor';

    getTimetable(req)
        .then((output) => {
            res.render('timetable', { title: title, body: output});
        }, (error) => {
            res.render('timetable', { title: title, body: error});
        });
}

/**
 * Get timetable results for the given city and station.
 *
 * @param {object} req
 *
 * @return {Promise}
 */
function getTimetable(req) {
    const html = '<!DOCTYPE html><html><head><title>Abfahrtsmonitor</title><meta charset="utf-8"></head><body>%s</body></html>';

    let timetableRequestVrr = new TimetableRequest(config.efaUrl);
    let city = req.params.city ? req.params.city : config.defaultCity;
    let station = req.params.station ? req.params.station : config.defaultStation;

    return new Promise((resolve, reject) => {
        timetableRequestVrr.sendRequest(city, station, (payload) => {
            if (payload.statusCode === 200) {
                resolve(util.format(html, payload.body));
            } else {
                reject('<p>An error occured! The returned status code was: ' + payload.statusCode + '</p>');
            }
        });
    })
}

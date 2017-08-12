'use strict';

const TimetableRequest = require('../lib/TimetableRequest');
const config = require('./config');

module.exports = {
    indexAction: indexAction
}

function indexAction(req, res) {
    let timetableRequestVrr = new TimetableRequest(config.efaUrl);

    let city = req.query.city ? req.query.city : config.defaultCity;
    let station = req.query.station ? req.query.station : config.defaultStation;

    timetableRequestVrr.sendRequest(city, station, (payload) => {
        let output;

        if (payload.statusCode === 200) {
            output = payload.body;
        } else {
            output = '<p>An error occured! The returned status code was: ' + payload.statusCode + '</p>'
        }

        res.set('content-type', 'text/html; charset=utf-8');
        res.status(200);

        res.send(output);
    });
}

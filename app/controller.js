'use strict';

const TimetableRequest = require('../lib/TimetableRequest');
const config = require('./config');

module.exports = {
    indexAction: indexAction,
    refreshAction: refreshAction
}

function indexAction(req, res) {
    res.set('content-type', 'text/html; charset=utf-8');
    res.status(200);

    getTimetable(req)
    .then((output) => {
        res.send(output);
    }, (error) => {
        res.send(error);
    });
}

function refreshAction(ws, req) {
    ws.on('message', (msg) => {
        getTimetable(req)
        .then((output) => {
            ws.send(output);
        }, (error) => {
            ws.send(error);
        });
    });
}

function getTimetable(req) {
    let timetableRequestVrr = new TimetableRequest(config.efaUrl);
    let city = req.params.city ? req.params.city : config.defaultCity;
    let station = req.params.station ? req.params.station : config.defaultStation;

    return new Promise((resolve, reject) => {
        timetableRequestVrr.sendRequest(city, station, (payload) => {
            if (payload.statusCode === 200) {
                resolve(payload.body);
            } else {
                reject('<p>An error occured! The returned status code was: ' + payload.statusCode + '</p>');
            }
        });
    })
}

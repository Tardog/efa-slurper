'use strict';

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const router = require('./app/router')(app);
const io = require('socket.io')(server);
const config = require('./app/config');
const controller = require('./app/controller');

app.set('view engine', 'pug');
app.disable('x-powered-by');
app.listen(8080, () => {
    console.log('Server ready on port 8080');
});

io.on('connection', (socket) => {
    console.log('Client connected');
    setInterval(() => {
        console.log('Refreshing…');
        io.emit(controller.getTimetable(socket.request));
    }, config.refreshTimeout);
});

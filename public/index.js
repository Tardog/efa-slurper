const config = require('../app/config');
const controller = require('../app/controller');
const express = require('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

require('../app/router')(app);

app.use(express.static('public'));
app.set('view engine', 'pug');
app.set('title', 'Node EFA');
app.disable('x-powered-by');

server.listen(8080);

io.on('connection', (socket) => {
    console.log('Client connected');

    setInterval(() => {
        console.log('Refreshing…');
        controller.refreshAction(socket.request, (output) => {
            io.emit('results', { body: output });
        });
    }, config.refreshTimeout);
});

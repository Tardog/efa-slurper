const config = require('./app/config');
const controller = require('./app/controller');
const express = require('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

require('./app/router')(app);

// General settings
app.set('view engine', 'pug');
app.set('title', 'Node EFA');

app.use(express.static('public'));
app.disable('x-powered-by');

server.listen(8080);

io.on('connection', (socket) => {
    // When a client is connected to the Websockets server, auto refresh results periodically
    setInterval(() => {
        controller.refreshAction(socket.request, (output) => {
            io.emit('results', { body: output });
        });
    }, config.refreshTimeout);
});

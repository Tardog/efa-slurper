var socket = io.connect('http://localhost:8080');

socket.on('results', function (data) {
    console.log(data);
});

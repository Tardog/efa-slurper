const socket = io.connect('http://localhost:8080');

socket.on('results', function (data) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = data.body;
});

'use strict';

const express = require('express');
const app = express();

const router = require('./app/router')(app);

app.listen(8080, () => {
    console.log('Server ready on port 8080');
});

'use strict';

const controller = require('./controller');

module.exports = (app) => {
    app.get('/:city?/:station?', controller.indexAction);
    app.ws('/refresh', controller.refreshAction);
}

const controller = require('./controller');

module.exports = (app) => {
    app.get('/timetable/:city?/:station?', controller.timetableAction);
};

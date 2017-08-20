const chai = require('chai');
const path = require('path');

chai.should();

let EfaRequest = require(path.join(__dirname, '..', 'lib', 'EfaRequest'));

describe('EfaRequest', () => {
    let testEfaRequest;

    beforeEach(() => {
        testEfaRequest = new EfaRequest('efa.test.de', '/test');
    });

    describe('call', () => {
        const postData = {
            place_origin: 'Berlin',
            type_origin: 'stop',
            name_origin: 'Hbf',
            place_destination: 'München',
            type_destination: 'stop',
            name_destination: 'Hbf',
            routeType: 'LEASTTIME',
            changeSpeed: 'normal',
            itdTripDateTimeDepArr: 'dep',
            itdTimeHour: '12',
            itdTimeMinute: '00',
            itdDateDay: '01',
            itdDateMonth: '01',
            itdDateYear: '2017',
            language: 'de',
            useRealtime: 1,
        };

        const options = {
            host: 'efa.test.de',
            path: '/test/XSLT_TRIP_REQUEST2',
            method: 'POST',
            port: 80,
        };

        const callback = (payload) => {
            return payload;
        };

        it('should send a request to the given URL and path and run the callback on success', () => {
            testEfaRequest.call(options, postData, callback);
        });
    });
});

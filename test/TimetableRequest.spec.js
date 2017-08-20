const chai = require('chai');
const path = require('path');

chai.should();

let TimetableRequest = require(path.join(__dirname, '..', 'lib', 'TimetableRequest'));

describe('TimetableRequest', () => {
    let testTimetableRequest;

    beforeEach(() => {
        testTimetableRequest = new TimetableRequest('efa.test.de', '/test');
    });

    describe('getResultHtml', () => {
        it('should return the HTML content of the third <td> in the given string, minus filtered markup', () => {
            const content = '<html><head></head>' +
            '<body><form><table><tbody>' +
            '<tr><td>First</td><td>Second</td>' +
            '<td>' +
            '<table width="100%"><tbody><tr><td><img src="images/dummy.gif">Third</td></tr></tbody></table>' +
            '</td>' +
            '</tr></tbody></table></form></body></html>';

            let result = testTimetableRequest.getResultHtml(content);

            result.should.equal('<table><tbody><tr><td>Third</td></tr></tbody></table>');
        });
    });
});

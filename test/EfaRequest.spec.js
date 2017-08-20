const chai = require('chai');
const path = require('path');
const sinon = require('sinon');
const http = require('http');
const PassThrough = require('stream').PassThrough;
const querystring = require('querystring');

chai.should();

let EfaRequest = require(path.join(__dirname, '..', 'lib', 'EfaRequest'));

describe('EfaRequest', () => {
    let testEfaRequest;

    beforeEach(() => {
        this.request = sinon.stub(http, 'request');
        testEfaRequest = new EfaRequest('efa.test.de', '/test');
    });

    afterEach(() => {
        http.request.restore();
    });

    describe('call', () => {
        it('should send a http request to the given URL/path', () => {
            const postData = {
                foo: 'bar'
            };

            const options = {
                host: 'efa.test.de',
                path: '/test/XSLT_TRIP_REQUEST2',
                method: 'POST',
                port: 80,
            };

            const callback = sinon.spy();

            // Prepare the request stub
            let request = new PassThrough();
            let write = sinon.spy(request, 'write');

            this.request.returns(request);

            // Run the test
            testEfaRequest.call(options, postData, callback);

            // Assert
            write.withArgs(querystring.stringify(postData)).calledOnce.should.equal(true);
        });

        it('should call the callback on success', () => {
            const postData = {
                foo: 'bar',
            };

            const options = {
                host: 'efa.test.de',
                path: '/test/XSLT_TRIP_REQUEST2',
                method: 'POST',
                port: 80,
            };

            const callback = sinon.spy();

            // Prepare stubs
            let request = new PassThrough();
            let response = new PassThrough();

            response.statusCode = 200;
            response.headers = {
                'content-type': 'text/html'
            };

            sinon.stub(response, 'read').callsFake(() => {
                return '<p>foobar</p>';
            });

            this.request.callsArgWith(1, response).returns(request);

            // Run the test
            testEfaRequest.call(options, postData, callback);
            response.emit('readable');
            response.emit('end');

            // Assert
            callback.calledOnce.should.equal(true);
        });
    });
});

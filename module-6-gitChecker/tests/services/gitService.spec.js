// Node.js core module.
const PassThrough = require('stream').PassThrough;
// Node.js caches required modules. If we modify a module with Sinon etc, the next guy to call it, will get the modified thing.
const https = require('https');
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const sinon = require('sinon');

const gitService = require('./../../services/gitService')();

chai.use(chaiAsPromised);
chai.should();

describe('GitService', function () {
    describe('GetUser', function () {
        // Can't use arrow functions neither in the 'beforeEach' nor in 'it', we need to maintain 'this'.
        beforeEach(function () {
            this.request = sinon.stub(https, 'request');
        });

        it('should get a user and repos: ', function (done) {
            this.timeout(4000);
            // For those two, we could actually copy/paste an actual JSON response instance.
            const rawMockUserResponse = { login: 'jonathanfmills' };
            const rawMockRepoResponse = [{ name: 'testRepo' }];

            // The https module returns a stream.
            // We want to mock the response of the callback of the two http.request calls
            // Write the stringified version of the mocked raw response. Now it is a JS object, but usually it'll be a JSON object.
            const mockUserResponse = new PassThrough();
            mockUserResponse.write(JSON.stringify(rawMockUserResponse));
            mockUserResponse.end();
            const mockRepoResponse = new PassThrough();
            mockRepoResponse.write(JSON.stringify(rawMockRepoResponse));
            mockRepoResponse.end();

            // This works, the code below, although described in the course, does not.
            // this.request.callsArgWith(1, mockUserResponse).onFirstCall().returns(new PassThrough())
            // this.request.callsArgWith(1, mockRepoResponse).onFirstCall().returns(new PassThrough())
            this.request.onFirstCall().returns(mockRepoResponse);

            // The next call of the stubed function will be made with 'mockUserResponse' as the second (indexing from 0) argument
            // this.request
            //      .onFirstCall().callsArgWith(1, mockUserResponse).returns(new PassThrough())
            //      .onSecondCall().callsArgWith(1, mockRepoResponse).returns(new PassThrough());

            gitService.getRepos('jonathanfmills').then( (r) => {
                console.log('resolved: ', r);
                // const params = this.request.getCall(0).args;
                // const params2 = this.request.getCall(1).args;
                // console.log('params: ', params2);
                // user.login.should.equal('jonathanfmills');
                // user.should.have.property('repos');
                done();
            });
            // gitService.getUser('jonathanfmills').then( (user) => {
            //     console.log('resolved: ', user);
            //     const params = this.request.getCall(0).args;
            //     const params2 = this.request.getCall(1).args;
            //     console.log('params: ', params2);
            //     // user.login.should.equal('jonathanfmills');
            //     // user.should.have.property('repos');
            //     done();
            // });
        });

        // Restore what we stubed
        afterEach(function () {
            https.request.restore();
        });
    });
});

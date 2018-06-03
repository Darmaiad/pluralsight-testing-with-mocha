var chaiAsPromised = require("chai-as-promised");
var chai = require("chai");
var sinon = require('sinon');
var PassThrough = require('stream').PassThrough;
var http = require('https');
var rewire = require('rewire');

// Instead of require we use rewire
var GitCtrl = rewire('../../controllers/gitController');
// instead of require('../../controllers/gitController')(); we do it in 2 steps in order to rewire.
var gitController = GitCtrl();

chai.use(chaiAsPromised);
chai.should();

describe('GitController', function () {
    var getUser = {}; // Doing it global so that we don't have 'this' troubles.

    beforeEach(function () {
        // We pull out gitService from git controller
        var gitService = GitCtrl.__get__('gitService');
        // We attach a spy on gitService.getUser
        getUser = sinon.spy(gitService, 'getUser');
        // We put git service back in
        GitCtrl.__set__('gitService', gitService);

        // Mocking the https.request and its response like we did in service.spec
        this.request = sinon.stub(http, 'request');
        var gitJson = { login: 'jonathanfmills' };

        this.gitResponse = new PassThrough();
        this.gitResponse.write(JSON.stringify(gitJson));
        this.gitResponse.end();

        this.request.callsArgWith(1, this.gitResponse).returns(new PassThrough());
    });

    it('should get a user and repos', function (done) {
        this.timeout(4000);
        var req = { params: { userId: 'jonathanfmills' } };
        var res = { json: test };

        gitController.userGet(req, res);

        function test(user) {
            getUser.getCall(0).args[0].should.equal('jonathanfmills');
            getUser.calledOnce.should.be.true;
            user.login.should.equal('jonathanfmills');
            // console.log( getUser.getCall(0).args);
            done();
        }
    });

    afterEach(function(){
        http.request.restore(); 
    });
});
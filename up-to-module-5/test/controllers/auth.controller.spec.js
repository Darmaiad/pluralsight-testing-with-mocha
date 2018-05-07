const assert = require('assert');
const authController = require('./../../controllers/auth.controller');
const expect = require('chai').expect;
const sinon = require('sinon');
// In order to set up chai-as-promised:
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
// Middleware syntax
chai.use(chaiAsPromised);
chai.should();

// We can do .only, or .skip methods of describe, we can do also this.skip()
describe('AuthController', () => {
    // Named, non-arrow function so that the debugger can let us know which function throws the error.
    beforeEach(function settingUpRoles() {
        console.log('running before each');
        authController.setRoles(['user']);
    });

    describe('isAuthorized', () => {
        it('Should return false if not authorized', () => {
            const isAuth = authController.isAuthorized('admin');
            expect(isAuth).to.be.false; // Using chai's expect instead of assert
        })

        it('Should return true if authorized', () => {
            authController.setRoles(['user', 'admin']);
            const isAuth = authController.isAuthorized('admin');
            assert.equal(true, authController.isAuthorized('admin'));
            isAuth.should.be.true;
        })

        it('should not allow a get if not authorized');
        it('should allow get if authorized');
    })

    describe('isAuthorizedAsync - Callback', () => {
        beforeEach(function INSIDEisAuthorizedAsync() { // We can nest beforeEach functionality
            console.log('nesting before each hooks');
        });

        // Non-arrow function so that we do not lose the mocha context. An arrow function would bind 'this' to 'describe'.
        it('Should return false if not authorized', function (done) {
            // Mocha's default timeout is 2000ms, we have set the cb timeout at 2100ms and the test fails. 
            // We need to configure mocha to accept a larger timeout, so that the test passes
            this.timeout(3000);
            authController.isAuthorizedAsync('admin',
                (isAuth) => {
                    assert.equal(false, isAuth);
                    done();
                });
        });

        it('Should return false if not authorized - arrow function', (done) => {
            authController.isAuthorizedAsync('admin',
                (isAuth) => {
                    assert.equal(false, isAuth);
                    done();
                });
        }).timeout(3000);
    });

    // Testing a function that returns a Promise
    describe('isAuthorizedAsync - Promise', () => {
        it('Should return false if not authorized', () => authController.isAuthorizedPromise('admin').should.eventually.be.false);
    });

    // To test getIndex we need to pass two parameters req and res. We can do req={}; res={render: ()=>{}}. But we cannot keep track of the render function.
    // That's we we going to use Sinon spy to create a fake function that we can keep track of.
    describe('getIndex | with spy function', () => {
        it('Should render index', () => {
            const req = {};
            const res = {
                render: sinon.spy()
            };
            authController.getIndex(req, res);
            // Validate that res.render was called once
            res.render.calledOnce.should.be.true;
            // And with the right argument
            res.render.firstCall.args[0].should.equal('index');

        });
    });

    // We will spy a function that already exists.
    describe('isAuthorized', () => {
        // Adding user and a beforeEach to create him, for Module 5 purposes.
        let user;
        beforeEach(() => {
            user = {
                roles: ['user'],
                // Can't use arrow function, we lose this.roles.
                isAuthorized: function (neededRole) { return this.roles.indexOf(neededRole) >= 0 },
            }
            // Wrapping the 'isAuthorized' method of the 'user' object with a spy, while the method executes normally.
            sinon.spy(user, 'isAuthorized');
            authController.setUser(user);
        });

        it('Should return false if not authorized', () => {
            const isAuth = authController.isAuthorizedUser('admin');
            user.isAuthorized.calledOnce.should.be.true;
            expect(isAuth).to.be.false;
        })
    });

    describe('getIndex | with stubs', () => {
        let user;
        beforeEach(() => {
            user = {
                roles: ['user'],
                // Can't use arrow function, we lose this.roles.
                isAuthorized: function (neededRole) { return this.roles.indexOf(neededRole) >= 0 },
            }
            authController.setUser(user);
        });

        it('Should render \'index\' if authorized', () => {
            // isAuth will completely replace user.isAuthorized and it will return whatever we want.
            const isAuth = sinon.stub(user, 'isAuthorized').returns(true);
            const req = { user };
            const res = {
                render: sinon.spy(),
            };

            authController.getIndex2(req, res);
            isAuth.calledOnce.should.be.true;
            res.render.calledOnce.should.be.true;
            res.render.firstCall.args[0].should.equal('index');
        });

        it('Should render \'error\' if exception', () => {
            // We can even make the stub throw. Even throw something specifically.
            const isAuth = sinon.stub(user, 'isAuthorized').throws();
            const req = { user };
            const res = {
                render: sinon.spy(),
            };

            authController.getIndex2(req, res);
            isAuth.calledOnce.should.be.true;
            res.render.calledOnce.should.be.true;
            res.render.firstCall.args[0].should.equal('error');
        });
    });

    describe('isAuthorized | with mocks', () => {
        let user;
        beforeEach(() => {
            user = {
                roles: ['user'],
                // Can't use arrow function, we lose this.roles.
                isAuthorized: function (neededRole) { return this.roles.indexOf(neededRole) >= 0 },
            }
            authController.setUser(user);
        });

        it('Should render \'index\' if authorized', () => {
            const isAuth = sinon.stub(user, 'isAuthorized').returns(true);
            const req = { user };
            const res = {
                render: () => { }, // No point in spying something we will mock
            };
            const mock = sinon.mock(res);
            mock.expects('render').once().withExactArgs('index');

            authController.getIndex2(req, res);
            isAuth.calledOnce.should.be.true;

            mock.verify(); // verify mock.expects
        });
    });
});

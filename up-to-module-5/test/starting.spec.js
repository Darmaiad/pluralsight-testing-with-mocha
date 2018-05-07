// Inserts the method should in the Object prototype for the whole execution of the app
// The reason we need the variable is for those cases we need to use the should method on null
const should = require('chai').should();

describe('Basic mocha test', () => {
    it('Should deal with objects', () => {
        const obj = { name: 'George', gender: 'Male' };
        const obj2 = { name: 'George', gender: 'Male' };
        // We can use the method 'should' because we have imported it in another file
        obj.should.have.property('name').equal('George');
        obj.should.not.equal(obj2); // Strict comparison with '==='
        obj.should.deep.equal(obj2); // Deep (recursive equality) comparison with '=='
        obj.should.eql(obj2); // Same as above 
    });

    // The problem with should and null: var iAmNull = null; iAmNull.should.not.exist | error: calling method on null
    it('Should clarify the should null problem', () => {
        const iAmNull = null;
        should.not.exist(iAmNull);
    });
});

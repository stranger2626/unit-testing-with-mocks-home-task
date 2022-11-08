const UserDataHandler = require('./user_data_handler')
const userDataHandler = new UserDataHandler()

const expect = require('chai').expect
const { describe, before, it } = require('mocha');

const sinon = require('sinon');
const fakeData = require('../test-data/fakeData.json');

describe('User Data Handler Unit Tests', () => {
    before(async function () {
        await userDataHandler.loadUsers();
    })

    it('Should get an error getting empty list of users emails', () => {
        const userDataHandlerEmpty = new UserDataHandler();
        expect(function () { userDataHandlerEmpty.getUserEmailsList() }).to.throw(Error, 'No users loaded!')
    })

    it('Should get the users email - mocking response', async () => {
        const result = await userDataHandler.getUserEmailsList();
        expect(result.length).to.be.above(0);
    })

    it('Should get the users email - mocking response', async () => {
        // Mocking response
        const stub = sinon.stub(userDataHandler, 'getUserEmailsList').resolves(fakeData);
        const result = await userDataHandler.getUserEmailsList();
        expect(result).to.eq(fakeData);
        stub.restore();
    })

    it('Should get the number of users', async () => {
        const numberOfUsers = await userDataHandler.getNumberOfUsers()
        expect(numberOfUsers).to.eq(10);
    })

    it('Should find users by username', () => {
        const searchParams = {
            username: 'Leopoldo_Corkery'
        }

        const result = userDataHandler.findUsers(searchParams)
        expect(result.length).to.eq(1)
    })

    it('Should return error if the params are not provided', () => {
        expect(function () { userDataHandler.findUsers() }).to.throw(Error, 'No search parameters provoded!')
    })

    it('Should return an error if the find users does not return matches', () => {
        const noMatchCriteria = {
            username: 'abc'
        }
        expect(function () { userDataHandler.findUsers(noMatchCriteria) }).to.throw(Error, 'No matching users found!')
    })

    it('Should return error finding users if not users are beign loaded', () => {
        const searchParams = {
            username: 'Leopoldo_Corkery'
        }

        const userDataHandlerEmpty = new UserDataHandler();
        expect(function () { userDataHandlerEmpty.findUsers(searchParams) }).to.throw(Error, 'No users loaded!')
    })
})

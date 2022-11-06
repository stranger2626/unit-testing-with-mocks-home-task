const UserDataHandler = require('./user_data_handler')
const userDataHandler = new UserDataHandler()

const expect = require('chai').expect
const { describe, before, it } = require('mocha')

describe('User Data Handler Unit Tests', () => {
  before(async function () {
    await userDataHandler.loadUsers()
  })

  it('Should get an error getting empty list of users emails', () => {
    const userDataHandlerEmpty = new UserDataHandler()
    expect(
      () => userDataHandlerEmpty.getUserEmailsList(),
      Error,
      'No users loaded!'
    )
  })

  it('Should get the users email', async () => {
    const result = userDataHandler.getUserEmailsList()
    expect(result.length).to.be.above(0) // Change
  })

  it('Should get the number of users', () => {
    const numberOfUsers = userDataHandler.getNumberOfUsers()
    expect(numberOfUsers).to.eq(11)
  })

  it('Should find users by username', () => {
    const searchParams = {
      username: 'Leopoldo_Corkery'
    }

    const result = userDataHandler.findUsers(searchParams)
    expect(result.length).to.eq(1)
  })

  it('Should return error if the params are not provided', () => {
    expect(() => userDataHandler.findUsers()).to.throw(
      Error,
      'No search parameters provoded!'
    )
  })

  it('Should return an error if the find users does not return matches', () => {
    const noMatchCriteria = {
      username: 'abc'
    }
    expect(() => userDataHandler.findUsers(noMatchCriteria)).to.throw(
      Error,
      'No matching users found!'
    )
  })
})

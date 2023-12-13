const { describe, it, before } = require('mocha')
const UserDataHandler = require('../src/data_handlers/user_data_handler')
const assert = require('node:assert')

describe('User Data Handler Get Users Number method', () => {
  const dataHandler = new UserDataHandler()
  before(async () => {
    await dataHandler.loadUsers()
  })

  it('should reveal correct users quantity', async () => {
    const usersQuantity = dataHandler.getNumberOfUsers()
    const expectedUsersQuantity = 10
    assert.equal(usersQuantity, expectedUsersQuantity)
  })
})

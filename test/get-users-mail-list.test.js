const { describe, it, before } = require('mocha')
const UserDataHandler = require('../src/data_handlers/user_data_handler')
const assert = require('node:assert')
const fs = require('node:fs')
const users = JSON.parse(fs.readFileSync('data/users.json').toString())

describe('User Data Handler Get Users Mail List method', () => {
  const dataHandler = new UserDataHandler()
  describe('If request is failed', () => {
    it('should return correct array', async () => {
      assert.throws(() => dataHandler.getUserEmailsList())
    })
  })
  describe('If request is successfull', () => {
    before(async () => {
      await dataHandler.loadUsers()
    })
    it('should return correct array', async () => {
      const actualUsersMails = dataHandler.getUserEmailsList()
      const expectedlUsersMails = users.map(user => user.email).join(';')
      assert.deepEqual(actualUsersMails, expectedlUsersMails)
    })
  })
})

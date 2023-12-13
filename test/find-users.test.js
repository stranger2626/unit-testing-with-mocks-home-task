const { describe, it, before } = require('mocha')
const UserDataHandler = require('../src/data_handlers/user_data_handler')
const assert = require('node:assert')
const fs = require('node:fs')
const users = JSON.parse(fs.readFileSync('data/users.json').toString())

describe('User Data Handler Find Users method', () => {
  const dataHandler = new UserDataHandler()
  describe('If no parameter was provided', () => {
    it('should return error', async () => {
      assert.throws(() => dataHandler.findUsers())
    })
  })

  describe('If no users were found', () => {
    it('should return error', async () => {
      const searchParamsObject = {
        id: 3
      }
      assert.throws(() => dataHandler.findUsers(searchParamsObject))
    })
  })

  describe('If no matching users were found', () => {
    before(async () => {
      await dataHandler.loadUsers()
    })
    it('should return error', async () => {
      const searchParamsObject = {
        id: 300
      }
      assert.throws(() => dataHandler.findUsers(searchParamsObject))
    })
  })

  describe('If matching users were found', () => {
    before(async () => {
      await dataHandler.loadUsers()
    })
    it('should find correct user', async () => {
      const searchParamsObject = {
        id: 1
      }
      const foundUser = dataHandler.findUsers(searchParamsObject)
      const expectedUser = users.find(user => user.id === searchParamsObject.id)
      assert.deepEqual(foundUser, [expectedUser])
    })
  })
})

const { describe, it, before } = require('mocha')
const UserDataHandler = require('../src/data_handlers/user_data_handler')
const assert = require('node:assert')
const fs = require('node:fs')
const nock = require('nock')
const users = JSON.parse(fs.readFileSync('data/users.json').toString())

describe('User Data Handler Load Data method', () => {
  const dataHandler = new UserDataHandler()
  describe('If request is successfull', () => {
    before(async () => {
      await dataHandler.loadUsers()
    })
    it('should return correct array', async () => {
      const receivedUsersArray = dataHandler.users
      assert.deepEqual(receivedUsersArray, users)
    })
  })

  describe('If request is failed', () => {
    before(async () => {
      nock('http://localhost:3000').get('/users').reply(404)
    })
    it('should return fail with error', async () => {
      assert.rejects(dataHandler.loadUsers())
    })
  })
})

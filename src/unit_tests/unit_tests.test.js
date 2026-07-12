const { describe, test, expect, beforeEach } = require('@jest/globals')
const UserDataHandler = require('../data_handlers/user_data_handler')
const usersData = require('../../data/users.json')
// const axios = require('axios').default

describe('UserDataHandler', () => {
  let userDataHandler
  beforeEach(async () => {
    userDataHandler = new UserDataHandler()
  })

  describe('constructor', () => {
    test('initializes with an empty users array', () => {
      expect(userDataHandler.users).toEqual([])
    })
  })

  describe('loadUsers', () => {
    test('populates users with data from the server on success', async () => {
      await userDataHandler.loadUsers()

      expect(userDataHandler.users).toEqual(usersData)
    })

    // // Active in mocked tests
    // test('throws an error when the request fails', async () => {
    //   jest.mock('axios')
    //   axios.get.mockRejectedValue('network down')

    //   await expect(userDataHandler.loadUsers()).rejects.toThrow(
    //     'Failed to load users data: network down'
    //   )
    //   expect(userDataHandler.users).toEqual([])
    // })
  })

  describe('getUserEmailsList', () => {
    test('returns a semicolon-separated list of emails', async () => {
      await userDataHandler.loadUsers()

      expect(userDataHandler.getUserEmailsList()).toBe(usersData.map(user => user.email).join(';'))
    })

    test('throws an error when no users are loaded', () => {
      expect(() => userDataHandler.getUserEmailsList()).toThrow('No users loaded!')
    })
  })

  describe('getNumberOfUsers', () => {
    test('returns 0 when no users are loaded', () => {
      expect(userDataHandler.getNumberOfUsers()).toBe(0)
    })

    test('returns the current number of users', async () => {
      await userDataHandler.loadUsers()

      expect(userDataHandler.getNumberOfUsers()).toBe(usersData.length)
    })
  })

  describe('isMatchingAllSearchParams', () => {
    test('returns true when the user matches all search params', async () => {
      await userDataHandler.loadUsers()

      expect(
        userDataHandler.isMatchingAllSearchParams(userDataHandler.users[0], {
          name: usersData[0].name,
          username: usersData[0].username,
          email: usersData[0].email
        })
      ).toBe(true)
    })

    test('returns false when the user does not match a search param', async () => {
      await userDataHandler.loadUsers()
      expect(
        userDataHandler.isMatchingAllSearchParams(userDataHandler.users[0], { role: 'user' })
      ).toBe(false)
    })

    test('returns true when the search params object is empty', async () => {
      await userDataHandler.loadUsers()
      expect(userDataHandler.isMatchingAllSearchParams(userDataHandler.users[0], {})).toBe(true)
    })

    test('breaks early and returns false on the first mismatch', async () => {
      await userDataHandler.loadUsers()
      expect(
        userDataHandler.isMatchingAllSearchParams(userDataHandler.users[0], {
          role: 'user',
          email: usersData[0].email
        })
      ).toBe(false)
    })
  })

  describe('findUsers', () => {
    beforeEach(async () => {
      await userDataHandler.loadUsers()
    })

    test('returns all users matching the search params', async () => {
      const result = userDataHandler.findUsers({ email: usersData[0].email })

      expect(result[0].name).toEqual(usersData[0].name)
    })

    test('throws an error when no search params are provided', () => {
      expect(() => userDataHandler.findUsers()).toThrow('No search parameters provoded!')
    })

    test('throws an error when no users are loaded', () => {
      userDataHandler.users = []

      expect(() => userDataHandler.findUsers({ city: 'McKenziehaven' })).toThrow('No users loaded!')
    })

    test('throws an error when no matching users are found', () => {
      expect(() => userDataHandler.findUsers({ city: 'NonExistentCity' })).toThrow(
        'No matching users found!'
      )
    })
  })
})

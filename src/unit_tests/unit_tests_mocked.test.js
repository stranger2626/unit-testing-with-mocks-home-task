const { describe, test, expect, beforeEach, afterEach } = require('@jest/globals')
const axios = require('axios').default
const UserDataHandler = require('../data_handlers/user_data_handler')

jest.mock('axios')

const mockUsers = [
  { id: 1, name: 'Chaim McDermott', email: 'Chaim_McDermott@dana.io', role: 'admin' },
  { id: 2, name: 'Jane Doe', email: 'jane@example.com', role: 'user' },
  { id: 3, name: 'John Smith', email: 'john@example.com', role: 'user' }
]

describe('UserDataHandler', () => {
  let userDataHandler

  beforeEach(() => {
    userDataHandler = new UserDataHandler()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('constructor', () => {
    test('initializes with an empty users array', () => {
      expect(userDataHandler.users).toEqual([])
    })
  })

  describe('loadUsers', () => {
    test('populates users with data from the server on success', async () => {
      axios.get.mockResolvedValue({ data: mockUsers })

      await userDataHandler.loadUsers()

      expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/users')
      expect(userDataHandler.users).toEqual(mockUsers)
    })

    test('throws an error when the request fails', async () => {
      axios.get.mockRejectedValue('network down')

      await expect(userDataHandler.loadUsers()).rejects.toThrow(
        'Failed to load users data: network down'
      )
      expect(userDataHandler.users).toEqual([])
    })
  })

  describe('getUserEmailsList', () => {
    test('returns a semicolon-separated list of emails', () => {
      userDataHandler.users = mockUsers

      expect(userDataHandler.getUserEmailsList()).toBe(
        'Chaim_McDermott@dana.io;jane@example.com;john@example.com'
      )
    })

    test('throws an error when no users are loaded', () => {
      expect(() => userDataHandler.getUserEmailsList()).toThrow('No users loaded!')
    })
  })

  describe('getNumberOfUsers', () => {
    test('returns 0 when no users are loaded', () => {
      expect(userDataHandler.getNumberOfUsers()).toBe(0)
    })

    test('returns the current number of users', () => {
      userDataHandler.users = mockUsers

      expect(userDataHandler.getNumberOfUsers()).toBe(3)
    })
  })

  describe('isMatchingAllSearchParams', () => {
    test('returns true when the user matches all search params', () => {
      expect(
        userDataHandler.isMatchingAllSearchParams(mockUsers[0], {
          email: 'Chaim_McDermott@dana.io',
          role: 'admin'
        })
      ).toBe(true)
    })

    test('returns false when the user does not match a search param', () => {
      expect(
        userDataHandler.isMatchingAllSearchParams(mockUsers[0], { role: 'user' })
      ).toBe(false)
    })

    test('returns true when the search params object is empty', () => {
      expect(userDataHandler.isMatchingAllSearchParams(mockUsers[0], {})).toBe(true)
    })

    test('breaks early and returns false on the first mismatch', () => {
      expect(
        userDataHandler.isMatchingAllSearchParams(mockUsers[0], {
          role: 'user',
          email: 'Chaim_McDermott@dana.io'
        })
      ).toBe(false)
    })
  })

  describe('findUsers', () => {
    beforeEach(() => {
      userDataHandler.users = mockUsers
    })

    test('returns all users matching the search params', () => {
      const result = userDataHandler.findUsers({ role: 'user' })

      expect(result).toEqual([mockUsers[1], mockUsers[2]])
    })

    test('throws an error when no search params are provided', () => {
      expect(() => userDataHandler.findUsers()).toThrow('No search parameters provoded!')
    })

    test('throws an error when no users are loaded', () => {
      userDataHandler.users = []

      expect(() => userDataHandler.findUsers({ role: 'user' })).toThrow('No users loaded!')
    })

    test('throws an error when no matching users are found', () => {
      expect(() => userDataHandler.findUsers({ role: 'ghost' })).toThrow(
        'No matching users found!'
      )
    })
  })
})

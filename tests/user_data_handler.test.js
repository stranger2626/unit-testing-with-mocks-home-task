const axios = require('axios')
jest.mock('axios')
const UserDataHandler = require('../src/data_handlers/user_data_handler')

describe('UserDataHandler', () => {
  let userDataHandler
  const mockUsers = [
    {
      id: 1,
      name: 'Leanne Graham',
      email: 'Sincere@april.biz'
    },
    {
      id: 2,
      name: 'Ervin Howell',
      email: 'Shanna@melissa.tv'
    }
  ]

  beforeEach(() => {
    userDataHandler = new UserDataHandler()
  })

  describe('loadUsers', () => {
    it('should load users from the server and update the users array', async () => {
      axios.get.mockResolvedValue({ data: mockUsers })

      await userDataHandler.loadUsers()

      expect(userDataHandler.users).toEqual(mockUsers)
      expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/users')
    })

    it('should throw an error if the server request fails', async () => {
      axios.get.mockRejectedValue(new Error('Network Error'))

      await expect(userDataHandler.loadUsers()).rejects.toThrow(
        'Failed to load users data: Error: Network Error'
      )
    })
  })

  describe('getUserEmailsList', () => {
    it('should return a semicolon-separated string of all user emails', () => {
      userDataHandler.users = mockUsers

      const result = userDataHandler.getUserEmailsList()

      expect(result).toBe('Sincere@april.biz;Shanna@melissa.tv')
    })

    it('should throw an error if no users are loaded', () => {
      userDataHandler.users = []

      expect(() => userDataHandler.getUserEmailsList()).toThrow(
        'No users loaded!'
      )
    })
  })

  describe('getNumberOfUsers', () => {
    it('should return the number of users in the users array', () => {
      userDataHandler.users = mockUsers

      const result = userDataHandler.getNumberOfUsers()

      expect(result).toBe(2)
    })

    it('should return 0 if no users are loaded', () => {
      userDataHandler.users = []

      const result = userDataHandler.getNumberOfUsers()

      expect(result).toBe(0)
    })
  })

  describe('isMatchingAllSearchParams', () => {
    it('should return true if the user object matches all search parameters', () => {
      const user = { id: 1, name: 'John Doe', email: 'test@example.com' }
      const searchParams = { id: 1, email: 'test@example.com' }

      const result = userDataHandler.isMatchingAllSearchParams(
        user,
        searchParams
      )

      expect(result).toBe(true)
    })

    it('should return false if the user object does not match some search parameters', () => {
      const user = { id: 1, name: 'John Doe', email: 'test@example.com' }
      const searchParams = { id: 2, email: 'test@example.com' }

      const result = userDataHandler.isMatchingAllSearchParams(
        user,
        searchParams
      )

      expect(result).toBe(false)
    })
  })

  describe('findUsers', () => {
    it('should return an array of users that match the search parameters', () => {
      const searchParams = { email: 'Sincere@april.biz' }
      userDataHandler.users = mockUsers

      const result = userDataHandler.findUsers(searchParams)

      expect(result).toEqual([mockUsers[0]])
    })

    it('should throw an error if no search parameters are provided', () => {
      expect(() => userDataHandler.findUsers()).toThrow(
        'No search parameters provoded!'
      )
    })

    it('should throw an error if no users are loaded', () => {
      userDataHandler.users = []

      expect(() =>
        userDataHandler.findUsers({ email: 'test@example.com' })
      ).toThrow('No users loaded!')
    })

    it('should throw an error if no matching users are found', () => {
      const searchParams = { email: 'nonexistent@example.com' }
      userDataHandler.users = mockUsers

      expect(() => userDataHandler.findUsers(searchParams)).toThrow(
        'No matching users found!'
      )
    })
  })
})

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { User, UserType } from '../../user.mjs'
import { LS_USERS_KEY } from '../utils/constants'
import userService from './user.service'

describe('userService', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  describe('find', () => {
    it('find all users from localStorage', async () => {
      const mockUsers: User[] = [
        {
          _id: 'ff899ea1-5397-42b4-996d-f52492e8c835',
          firstName: 'Tom',
          lastName: 'Sawyer',
          phoneNumber: '+1-214-555-7294',
          email: 'tom@email.fake',
          type: UserType.Admin,
        },
      ]

      localStorage.setItem(LS_USERS_KEY, JSON.stringify(mockUsers))

      const users = await userService.find()
      expect(users).toEqual(mockUsers)
    })
  })

  describe('findById', () => {
    const mockUsers: User[] = [
      {
        _id: 'ff899ea1-5397-42b4-996d-f52492e8c835',
        firstName: 'Tom',
        lastName: 'Sawyer',
        phoneNumber: '+1-214-555-7294',
        email: 'tom@email.fake',
        type: UserType.Admin,
      },
    ]

    beforeEach(() => {
      localStorage.setItem(LS_USERS_KEY, JSON.stringify(mockUsers))
    })

    it('find one user by _id', async () => {
      const user = await userService.findById('ff899ea1-5397-42b4-996d-f52492e8c835')
      expect(user).toEqual(mockUsers[0])
    })

    it('could not find user so returns an empty object', async () => {
      const user = await userService.findById('123')
      expect(user).toEqual({} as User)
    })
  })

  describe('update', () => {
    const mockUser: User = {
      _id: 'ff899ea1-5397-42b4-996d-f52492e8c835',
      firstName: 'Tom',
      lastName: 'Sawyer',
      phoneNumber: '+1-214-555-7294',
      email: 'tom@email.fake',
      type: UserType.Admin,
    }

    beforeEach(() => {
      localStorage.setItem(LS_USERS_KEY, JSON.stringify([mockUser]))
    })

    it('update user successfully', async () => {
      const updatedUser = { ...mockUser, email: 'tom@email.com', }
      const result = await userService.update(updatedUser)

      expect(result).toEqual(updatedUser)

      const stored = JSON.parse(localStorage.getItem(LS_USERS_KEY)!)
      expect(stored).toHaveLength(1)
      expect(stored[0]).toEqual(updatedUser)
    })

    it('throw an error if trying to update a user that does not exist', async () => {
      await expect(userService.update({ ...mockUser, _id: '123', email: 'tom@email.com', }))
        .rejects.toThrow('Could not update user')
    })
  })

  describe('create', () => {
    it('create a new user successfully', async () => {
      vi.spyOn(crypto, 'randomUUID').mockReturnValue('ff899ea1-5397-42b4-996d-f52492e8c840')

      const newUser = {
        firstName: 'Aldo',
        lastName: 'Solano',
        email: 'aldo.solano@test.com',
        phoneNumber: '+1-214-555-7294',
        type: UserType.Basic,
      }

      const created = await userService.create(newUser)

      expect(created).toEqual({ ...newUser, _id: 'ff899ea1-5397-42b4-996d-f52492e8c840' })

      const stored = JSON.parse(localStorage.getItem(LS_USERS_KEY)!)
      expect(stored).toEqual([created])
    })
  })
})
// all functions here are used to handle user data and settings

import { promises as fs } from 'fs'
import * as argon2 from 'argon2'
import { usersFilePath } from '../common/constants'
import { createUser } from '../common/types'
import type { PublicUser, User } from '../common/types'

// ensure the users file exists
// - if it does not exist, create it
// - throw an error if we cant or if the error is not ENOENT (error no entry)
export async function ensureUsersFile(filePath: string): Promise<void> {
  try {
    await fs.access(filePath)
  } catch (error) {
    if ((error as { code: string }).code === 'ENOENT') {
      await fs.writeFile(filePath, JSON.stringify([]))
    } else {
      throw error
    }
  }
}

// get the users from the file, parsing as JSON
async function getUsers(filePath: string): Promise<User[]> {
  const data = await fs.readFile(filePath, 'utf-8')
  return JSON.parse(data)
}

// save the users to the file, stringifying as JSON
async function saveUser(users: User[]): Promise<void> {
  await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2))
}

// register a new user
// - accepts a username, password, and serial number
// - hashes the password with argon2
// - checks if the user already exists
// - checks if the maximum number of users has been reached
// - creates a new user object if pass all checks and write to disk
// - otherwise throws an error that is caught by the ipc handler
export async function registerUser(
  username: string,
  password: string,
  serialNumber: string,
): Promise<void> {
  const users = await getUsers(usersFilePath)
  if (users.some((user) => user.username === username)) {
    throw new Error('User already exists')
  }

  if (users.length === 10) {
    throw new Error('Maximum number of users reached')
  }

  const passwordHash = await argon2.hash(password)
  const newUser: User = createUser({ username, passwordHash, serialNumber })

  users.push(newUser)
  await saveUser(users)
}

// set the user settings
// - accepts a username, mode, and settings
// - finds the user by username
// - sets the mode settings and last used mode
// - writes the updated user to disk
// - otherwise throws an error that is caught by the ipc handler
export async function setUser(
  username: string,
  mode: 'VOO' | 'AOO' | 'VVI' | 'AAI' | 'OFF',
  settings: Record<string, number>,
): Promise<void> {
  const users = await getUsers(usersFilePath)
  const user = users.find((u) => u.username === username)
  if (!user) {
    throw new Error('User not found')
  }

  user.modes[mode] = settings
  user.lastUsedMode = mode
  await saveUser(users)
}

// login a user
// - accepts a username and password
// - finds the user by username
// - verifies the password with argon2
// - returns the public user object if all checks pass
// - otherwise throws an error that is caught by the ipc handler
export async function loginUser(username: string, password: string): Promise<PublicUser> {
  const users = await getUsers(usersFilePath)
  const user = users.find((u) => u.username === username)
  if (!user) {
    throw new Error('User not found')
  }

  if (!(await argon2.verify(user.passwordHash, password))) {
    throw new Error('Incorrect password')
  }

  return { username, serialNumber: user.serialNumber, lastUsedMode: user.lastUsedMode }
}

// get the settings for a mode
// - accepts a username and mode
// - finds the user by username
// - returns the settings for the mode
// - otherwise throws an error that is caught by the ipc handler
export async function getSettingsForMode(username: string, mode: string): Promise<Partial<User>> {
  const users = await getUsers(usersFilePath)
  const user = users.find((u) => u.username === username)
  if (!user) {
    throw new Error('User not found')
  }

  return user.modes[mode]
}

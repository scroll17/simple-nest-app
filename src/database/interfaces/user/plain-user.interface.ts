import { User } from '@entities/user'

export interface IPlainUser extends Omit<User, 'password'> {}
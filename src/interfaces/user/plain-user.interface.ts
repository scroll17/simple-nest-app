import { User } from '@entities/user';

export type IPlainUser = Omit<User, 'password'>;

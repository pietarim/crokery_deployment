import { User } from '../models/user';
import { UserType } from '../types';

export const getUsers = async () => {
  const users = await User.findOne({
    where: { id: 1 },
    include: [
      {
        model: User,
        as: 'friends',
        attributes: ['id', 'username'],
        through: {
          attributes: [],
        },
      }
    ],
    attributes: ['id', 'username']
  });
  return users;
};

export const getUser = async (id: number) => {
  const user = await User.findByPk(id);
  return user;
};

export const getUserByRefreshToken = async (token: string) => {
  const user = await User.findOne({ where: { refreshToken: token } });
  return user;
};

export const getUserByUsername = async (username: string) => {
  const user = await User.findOne({ where: { username: username } });
  return user;
};

export const createUser = async (user: UserType) => {
  const savedUser = await User.create(user);
  const user2 = await User.findAll({ where: { username: user.username } });
  return user2;
};

export const updateUser = async (user: User, id: number) => {
  await User.update(user, {
    where: {
      id,
    },
  });
};

export const deleteUser = async (id: number) => {
  await User.destroy({
    where: {
      id,
    },
  });
};

export const addRefreshtoken = async (id: number, token: string) => {
  await User.update(
    {
      refreshToken: token,
    },
    {
      where: {
        id,
      },
    }
  );
};

export const removeRefreshtoken = async (id: number) => {
  await User.update(
    {
      refreshToken: null,
    },
    {
      where: {
        id,
      },
    }
  );
};
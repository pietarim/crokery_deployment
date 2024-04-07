import { sequelize } from "../config/db";
import { Response } from "express";
import { parseString } from "../config/utils";
import bcrypt from "bcrypt";
import { User } from "../models/user";
import { getUsers } from "../query/user";
import { NewUser } from "../types/types";

export const createUser = async (user: NewUser) => {
  const { username, password, email } = user;
  const parsedUsername = parseString(username);
  const parsedPassword = parseString(password);
  const parsedEmail = parseString(email);

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(parsedPassword, saltRounds);
  const newUser = await User.create({
    username: parsedUsername,
    passwordHash,
    email: parsedEmail,
    isAdmin: false,
  });

  return newUser;
};

export const updateUser = async (req, res: Response) => {
  const { username, password, email } = req.body;
  const parsedUsername = parseString(username);
  const parsedPassword = parseString(password);
  const parsedEmail = parseString(email);

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(parsedPassword, saltRounds);

  await User.update(
    {
      username: parsedUsername,
      passwordHash,
      email: parsedEmail,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  );

  res.status(200).json({ message: "User updated" });
};

export const getUsersController = async (req, res: Response) => {
  const users = await getUsers();
  res.status(200).json(users);
};
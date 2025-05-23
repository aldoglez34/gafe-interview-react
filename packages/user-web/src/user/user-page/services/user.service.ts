import { User } from "../../user.mjs";
import { LS_USERS_KEY } from "../utils/constants";

const getUsersFromLocalStorage = (): User[] => {
  const lsUsers = localStorage.getItem(LS_USERS_KEY);
  return lsUsers ? JSON.parse(lsUsers) : [];
}

// these services are only for demo purposes, in a real app you would use an axios instance to call an API

// GET
const find = async (): Promise<User[]> => {
  try {
    return getUsersFromLocalStorage();
  } catch (err) {
    console.log({ err });
    throw new Error("Could not find users");
  }
};

// GET
const findById = async (userId: string): Promise<User> => {
  try {
    const users = getUsersFromLocalStorage();
    return users.find(user => user._id === userId) || {} as User;
  } catch (err) {
    console.log({ err });
    throw new Error("Could not find user");
  }
};

// PATCH
// this should only contain the fields that were updated, but for this demo i am sending all of the fields so it's more like a PUT
const update = async (user: User): Promise<User> => {
  try {
    const users = getUsersFromLocalStorage();
    const userToUpdate = users.find(({ _id }) => _id === user._id);
    if (!userToUpdate) {
      throw new Error(`User ${user._id} not found`);
    }
    const updatedUser = { ...userToUpdate, ...user };
    localStorage.setItem(LS_USERS_KEY, JSON.stringify([...users.filter(({ _id }) => _id !== user._id), updatedUser]));
    return updatedUser;
  } catch (err) {
    console.log({ err });
    throw new Error("Could not update user");
  }
};

// POST
const create = async (user: Omit<User, '_id'>): Promise<User> => {
  try {
    const users = getUsersFromLocalStorage();
    const newUserWithId = { ...user, _id: crypto.randomUUID() };
    localStorage.setItem(LS_USERS_KEY, JSON.stringify([...users, newUserWithId]));
    return newUserWithId;
  } catch (err) {
    console.log({ err });
    throw new Error("Could not create user");
  }
};

export default { create, find, findById, update }
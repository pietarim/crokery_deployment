import { NewRecipesItem, ItemCategory, TokenUser } from '../types/types';

export const parseIncredient = (item: unknown): NewRecipesItem => {
  if (
    typeof item === 'object' &&
    item !== null &&
    'name' in item &&
    'amount' in item &&
    'id' in item
  ) {
    const ing = item as {
      name: unknown, amount: unknown, id: unknown;
    };

    if (typeof ing.name !== 'string') {
      throw new Error('Invalid incredient name');
    }

    if (
      typeof ing.amount !== 'string') {
      throw new Error('Invalid incredient amount');
    }

    if (typeof ing.id !== 'number') {
      throw new Error('Invalid incredient id');
    }
    return ing as NewRecipesItem;
  }

  throw new Error('Invalid incredient');
};

export const parseCategory = (category: unknown): ItemCategory => {
  if (typeof category === 'string' && Object.values(ItemCategory).includes(category as ItemCategory)) {
    return category as ItemCategory;
  }
  throw new Error('Invalid category');
};

export const parseUser = (user: unknown): TokenUser => {
  if (
    typeof user === 'object' &&
    user !== null &&
    'username' in user &&
    'id' in user &&
    'email' in user
  ) {
    const usr = user as { username: unknown, id: unknown; email: unknown; };

    if (typeof usr.username !== 'string') {
      throw new Error('Invalid username');
    }

    if (typeof usr.id !== 'number') {
      throw new Error('Invalid id');
    }

    if (typeof usr.email !== 'string') {
      throw new Error('Invalid email');
    }

    return usr as TokenUser;
  }

  throw new Error('Invalid user');
};

export const parseString = (username: unknown): string => {
  if (typeof username === 'string') {
    return username;
  }
  throw new Error('Invalid name');
};

export const parseDescription = (description: unknown): string => {
  if (typeof description === 'string') {
    return description;
  }
  throw new Error('Invalid description');
};

export const parseNumber = (ownerId: unknown): number => {
  if (typeof ownerId === 'number') {
    return ownerId;
  }
  throw new Error('Invalid ownerId');
};

export const parseBoolean = (global: unknown): boolean => {
  if (typeof global === 'boolean') {
    return global;
  }
  throw new Error('Invalid global');
};
export interface LoggedInUser {
  username: string;
  token: string;
}

export type LoggedInUserState = LoggedInUser | null;

export interface LoggedInUserProp {
  user: LoggedInUserState;
}

export interface Recipe {
  id: number;
  name: string;
  description: string;
  ownerId: number;
  global: boolean;
  imageUri?: string;
}

export type RecipeToSave = Omit<Recipe, 'id' | 'ownerId'>;

interface User {
  username: string;
  token: string;
}

type UserState = User | null;

export interface SetUserProp {
  setUser: (user: UserState) => void;
}
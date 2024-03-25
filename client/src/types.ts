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

export interface FormikProps {
  field: {
    name: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  };
  form: {
    touched: { [field: string]: boolean; };
    errors: { [field: string]: string; };
  };
}

export interface FormikPropsWithTextarea {
  field: {
    name: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onBlur: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  };
  form: {
    touched: { [field: string]: boolean; };
    errors: { [field: string]: string; };
  };
}

export interface DbItem {
  id: number;
  name: string;
  unitSize: string;
  type: string;
  recipeToItem: RecipeToItem;
  pricePerUnit: number;
  updatedAt: Date;
  brand: string;
  createdAt: Date;
  price: number;
  category: string;
}

export interface FormRecipe {
  name: string;
  description: string;
  global: boolean;
  imageUri?: string;
  incredients: SelectedItem[];
}

export interface OptionsForMenu {
  category: string;
  items: DbItem[];
}

export interface SelectedItem {
  name: string;
  amount: string;
  id: number;
}
export interface Item {
  id: number;
  name: string;
  unitSize: string;
  type: string;
  recipeToItem: RecipeToItem;
}

export interface NewSelectedItem extends Item {
  updatedAt: Date;
  pricePerUnit: number;
  brand: string;
  createdAt: Date;
  price: number;
}

export interface WorkMemryItem {
  id: number;
  name: string;
  unitSize: string;
}
export interface WorkMemorySelection {
  category: string;
  items: WorkMemryItem[];
}

interface RecipeToItem {
  amount: string;
}

export interface DbRecipe extends Recipe {
  like_count: number;
  item: Item[];
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
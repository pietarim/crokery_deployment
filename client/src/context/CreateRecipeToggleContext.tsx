import { createContext, ReactNode } from 'react';

export interface CreateRecipeToggleContextType {
  titleVisible: boolean;
  imageVisible: boolean;
  itemVisible: boolean;
  toggleVisible: (visible: string) => void;
}

const defaultState = { titleVisible: true, imageVisible: false, itemVisible: false };

export const RecipeToggleContext = createContext<CreateRecipeToggleContextType>(defaultState);

/* const CreateRecipeToggleProvider = ({ children }: { children: ReactNode; }) => {

  return (
    <CreateRecipeToggleContext.Provider value={{
      titleVisible,
      imageVisible,
      itemVisible,
    }}>
      {children}
    </CreateRecipeToggleContext.Provider>
  );
};

export { CreateRecipeToggleContext, CreateRecipeToggleProvider }; */
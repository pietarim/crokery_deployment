import { createContext, useState } from 'react';
import { FormToggleChoices } from '../types';

export interface CreateRecipeToggleContextType {
  titleVisible: boolean;
  imageVisible: boolean;
  itemVisible: boolean;
  toggleVisible: (visible: FormToggleChoices) => void;
  progress: number;
}

const defaultState: CreateRecipeToggleContextType = {
  titleVisible: true,
  imageVisible: false,
  itemVisible: false,
  toggleVisible: () => { },
  progress: 33
};

export const RecipeToggleContext = createContext<CreateRecipeToggleContextType>(defaultState);

export const CreateRecipeToggleProvider = ({ children }: { children: React.ReactNode; }) => {
  const [titleVisible, setTitleVisible] = useState<boolean>(true);
  const [imageVisible, setImageVisible] = useState<boolean>(false);
  const [itemVisible, setItemVisible] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(33);

  function toggleVisible(visible: FormToggleChoices) {
    switch (visible) {
      case 'titleVisible':
        setTitleVisible(true);
        setItemVisible(false);
        setImageVisible(false);
        setProgress(33);
        break;
      case 'imageVisible':
        setImageVisible(true);
        setTitleVisible(false);
        setItemVisible(false);
        setProgress(66);
        break;
      case 'itemVisible':
        setItemVisible(true);
        setTitleVisible(false);
        setImageVisible(false);
        setProgress(100);
        break;
      default:
        break;
    }
  }

  const value: CreateRecipeToggleContextType = { titleVisible, imageVisible, itemVisible, toggleVisible, progress };

  return (
    <RecipeToggleContext.Provider value={value}>
      {children}
    </RecipeToggleContext.Provider>
  );
};
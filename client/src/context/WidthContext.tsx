import { useState, Context, createContext, useEffect } from 'react';

export const WidthContext: Context<boolean> = createContext(false);

export const WidthProvider = ({ children }: { children: React.ReactNode; }) => {
  const [isMobile, setIsMobile] = useState(false);

  const checkWindowWidth = () => {
    const isMobileView = window.innerWidth < 768;
    setIsMobile(isMobileView);
  };

  useEffect(() => {
    checkWindowWidth();

    const handleResize = () => {
      checkWindowWidth();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <WidthContext.Provider value={isMobile}>
      {children}
    </WidthContext.Provider>
  );
};
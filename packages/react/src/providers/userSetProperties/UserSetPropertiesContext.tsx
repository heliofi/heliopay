import { createContext, useContext, FC, ReactNode } from 'react';

interface UserSetPropertiesType {
  debugMode: boolean;
}

const UserSetPropertiesContext = createContext<UserSetPropertiesType | undefined>(undefined);

export const UserSetPropertiesProvider: FC<{children: ReactNode, debugMode: boolean}> = ({ children, debugMode = false }) => {

  return (
    <UserSetPropertiesContext.Provider value={{ debugMode}}>
      {children}
    </UserSetPropertiesContext.Provider>
  );
};

export const useUserSetProperties = (): UserSetPropertiesType => {
  const context = useContext(UserSetPropertiesContext);

  if (context === undefined) {
    throw new Error('userSetProperties must be used within a UserSetPropertiesProvider');
  }

  return context;
};

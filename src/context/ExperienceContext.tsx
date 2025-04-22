
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define available user roles
export type UserRole = 'visitor' | 'recruiter' | 'student' | 'fan' | null;

// Define context shape
interface ExperienceContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  experienceSelected: boolean;
  setExperienceSelected: (selected: boolean) => void;
}

// Create context with default values
const ExperienceContext = createContext<ExperienceContextType>({
  userRole: null,
  setUserRole: () => {},
  experienceSelected: false,
  setExperienceSelected: () => {},
});

// Custom hook to use the experience context
export const useExperience = () => useContext(ExperienceContext);

// Provider component
interface ExperienceProviderProps {
  children: ReactNode;
}

export const ExperienceProvider = ({ children }: ExperienceProviderProps) => {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [experienceSelected, setExperienceSelected] = useState<boolean>(false);

  return (
    <ExperienceContext.Provider
      value={{
        userRole,
        setUserRole,
        experienceSelected,
        setExperienceSelected,
      }}
    >
      {children}
    </ExperienceContext.Provider>
  );
};

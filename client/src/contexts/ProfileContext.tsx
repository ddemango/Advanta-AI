import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
  avatar?: string | null;
}

interface ProfileContextType {
  profile: ProfileData;
  setProfile: (profile: ProfileData) => void;
  updateProfile: (updates: Partial<ProfileData>) => void;
}

const defaultProfile: ProfileData = {
  firstName: "Davide",
  lastName: "DeMango",
  email: "davide@advanta.ai",
  organization: "Advanta AI"
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<ProfileData>(() => {
    // Try to load from localStorage
    const saved = localStorage.getItem('profile');
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  // Save to localStorage whenever profile changes
  useEffect(() => {
    localStorage.setItem('profile', JSON.stringify(profile));
  }, [profile]);

  const setProfile = (newProfile: ProfileData) => {
    setProfileState(newProfile);
  };

  const updateProfile = (updates: Partial<ProfileData>) => {
    setProfileState(prev => ({ ...prev, ...updates }));
  };

  return (
    <ProfileContext.Provider value={{ profile, setProfile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
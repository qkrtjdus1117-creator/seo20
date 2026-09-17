import React, { createContext, useContext, useState, useEffect } from 'react';

export type BloodSugarLog = {
  id: string;
  date: string; // ISO string
  timing: 'fasting' | 'after_breakfast' | 'after_lunch' | 'after_dinner' | 'before_sleep' | 'other';
  value: number;
  memo: string;
};

export type DietLog = {
  id: string;
  date: string;
  timing: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  food: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  sugar: number;
};

export type ExerciseLog = {
  id: string;
  date: string;
  type: string;
  duration: number; // minutes
  intensity: 'low' | 'moderate' | 'high';
  caloriesBurned: number;
  bloodSugarPre?: number;
  bloodSugarPost?: number;
};

export type UserProfile = {
  age: number;
  weight: number;
  diabetesType: 'prediabetes' | 'type1' | 'type2' | 'gestational';
  targetBloodSugarMin: number;
  targetBloodSugarMax: number;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
};

interface AppState {
  profile: UserProfile;
  bloodSugarLogs: BloodSugarLog[];
  dietLogs: DietLog[];
  exerciseLogs: ExerciseLog[];
  updateProfile: (profile: Partial<UserProfile>) => void;
  addBloodSugarLog: (log: Omit<BloodSugarLog, 'id'>) => void;
  addDietLog: (log: Omit<DietLog, 'id'>) => void;
  addExerciseLog: (log: Omit<ExerciseLog, 'id'>) => void;
}

const defaultProfile: UserProfile = {
  age: 45,
  weight: 70,
  diabetesType: 'type2',
  targetBloodSugarMin: 80,
  targetBloodSugarMax: 130,
  fitnessLevel: 'beginner',
};

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('app_profile');
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  const [bloodSugarLogs, setBloodSugarLogs] = useState<BloodSugarLog[]>(() => {
    const saved = localStorage.getItem('app_bloodSugarLogs');
    return saved ? JSON.parse(saved) : [];
  });

  const [dietLogs, setDietLogs] = useState<DietLog[]>(() => {
    const saved = localStorage.getItem('app_dietLogs');
    return saved ? JSON.parse(saved) : [];
  });

  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>(() => {
    const saved = localStorage.getItem('app_exerciseLogs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => { localStorage.setItem('app_profile', JSON.stringify(profile)); }, [profile]);
  useEffect(() => { localStorage.setItem('app_bloodSugarLogs', JSON.stringify(bloodSugarLogs)); }, [bloodSugarLogs]);
  useEffect(() => { localStorage.setItem('app_dietLogs', JSON.stringify(dietLogs)); }, [dietLogs]);
  useEffect(() => { localStorage.setItem('app_exerciseLogs', JSON.stringify(exerciseLogs)); }, [exerciseLogs]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(p => ({ ...p, ...updates }));
  };

  const addBloodSugarLog = (log: Omit<BloodSugarLog, 'id'>) => {
    setBloodSugarLogs(prev => [{ ...log, id: generateId() }, ...prev]);
  };

  const addDietLog = (log: Omit<DietLog, 'id'>) => {
    setDietLogs(prev => [{ ...log, id: generateId() }, ...prev]);
  };

  const addExerciseLog = (log: Omit<ExerciseLog, 'id'>) => {
    setExerciseLogs(prev => [{ ...log, id: generateId() }, ...prev]);
  };

  return (
    <AppContext.Provider value={{
      profile, bloodSugarLogs, dietLogs, exerciseLogs,
      updateProfile, addBloodSugarLog, addDietLog, addExerciseLog
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
}

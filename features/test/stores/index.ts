import { create } from 'zustand';

interface TestState {
  // Add your state properties here
  isLoading: boolean;
}

interface TestActions {
  // Add your actions here
  setLoading: (loading: boolean) => void;
}

type TestStore = TestState & TestActions;

export const useTestStore = create<TestStore>((set) => ({
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}));

import {create} from 'zustand';

const userinfoStore = create((set) => ({
  isVisible: true,
  toggleVisibility: () => set((state) => ({ isVisible: !state.isVisible })),
}));

export default userinfoStore;

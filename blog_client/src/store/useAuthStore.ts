import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserFields {
  id?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
  isDeleted?: boolean;
  dateJoined?: string;
  lastUpdated?: string;
}

interface UserStoreType extends UserFields {
  setUser: (user: Partial<UserFields>) => void;
  clearUser: () => void;
}

const useUserStore = create<UserStoreType>()(
  persist(
    (set) => ({
      id: undefined,
      username: undefined,
      firstName: undefined,
      lastName: undefined,
      emailAddress: undefined,
      isDeleted: false,
      dateJoined: undefined,
      lastUpdated: undefined,

      setUser: (user) =>
        set((state) => ({
          ...state,
          ...user,
        })),

      clearUser: () =>
        set({
          id: undefined,
          username: undefined,
          firstName: undefined,
          lastName: undefined,
          emailAddress: undefined,
          isDeleted: false,
          dateJoined: undefined,
          lastUpdated: undefined,
        }),
    }),
    { name: 'user-store' }
  )
);

export default useUserStore;
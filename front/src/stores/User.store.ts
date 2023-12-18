import { create } from "zustand";
import { persist } from "zustand/middleware";
import ECryptoID from "../types/ECryptoID";
import { IUser } from "../types/IUser";

interface UserState {
  user: IUser;
  create: (user: IUser) => void;
  update: (newUser: IUser) => void;
  delete: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: {
        username: "",
        email: "",
        password: "",
        isAuth: false,
        token: "",
        isAdmin: false,
        currency: ECryptoID.BITCOIN,
      },
      create: (user) =>
        set(() => {
          storeToken(user.token);
          return { user: { ...user, isAuth: true } };
        }),
      update: (newUser) =>
        set((state) => ({ user: { ...state.user, ...newUser } })),
      delete: () => set({ user: {} }),
    }),
    { name: "cryptoNewsStore" }
  )
);

export const useUser = () => {
  return useUserStore((state) => state.user);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const storeToken = (token: string | undefined) => {
  return localStorage.setItem("token", token ?? "");
};


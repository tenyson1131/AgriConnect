import { UserInterface } from "@/src/types";
import axios from "axios";
import { createContext, ReactNode, useState } from "react";

interface UserContextType {
  USER: UserInterface | null;
  loadUser: () => void;
}

export const UserContext = createContext<UserContextType>({
  USER: null,
  loadUser: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [USER, setUSER] = useState<UserInterface | null>(null);

  async function loadUser() {
    try {
      const res = await axios.get(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/api/get-user`
      );

      console.log("loaded user: ", res.data);
      setUSER(res?.data?.user);
    } catch (error) {
      console.log("error while loading user", error);
    }
  }
  return (
    <UserContext.Provider value={{ USER, loadUser }}>
      {children}
    </UserContext.Provider>
  );
};

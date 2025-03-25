import { UserInterface } from "@/src/types";
import axios from "axios";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthContext } from "./AuthContext";

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

  const { authState } = useContext(AuthContext);

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

  useEffect(() => {
    loadUser();
  }, [authState]);
  return (
    <UserContext.Provider value={{ USER, loadUser }}>
      {children}
    </UserContext.Provider>
  );
};

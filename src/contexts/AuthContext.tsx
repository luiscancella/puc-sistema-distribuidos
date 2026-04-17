import { createContext, ReactNode, useContext, useState } from "react";
import { AuthSession, SignInData, SignUpData } from "../types";

type AuthContextType = {
  session: AuthSession | null;
  signIn: (data: SignInData) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);

  const signIn = async (data: SignInData) => {
    // TODO: Implement sign-in logic here
    setSession({
      token: "dummy-token",
      user: {
        id: "user-id",
        name: "User Name",
        email: data.email,
      },
    });
  };

  const signUp = async (data: SignUpData) => {
    // TODO: Implement sign-up logic here
    setSession({
      token: "dummy-token",
      user: {
        id: "user-id",
        name: data.name,
        email: data.email,
      },
    });
  };

  const signOut = () => {
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{session, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};
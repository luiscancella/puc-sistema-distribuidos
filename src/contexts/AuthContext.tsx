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
    // 1. Validate credentials with backend
    // 2. If valid, receive token and student info
    setSession({
      token: "dummy-token",
      student: {
        id: "00000000-0000-4000-a000-000000000001",
        name: "Usuário",
        email: data.email,
        university: { id: "00000000-0000-4000-a000-000000000010", name: "Universidade" },
        courses: [],
      },
    });
  };

  const signUp = async (data: SignUpData) => {
    // TODO: Implement sign-up logic here
    // 1. Send registration data to backend
    // 2. If successful, receive token and student info
    setSession({
      token: "dummy-token",
      student: {
        id: "00000000-0000-4000-a000-000000000001",
        name: data.name,
        email: data.email,
        university: { id: data.universityId, name: "" },
        courses: [],
      },
    });
  };

  const signOut = () => {
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, signIn, signUp, signOut }}>
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

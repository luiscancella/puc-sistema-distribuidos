import { createContext, ReactNode, useContext, useState } from "react";
import { AuthSession, SignInData, SignUpData } from "../types";

type AuthContextType = {
  session: AuthSession | null;
  signIn: (data: SignInData) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  assignGroup: (groupId: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  // const [session, setSession] = useState<AuthSession | null>({
  //   token: "dummy-token",
  //   student: {
  //     id: "00000000-0000-4000-a000-000000000001",
  //     name: "Usuário",
  //     email: "user@email.com",
  //     groupId: "00000000-0000-4000-a000-000000000001",
  //   },
  // });
  const [session, setSession] = useState<AuthSession | null>(null);

  const signIn = async (data: SignInData) => {
    // TODO: Implement sign-in logic here
    setSession({
      token: "dummy-token",
      student: {
        id: "00000000-0000-4000-a000-000000000001",
        name: "Usuário",
        email: data.email,
      },
    });
  };

  const signUp = async (data: SignUpData) => {
    // TODO: Implement sign-up logic here
    setSession({
      token: "dummy-token",
      student: {
        id: "00000000-0000-4000-a000-000000000001",
        name: data.name,
        email: data.email,
      },
    });
  };

  const assignGroup = async (groupId: string) => {
    // TODO: call backend to register group membership
    if (!session) return;
    setSession({ ...session, student: { ...session.student, groupId } });
  };

  const signOut = () => {
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, signIn, signUp, assignGroup, signOut }}>
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

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { AuthSession, SignInData, SignUpData } from "../types";
import { signIn as signInRequest, signUp as signUpRequest } from "../services/auth";
import { getProfile } from "../services/profile";
import { getToken, saveToken, clearToken } from "../services/token";
import { setAuthToken, setUnauthorizedHandler } from "../services/client";

type AuthContextType = {
  session: AuthSession | null;
  restoring: boolean;
  signIn: (data: SignInData) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  assignGroup: (groupId: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [restoring, setRestoring] = useState(true);

  const signOut = () => {
    clearToken();
    setAuthToken(null);
    setSession(null);
  };

  useEffect(() => {
    setUnauthorizedHandler(signOut);
  }, []);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (token) {
        setAuthToken(token);
        try {
          const profile = await getProfile();
          setSession({ token, student: profile.student });
        } catch {
          await clearToken();
          setAuthToken(null);
        }
      }
      setRestoring(false);
    })();
  }, []);

  const signIn = async (data: SignInData) => {
    const result = await signInRequest(data);
    await saveToken(result.token);
    setAuthToken(result.token);
    setSession(result);
  };

  const signUp = async (data: SignUpData) => {
    const result = await signUpRequest(data);
    await saveToken(result.token);
    setAuthToken(result.token);
    setSession(result);
  };

  const assignGroup = async (groupId: string) => {
    if (!session) return;
    setSession({ ...session, student: { ...session.student, groupId } });
  };

  return (
    <AuthContext.Provider value={{ session, restoring, signIn, signUp, assignGroup, signOut }}>
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

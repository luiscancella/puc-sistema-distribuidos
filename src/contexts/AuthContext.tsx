import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { AuthSession, SignInData, SignUpData, Student } from "../types";
import { signIn as signInRequest, signUp as signUpRequest } from "../services/auth";
import { getProfile, registerPushToken } from "../services/profile";
import { getToken, saveToken, clearToken } from "../services/token";
import { readCache, writeCache, clearCache } from "../services/cache";
import { setAuthToken, setUnauthorizedHandler } from "../services/client";
import { registerForPushNotifications } from "../services/push";

const STUDENT_CACHE_KEY = "auth:student";

const syncPushToken = () => {
  registerForPushNotifications()
    .then((token) => {
      if (token) registerPushToken(token);
    })
    .catch(() => {});
};

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

  const persistSession = (next: AuthSession) => {
    setSession(next);
    writeCache(STUDENT_CACHE_KEY, next.student);
  };

  const signOut = () => {
    clearToken();
    clearCache(STUDENT_CACHE_KEY);
    setAuthToken(null);
    setSession(null);
  };

  useEffect(() => {
    setUnauthorizedHandler(signOut);
  }, []);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (!token) {
        setRestoring(false);
        return;
      }

      setAuthToken(token);
      const cachedStudent = await readCache<Student>(STUDENT_CACHE_KEY);

      const refresh = () =>
        getProfile()
          .then((profile) => {
            persistSession({ token, student: profile.student });
            syncPushToken();
          })
          .catch(() => {});

      if (cachedStudent) {
        setSession({ token, student: cachedStudent });
        setRestoring(false);
        refresh();
      } else {
        await refresh();
        setRestoring(false);
      }
    })();
  }, []);

  const signIn = async (data: SignInData) => {
    const result = await signInRequest(data);
    await saveToken(result.token);
    setAuthToken(result.token);
    persistSession(result);
    syncPushToken();
  };

  const signUp = async (data: SignUpData) => {
    const result = await signUpRequest(data);
    await saveToken(result.token);
    setAuthToken(result.token);
    persistSession(result);
    syncPushToken();
  };

  const assignGroup = async (groupId: string) => {
    if (!session) return;
    persistSession({ ...session, student: { ...session.student, groupId } });
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

import React, { createContext, useEffect, useState } from "react";

import { Session, User } from "@supabase/supabase-js";
import { supabaseClient } from "../../../utility/supabaseClient";
import { KSpin } from "../../../components/KSpin";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const { data: listener } = supabaseClient.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);
      }
    );
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    console.log(data);
    if (error) {
      throw new Error(error.message);
    }
    return user;
  };

  const logout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, login, logout }}>
      {loading ? <KSpin /> : <>{children}</>}
    </AuthContext.Provider>
  );
};

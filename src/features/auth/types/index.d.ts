interface AuthContextType {
    user: User | null;
    session: Session | null;
    login: (email: string, password: string) => Promise<User | null>;
    logout: () => Promise<void>;
  }
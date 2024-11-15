// /context/auth-context.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

// Define the shape of our auth context
type AuthContextType = {
  user: User | null; // Firebase User object or null if not logged in
  loading: boolean; // True while checking auth state
};

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component that wraps your app
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Will be null if logged out
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

/* 
How to use in components:

import { useAuth } from '@/context/auth-context';

function MyComponent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in</div>;
  }

  return <div>Welcome, {user.email}!</div>;
}
*/

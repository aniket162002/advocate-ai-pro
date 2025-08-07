import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useBackend } from '../hooks/useBackend';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'lawyer' | 'user';
  firstName: string;
  lastName: string;
  crnNumber?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

interface RegisterData {
  email: string;
  password: string;
  role: 'admin' | 'lawyer' | 'user';
  firstName: string;
  lastName: string;
  crnNumber?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for stored auth data on app start
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Hardcoded authentication for demo
      const demoUsers = {
        'admin@advocateai.com': {
          id: '1',
          email: 'admin@advocateai.com',
          role: 'admin' as const,
          firstName: 'Admin',
          lastName: 'User',
          password: 'admin123'
        },
        'lawyer@advocateai.com': {
          id: '2',
          email: 'lawyer@advocateai.com',
          role: 'lawyer' as const,
          firstName: 'John',
          lastName: 'Lawyer',
          crnNumber: 'CRN123456',
          password: 'lawyer123'
        },
        'user@advocateai.com': {
          id: '3',
          email: 'user@advocateai.com',
          role: 'user' as const,
          firstName: 'Jane',
          lastName: 'User',
          password: 'user123'
        }
      };

      const demoUser = demoUsers[email as keyof typeof demoUsers];
      
      if (!demoUser || demoUser.password !== password) {
        throw new Error('Invalid email or password');
      }

      // Create a simple token
      const tokenData = {
        userID: demoUser.id,
        email: demoUser.email,
        role: demoUser.role,
      };
      const authToken = Buffer.from(JSON.stringify(tokenData)).toString('base64');

      const userData = {
        id: demoUser.id,
        email: demoUser.email,
        role: demoUser.role,
        firstName: demoUser.firstName,
        lastName: demoUser.lastName,
        crnNumber: demoUser.crnNumber,
      };

      setToken(authToken);
      setUser(userData);
      localStorage.setItem('auth_token', authToken);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${userData.firstName}!`,
      });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      // Simulate registration success
      toast({
        title: "Registration Successful",
        description: "Your account has been created. Please login to continue.",
      });
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

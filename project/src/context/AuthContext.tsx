import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is already authenticated
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          try {
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (error) {
              console.error('Error fetching profile:', error);
              setIsLoading(false);
              return;
            }
            
            if (profile) {
              setCurrentUser({
                id: profile.id,
                name: profile.name,
                email: profile.email,
                isAdmin: profile.is_admin
              });
              setIsAdmin(profile.is_admin);
              setIsAuthenticated(true);
            } else {
              // No profile found, but we have a session
              console.log('No profile found for authenticated user');
              // Try to create a profile
              await createProfileForUser(session.user.id, session.user.email || '', session.user.user_metadata?.name || 'User');
            }
          } catch (profileError) {
            console.error('Error in profile fetch:', profileError);
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const createProfileForUser = async (userId: string, email: string, name: string) => {
      try {
        const { error } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            email: email,
            name: name,
            is_admin: false
          });
        
        if (error) {
          console.error('Error creating profile:', error);
          return;
        }
        
        // Set user data after profile creation
        setCurrentUser({
          id: userId,
          name: name,
          email: email,
          isAdmin: false
        });
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error in profile creation:', error);
      }
    };

    checkUser();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_IN' && session) {
          setIsLoading(true);
          try {
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (error) {
              console.error('Error fetching profile on sign in:', error);
              
              // Try to create a profile if it doesn't exist
              if (error.code === 'PGRST116') { // Record not found
                await createProfileForUser(
                  session.user.id, 
                  session.user.email || '', 
                  session.user.user_metadata?.name || 'User'
                );
              }
            } else if (profile) {
              setCurrentUser({
                id: profile.id,
                name: profile.name,
                email: profile.email,
                isAdmin: profile.is_admin
              });
              setIsAdmin(profile.is_admin);
              setIsAuthenticated(true);
            }
          } catch (error) {
            console.error('Error in auth state change handler:', error);
          } finally {
            setIsLoading(false);
          }
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
          setIsAdmin(false);
          setIsAuthenticated(false);
          setIsLoading(false);
        } else if (event === 'USER_UPDATED') {
          // Handle user update if needed
          setIsLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Login error:', error.message);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      // First, sign up the user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });
      
      if (error) {
        // Check if the error is because the user already exists
        if (error.message.includes('already registered') || error.message.includes('already exists')) {
          // Try to sign in instead
          console.log('User already exists, attempting to sign in');
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          
          if (signInError) {
            console.error('Login after signup error:', signInError.message);
            return false;
          }
          
          return true;
        }
        
        console.error('Signup error:', error.message);
        return false;
      }
      
      // If signup is successful and we have a user, manually create the profile
      // This is a fallback in case the database trigger doesn't work
      if (data.user) {
        // Check if profile already exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (!existingProfile) {
          // Create profile manually
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: email,
              name: name,
              is_admin: false
            });
            
          if (profileError) {
            console.error('Error creating profile:', profileError.message);
            // Continue anyway as the user was created
          }
        }
      }
      
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error.message);
        return;
      }
      
      // Clear user state
      setCurrentUser(null);
      setIsAdmin(false);
      setIsAuthenticated(false);
      
      // Force a page reload to clear any cached state
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      login, 
      signup,
      logout, 
      isAuthenticated, 
      isAdmin,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
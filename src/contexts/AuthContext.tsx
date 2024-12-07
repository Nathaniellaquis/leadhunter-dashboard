import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential,
} from 'firebase/auth';
import { auth } from '../firebase';

interface UserData {
  _id: string;
  email: string;
  authMethod: string;
  createdAt: string;
}

interface AuthContextProps {
  currentUser: FirebaseUser | null;
  userData: UserData | null;
  loading: boolean;
  accessToken: string | null;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signupWithGoogle: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserData: (updatedData: UserData) => void;
  refetchData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const API_BASE_URL =
    import.meta.env?.VITE_API_BASE_URL || 'http://localhost:4000';

  const getAuthHeaders = async (token?: string) => {
    const authToken = token || (await currentUser?.getIdToken());
    return {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    };
  };

  const fetchUserData = async (uid: string, token?: string) => {
    console.log('Fetching user data for uid:', uid);
    try {
      const headers = await getAuthHeaders(token);
      const response = await fetch(`${API_BASE_URL}/get-user-by-uid?uid=${uid}`, {
        headers,
      });

      if (response.ok) {
        const data: UserData = await response.json();
        setUserData(data);
      } else if (response.status === 404) {
        console.log('User not found in backend.');
        setUserData(null);
      } else {
        console.error('Failed to fetch user data. Status:', response.status);
        setUserData(null);
      }
    } catch (error) {
      console.error('Error fetching user data from backend:', error);
      setUserData(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const token = await user.getIdToken();
        setAccessToken(token);
        await fetchUserData(user.uid, token);
      } else {
        setUserData(null);
        setAccessToken(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = userCredential;
    const token = await user.getIdToken();

    setCurrentUser(user);
    setAccessToken(token);

    // Create user in backend
    const response = await fetch(`${API_BASE_URL}/create-user`, {
      method: 'POST',
      headers: await getAuthHeaders(token),
      body: JSON.stringify({
        email,
        uid: user.uid,
        authMethod: 'email',
      }),
    });

    if (!response.ok) {
      console.error('Failed to create user in backend. Status:', response.status);
      throw new Error('Failed to create user in backend');
    }

    const newUserData: UserData = await response.json();
    setUserData(newUserData);
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const { user } = userCredential;
    const token = await user.getIdToken();

    setCurrentUser(user);
    setAccessToken(token);
    await fetchUserData(user.uid, token);
    setLoading(false);
  };

  const signupWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);

    const userCredential: UserCredential = await signInWithPopup(auth, provider);
    const { user } = userCredential;
    const { uid, email } = user;
    const token = await user.getIdToken();

    setCurrentUser(user);
    setAccessToken(token);

    // Check if user exists
    const headers = await getAuthHeaders(token);
    const response = await fetch(`${API_BASE_URL}/get-user-by-uid?uid=${uid}`, {
      headers,
    });

    if (response.ok) {
      const existingUserData: UserData = await response.json();
      setUserData(existingUserData);
    } else if (response.status === 404) {
      // Create new user
      const createUserResponse = await fetch(`${API_BASE_URL}/create-user`, {
        method: 'POST',
        headers: await getAuthHeaders(token),
        body: JSON.stringify({
          email,
          uid,
          authMethod: 'google',
        }),
      });

      if (!createUserResponse.ok) {
        console.error('Failed to create user with Google. Status:', createUserResponse.status);
        throw new Error('Failed to create user');
      }

      const newUserData: UserData = await createUserResponse.json();
      setUserData(newUserData);
    } else {
      console.error('Failed to fetch user. Status:', response.status);
      throw new Error('Failed to fetch user');
    }

    setLoading(false);
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const userCredential: UserCredential = await signInWithPopup(auth, provider);
    const { user } = userCredential;
    const { uid } = user;
    const token = await user.getIdToken();

    setCurrentUser(user);
    setAccessToken(token);

    const headers = await getAuthHeaders(token);
    const response = await fetch(`${API_BASE_URL}/get-user-by-uid?uid=${uid}`, {
      headers,
    });

    if (response.ok) {
      const existingUserData: UserData = await response.json();
      setUserData(existingUserData);
    } else if (response.status === 404) {
      console.error('User not found in backend.');
      await signOut(auth);
      setCurrentUser(null);
      setAccessToken(null);
      setUserData(null);
      throw new Error('User does not exist. Please sign up first.');
    } else {
      console.error('Failed to fetch user. Status:', response.status);
      throw new Error('Failed to fetch user');
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUserData(null);
    setCurrentUser(null);
    setAccessToken(null);
  };

  const updateUserData = (updatedData: UserData) => {
    setUserData(updatedData);
  };

  const refetchData = async () => {
    if (currentUser) {
      const token = await currentUser.getIdToken();
      await fetchUserData(currentUser.uid, token);
    } else {
      console.warn('No current user to refetch data for.');
    }
  };

  const value: AuthContextProps = {
    currentUser,
    userData,
    loading,
    accessToken,
    signup,
    login,
    signupWithGoogle,
    loginWithGoogle,
    logout,
    updateUserData,
    refetchData,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

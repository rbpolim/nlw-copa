import { createContext, ReactNode, useEffect, useState } from "react";
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

import { api } from "../services/api";

WebBrowser.maybeCompleteAuthSession();

type UserProps = {
  name: string;
  avatarUrl: string;
}

export type AuthContextProps = {
  user: UserProps;
  isLoadingUser: boolean;
  signIn: () => Promise<void>;
}

type AuthProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextProps);

export function AuthContextProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>({} as UserProps);
  const [isLoadingUser, setIsLoadingUser] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.CLIENT_ID,
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    scopes: ['profile', 'email'],
  })

  async function signIn() {
    try {
      setIsLoadingUser(true);

      await promptAsync();
    } catch (err) {
      console.log(err);
      throw err
    } finally {
      setIsLoadingUser(false);
    }
  }

  async function signInWithGoogle(access_token: string) {
    try {
      setIsLoadingUser(true);

      const tokenResponse = await api.post('/users', {
        access_token
      })

      // Insere o token no header de todas as requisição
      api.defaults.headers.common['Authorization'] = `Bearer ${tokenResponse.data.token}`;

      // Pega os dados do usuário
      const userInfoResponse = await api.get('/me');
      setUser(userInfoResponse.data.user);
    } catch (err) {
      console.log(err)
      throw err
    } finally {
      setIsLoadingUser(false);
    }
  }

  useEffect(() => {
    if (response?.type === 'success' && response.authentication?.accessToken) {
      signInWithGoogle(response.authentication.accessToken);
    }
  }, [response])

  return (
    <AuthContext.Provider value={{
      signIn,
      isLoadingUser,
      user
    }}>
      {children}
    </AuthContext.Provider>
  )
}


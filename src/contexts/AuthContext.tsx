import { destroyCookie, parseCookies, setCookie } from 'nookies';
import { createContext, ReactNode, useState } from 'react';
import Router from 'next/router';
import { api } from '../services/apiClient';
import { setConfig } from 'next/config';


type AuthContextData = {
  user: UserProps;
  isAuthenticated: boolean;
  singIn: (credentials: SingInProps) => Promise<void>;
  singOut: () => void;
}

type UserProps = {
  id: string;
  name: string;
  email: string;
}

type SingInProps = {
  email: string;
  password: string;
}

type AuthProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);


export function singOut() {
  try {
    destroyCookie(undefined, '@nextauth.token');
    Router.push('/');
  } catch (err) {
    console.log('erro ao deslogar')
  }
}

export function AuthProvider({ children }: AuthProviderProps){
  const [user, setUser] = useState<UserProps>();
  const isAuthenticated = !!user;

  async function singIn({ email, password } : SingInProps) {
    try{
      const response = await api.post('/session', { email, password});
      // console.log(response.data);

      const { id, name, token } = response.data;
      setCookie(undefined, '@nextauth.token', token, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/"
      });

      setUser({
        id,
        name,
        email
      });

      // Passar para proximas requisições o token

      api.defaults.headers['Authorization'] = `Bearer ${token}`;

      // Redirecionar para outra página

      Router.push('/dashboard');
    }catch(err){
      console.log('Erro ao acessar', err);
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, singIn, singOut }}>
      {children}
    </AuthContext.Provider>
  )
}
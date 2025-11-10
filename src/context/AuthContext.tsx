'use client'
import { axiosInstance, useFetchData, useMutateData } from '@/hooks/useFetchData';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { jwtDecode, JwtPayload } from "jwt-decode";

interface AuthContextType {
  user: JwtPayload | null;
  login: (username: string, password: string) => void;
  logout: () => void;
  errorLogin: Error | null;
  isErrorLogin: boolean;
  isPendingLogin: boolean;
  isSuccessLogin: boolean;
  isLoadingAuth: boolean;
  dataLogin: any;
  accessToken: string | null;
  refreshToken: string | null;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [errorLogin, setErrorLogin] = useState<string | null>(null);
  const [isErrorLogin, setIsErrorLogin] = useState(false);
  const [isPendingLogin, setIsPendingLogin] = useState(false);
  const [isSuccessLogin, setIsSuccessLogin] = useState(false);
  const [dataLogin, setDataLogin] = useState<any | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null); // kosong karena pakai session
  const [refreshToken, setRefreshToken] = useState<string | null>(null); // kosong karena pakai session
  const router = useRouter();

  // cek session saat app load
  useEffect(() => {
    const checkSession = async () => {
      setIsLoadingAuth(true);
      try {
        const res = await axiosInstance.get('/auth/me');
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      }
      setIsLoadingAuth(false);
    };
    checkSession();
  }, []);

  const login = async (username: string, password: string) => {
    setIsPendingLogin(true);
    setIsErrorLogin(false);
    setIsSuccessLogin(false);
    setErrorLogin(null);

    try {
        await axiosInstance.post('/auth/login', { username, password });
        const res = await axiosInstance.get('/auth/me'); // ambil user dari session
        setUser(res.data);
        router.push('/dashboard');
   
    } catch (err: any) {
      setIsErrorLogin(true);
      setErrorLogin(err.response?.data?.message || 'Login failed');
      setUser(null);
    } finally {
      setIsPendingLogin(false);
      setIsLoadingAuth(false);
    }
  };

  const logout = async () => {
    setIsLoadingAuth(true);
    try {
      await axiosInstance.post('/auth/logout');
      setUser(null);
      setDataLogin(null);
      setIsErrorLogin(false);
      setIsSuccessLogin(false);
      router.push('/login');
    } catch (err) {
      console.error(err);
    }
    setIsLoadingAuth(false);
  };

  const context = {
    user,
    login,
    logout,
    errorLogin,
    isErrorLogin,
    isPendingLogin,
    isSuccessLogin,
    dataLogin,
    accessToken,
    refreshToken,
    isLoadingAuth
  };

  return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth harus digunakan dalam AuthProvider');
  return context;
};



// 'use client'
// import { useFetchData, useMutateData } from '@/hooks/useFetchData';
// import { useRouter } from 'next/router';
// import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
// import {jwtDecode, JwtPayload} from "jwt-decode";

// interface AuthContextType {
//   user: JwtPayload | null;
//   login: (username: string,password:string) => void;
//   logout: () => void;
//   errorLogin:Error |null,
//   isErrorLogin:boolean,
//   isPendingLogin:boolean,
//   isSuccessLogin:boolean,
//   isLoadingAuth:boolean,
//   dataLogin:any,
//   accessToken:string|null,
//   refreshToken:string|null
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: ReactNode }) {
//     const [user, setUser] = useState<JwtPayload | null>(null);
//     const [accessToken, setAccessToken] = useState<string | null>(null);
//     const [refreshToken, setRefreshToken] = useState<string | null>(null);
//     const [isLoadingAuth, setLoadingAuth] = useState(true)
//     const {mutate,data:dataLogin,error:errorLogin,isError:isErrorLogin,isSuccess:isSuccessLogin,isPending:isPendingLogin}  = useMutateData('/auth/login','login ')
//     useEffect(() => {
//         // ambil user dari localStorage saat load awal
//         setLoadingAuth(true)
//         const storedAccess = localStorage.getItem("token");
//         const storedRefresh = localStorage.getItem("refresh");
//         if (storedAccess && storedAccess.split(".").length === 3) {
//                 try {
//                 const user = jwtDecode(storedAccess);
//                 setUser(user);
//                 } catch (err) {
//                 console.error("Token invalid:", err);
//                 localStorage.removeItem("access");
//                 }
//                 if (storedAccess) setAccessToken(storedAccess);
//                 if (storedRefresh) setRefreshToken(storedRefresh);

//             } else {
//                 console.warn("Token not valid or missing");
//                 localStorage.removeItem("access");
//             }
//         setLoadingAuth(false)

        
//         }, []);

//     useEffect(()=>{
//         setLoadingAuth(true)

//         if(dataLogin && isSuccessLogin){
//             localStorage.setItem('token', dataLogin.token);
//             localStorage.setItem('refresh', dataLogin.refresh);
//             console.log(localStorage.getItem('token'))
//             console.log(localStorage.getItem('refresh'))

//         }
//         setLoadingAuth(false)

//     },[dataLogin,isSuccessLogin])

//     const login = (username: string, password:string) => {
//         setLoadingAuth(true)
//         const body = {
//             username,
//             password
//         } as any
//         mutate(body);
//         console.log('login success')
//         setLoadingAuth(false)

//     };

//     const logout = () => {
//         setLoadingAuth(true)

//         setUser(null);
//         localStorage.removeItem('token');
//         localStorage.removeItem('refresh');
//          setLoadingAuth(false)
//     };

//     const context = {
//         user,
//         login,
//         errorLogin,
//         isErrorLogin,
//         isPendingLogin,
//         isSuccessLogin,
//         dataLogin,
//         logout,
//         accessToken,
//         isLoadingAuth,
//         refreshToken

//     }

//     return (
//         <AuthContext.Provider value={context}>
//         {children}
//         </AuthContext.Provider>
//   );
// }

// // custom hook untuk akses auth
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error('useAuth harus digunakan dalam AuthProvider');
//   return context;
// };

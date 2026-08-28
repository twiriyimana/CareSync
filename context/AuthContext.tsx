// import { onAuthStateChanged,User } from "firebase/auth";
// import { doc,getDoc } from "firebase/firestore";
// import React,{createContext,useContext,useEffect,useState} from "react";
// import {auth,db} from "../firebase/config";
// export type Role="patient"|"doctor"|"admin";
// type C={user:User|null;role:Role|null;loading:boolean};
// const AuthContext=createContext<C>({user:null,role:null,loading:true});
// export function AuthProvider({children}:{children:React.ReactNode}){
//  const [user,setUser]=useState<User|null>(null); const [role,setRole]=useState<Role|null>(null); const [loading,setLoading]=useState(true);
//  useEffect(()=>onAuthStateChanged(auth,async u=>{setUser(u);if(!u){setRole(null);setLoading(false);return}try{const s=await getDoc(doc(db,"users",u.uid));setRole((s.data()?.role as Role)||"patient")}catch{setRole("patient")}finally{setLoading(false)}}),[]);
//  return <AuthContext.Provider value={{user,role,loading}}>{children}</AuthContext.Provider>
// }
// export const useAuth=()=>useContext(AuthContext);
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/config";

export type Role = "patient" | "doctor" | "admin";

type C = {
  user: User | null;
  role: Role | null;
  loading: boolean;
};

const AuthContext = createContext<C>({
  user: null,
  role: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      setUser(currentUser);

      if (!currentUser) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const userSnapshot = await getDoc(doc(db, "users", currentUser.uid));
        const savedRole = userSnapshot.data()?.role as Role | undefined;

        if (savedRole === "patient" || savedRole === "doctor" || savedRole === "admin") {
          setRole(savedRole);
        } else {
          const doctorSnapshot = await getDoc(doc(db, "doctors", currentUser.uid));
          setRole(doctorSnapshot.exists() ? "doctor" : "patient");
        }
      } catch {
        setRole(null);
      } finally {
        setLoading(false);
      }
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
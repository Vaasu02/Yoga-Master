

import { signInWithEmailAndPassword,GoogleAuthProvider,updateProfile,createUserWithEmailAndPassword ,getAuth,signOut,signInWithPopup,onAuthStateChanged} from 'firebase/auth'
import React, { createContext, useState,useEffect } from 'react'
import { app } from '../../config/firebase.init'
import axios from 'axios'


export const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loader, setLoader] = useState(true);
    const [error, setError] = useState('');

    const auth = getAuth(app);

    // signup user
    const signUp = async (email, password) => {
        try {

            setLoader(true);
            return await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            setError(error.message);
            throw error;
        }

    }

    //login user
    const login = async (email, password) => {
        try {
            setLoader(true);
            return await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.log(error);
            setError(error.message);
            throw error;
        }


    }

    // logout user
    const logout = async () => {
        try {
            // setLoader(true);
            // return await auth.signOut();
            return await signOut(auth);
        } catch (error) {
            setError(error.message);
            throw error;
        }

    }

    //update user profile
    const updateUser = async (name, photo) => {
        try {
            // setLoader(true);
            await updateProfile(auth.currentUser, { displayName: name, photoURL: photo });
            setUser(auth.currentUser);
        } catch (err) {
            setError(error.code);
            throw err;
        }

    }

    //using google login
    const googleProvider = new GoogleAuthProvider();
    // googleProvider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    const googleLogin = async () => {
        try {
            setLoader(true);
            return await signInWithPopup(auth, googleProvider);

        }
        catch (error) {
            setError(error.code);
            throw error;

        }
    }

    // get the currently signedin user
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);

            if (user) {
                axios.post('http://localhost:5000/api/set-token', { email: user.email, naem: user.displayName })
                    .then((data) => {
                        if (data.data.token) {
                            localStorage.setItem('token', data.data.token);
                            setLoader(false);
                        }
                    })
            }else{
                localStorage.removeItem('token');
                setLoader(false);
            }
        })
        return ()=>unsubscribe()
    }, [])



    const contextVale = { user, signUp, login, logout, updateUser, googleLogin,error,setError,loader,setLoader }
    return (
        <AuthContext.Provider value={contextVale}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
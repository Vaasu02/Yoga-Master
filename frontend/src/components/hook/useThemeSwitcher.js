import React, { useEffect, useState } from 'react'

const useThemeSwitcher = () => {


    const preferDarkQuery="(prefers-color-scheme: dark)";
    const [mode, setMode] = useState("");

    useEffect(()=>{
        const mediaquery=window.matchMedia(preferDarkQuery);
        const userPref=window.localStorage.getItem("theme");//for storing user preference in localstorage so that if they visit again their choice will be same

        const handlechange=()=>{
            if(userPref){
                let check=userPref==="dark"?"dark":"light";
                setMode(check);
                if(check==="dark"){
                    document.documentElement.classList.add("dark");
                }else{
                    document.documentElement.classList.remove("dark");
                }
            }else{//this is the condition for if user is entering our websie first time
                let check=mediaquery.matches?"dark":"light";
                setMode(check);

                if(check==="dark"){
                    document.documentElement.classList.add("dark");
                }else{
                    document.documentElement.classList.remove("dark");
                }
            }
        }

        handlechange();

        mediaquery.addEventListener("change",handlechange);

        return()=> mediaquery.removeEventListener("change", handlechange);
    },[])
  
    useEffect(()=>{
        if(mode==="dark"){
            window.localStorage.setItem("theme","dark");
            document.documentElement.classList.add("dark");
        }
        if(mode === "light"){
            window.localStorage.setItem("theme","light");
            document.documentElement.classList.remove("dark");
        }
    },[mode])
  
    return [mode,setMode]
}

export default useThemeSwitcher
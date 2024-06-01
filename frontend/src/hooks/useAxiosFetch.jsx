import React from 'react'
import { useEffect } from 'react'
import axios from 'axios';

const useAxiosFetch = () => {
  const axiosInstance=axios.create({
    baseURL:'http://localhost:5000/',
  });

  useEffect(()=>{
    const requestInterceptor = axios.interceptors.request.use((config)=>{
      return config;
    },function(err){
      return Promise.reject(err);
    });

    //response interceptor
    const responseInterceptor = axios.interceptors.response.use((response)=>{
      return response;
    },function(err){
      return Promise.reject(err);
    
    })

    return ()=>{
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    
    }
  },[axiosInstance])

  return axiosInstance;
}

export default useAxiosFetch
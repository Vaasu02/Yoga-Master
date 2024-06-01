import React from 'react'
import useUser from '../hooks/useUser';
import { Navigate } from 'react-router-dom';

const DashBoardNavigate = () => {
    const { currentUser, isLoading } = useUser();
    const role = currentUser?.role;
    // const role='user'

    if(isLoading){
        return <div>Loading...</div>
    }
    
    if(role==='admin') return <Navigate to="/dashboard/admin-home" replace />
    if(role==='instructor') return <Navigate to="/dashboard/instructor-cp" replace />
    if(role==='user') return <Navigate to="/dashboard/student-cp" replace />
}

export default DashBoardNavigate
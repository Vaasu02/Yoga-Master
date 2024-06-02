import React, { useState } from 'react'
import useAuth from '../hooks/useAuth';
import useUser from '../hooks/useUser';
import { BiHomeAlt, BiLogInCircle, BiSelectMultiple } from 'react-icons/bi';
import { Link, Outlet } from 'react-router-dom';
import { FaHome, FaUser } from 'react-icons/fa';
import { BsFillPostcardFill } from 'react-icons/bs'
import { TbBrandAppleArcade } from 'react-icons/tb'
import { NavLink, useNavigate } from 'react-router-dom'
import { MdExplore, MdOfflineBolt, MdPayment, MdPendingActions } from 'react-icons/md'
import { GiFigurehead } from 'react-icons/gi'
import { IoMdDoneAll, IoMdSchool } from 'react-icons/io'
import { SiGoogleclassroom, SiInstructure } from 'react-icons/si'
import Swal from 'sweetalert2'
import Scroll from '../hooks/useScroll';
import HashLoader from 'react-spinners/HashLoader';

const adminNavItem = [
    { to: "/dashboard/admin-home", icon: <BiHomeAlt className='text-2xl' />, label: "Dashboard Home" },
    { to: "/dashboard/manage-users", icon: <FaUser className='text-2xl' />, label: "Manage Users" },
    { to: "/dashboard/manage-class", icon: <BsFillPostcardFill className='text-2xl' />, label: "Manage Class" },
    { to: "/dashboard/manage-applications", icon: <TbBrandAppleArcade className='text-2xl' />, label: "Applications" }
]

const lastMenuItems = [
    { to: "/", icon: <BiHomeAlt className='text-2xl' />, label: "Main Home" },
    { to: "/trending", icon: <MdOfflineBolt className='text-2xl' />, label: "Trending" },
    { to: "/browse", icon: <GiFigurehead className='text-2xl' />, label: "Following" },
]

const instructorNavitem = [
    { to: "/dashboard/instructor-cp", icon: <FaHome className='text-2xl' />, label: "Home" },
    { to: "/dashboard/add-class", icon: <MdExplore className='text-2xl' />, label: "Add A class" },
    { to: "/dashboard/my-classes", icon: <IoMdSchool className='text-2xl' />, label: "My Classes" },
    { to: "/dashboard/my-pending", icon: <MdPendingActions className='text-2xl' />, label: "Pending Courses" },
    { to: "/dashboard/my-approved", icon: <IoMdDoneAll className='text-2xl' />, label: "Approved Classes" },
]

const students = [
    { to: "/dashboard/student-cp", icon: <BiHomeAlt className='text-2xl' />, label: "Dashboard" },
    { to: "/dashboard/enrolled-class", icon: <SiGoogleclassroom className='text-2xl' />, label: "My Enroll" },
    { to: "/dashboard/my-selected", icon: <BiSelectMultiple className='text-2xl' />, label: "My Selected" },
    { to: "/dashboard/my-payments", icon: <MdPayment className='text-2xl' />, label: "Payment History" },
    { to: "/dashboard/apply-instructor", icon: <SiInstructure className='text-2xl' />, label: "Apply for Instructor" },
]


const DashboardLayout = () => {
    const [open, setOpen] = useState(true);
    const { loader, logout } = useAuth();
    const { currentUser } = useUser();
    const navigate = useNavigate();
    const role = currentUser?.role;

    const handleLogout = () => {

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Logout!"
        }).then((result) => {
            if (result.isConfirmed) {
                logout().then(Swal.fire({
                    title: "Logged Out Successfully!",
                    text: "Your file has been LoggedOut.",
                    icon: "success"
                })).catch((err) => console.group(err))
            }
            navigate("/");
        });
    }

    // const role = "user";

    if(loader){
        return <div className='flex justify-center items-center h-screen' >
          <HashLoader color="#FF1949" size={50} />
        </div>
      
      }
    return (
        <div className="flex">
            <div className={`${open ? "w-72 overflow-y-auto" : "w-[90px] overflow-auto"} bg-white h-screen p-5 md:block hidden pt-8 relative duration-300`}>
                <div className={`${open ? " gap-x-1 flex items-center" : "gap-x-5 flex items-center"}`}>
                    <img onClick={() => setOpen(!open)} className={`cursor-pointer h-[40px] duration-500 ${open && "rotate-[360deg]"} rounded-full`} src="/logo.jpg" alt="notfound" />
                    <Link to="/" >
                        <h1 onClick={() => setOpen(!open)} className={`text-dark-primary cursor-pointer font-bold origin-left text-xl duration-200${!open && "scale-0"} `}>Yoga Master</h1></Link>
                </div>

                {/* NavLinks */}
                {/* admin roles */}
                {
                    role === "admin" && (<ul className="pt-6">
                        <p className={`ml-3 mb-2 text-gray-500 ${!open && "hidden"}`}> <small>MENU</small> </p>
                        {
                            role === "admin" && adminNavItem.map((menuItem, index) => (
                                <li key={index} className='mb-2' >
                                    <NavLink to={menuItem.to} className={({ isActive }) => `flex ${isActive ? "bg-red-500 text-white" : "text-[#413F44]"}duration-150 rounded-md p-2 cursor-pointer hover:bg-secondary hover:text-white font-bold text-sm items-center gap-x-4`} >
                                        {menuItem.icon}<span className={`${!open && "hidden"} origin-left duration-200`}>{menuItem.label}</span>
                                    </NavLink>
                                </li>
                            ))
                        }
                    </ul>
                    )}

                {/* instructor roles */}
                {
                    role === "instructor" && (<ul className="pt-6">
                        <p className={`ml-3 mb-2 text-gray-500 ${!open && "hidden"}`}> <small>MENU</small> </p>
                        {
                            instructorNavitem.map((menuItem, index) => (
                                <li key={index} className='mb-2' >
                                    <NavLink to={menuItem.to} className={({ isActive }) => `flex ${isActive ? "bg-red-500 text-white" : "text-[#413F44]"}duration-150 rounded-md p-2 cursor-pointer hover:bg-secondary hover:text-white font-bold text-sm items-center gap-x-4`} >
                                        {menuItem.icon}<span className={`${!open && "hidden"} origin-left duration-200`}>{menuItem.label}</span>
                                    </NavLink>
                                </li>
                            ))
                        }
                    </ul>
                    )}

                {/* student route */}
                {
                    role === "user" && (<ul className="pt-6">
                        <p className={`ml-3 mb-2 text-gray-500 ${!open && "hidden"}`}> <small>MENU</small> </p>
                        {
                            students.map((menuItem, index) => (
                                <li key={index} className='mb-2' >
                                    <NavLink to={menuItem.to} className={({ isActive }) => `flex ${isActive ? "bg-red-500 text-white" : "text-[#413F44]"}duration-150 rounded-md p-2 cursor-pointer hover:bg-secondary hover:text-white font-bold text-sm items-center gap-x-4`} >
                                        {menuItem.icon}<span className={`${!open && "hidden"} origin-left duration-200`}>{menuItem.label}</span>
                                    </NavLink>
                                </li>
                            ))
                        }
                    </ul>
                    )}
                <ul className="pt-6">
                    <p className={`ml-3 text-gray-500 uppercase mb-3 ${!open && "hidden"}`}>
                        <small>Useful Links</small>
                    </p>
                    {
                        lastMenuItems.map((menuItem, index) => (
                            <li key={index} className='mb-2' >
                                <NavLink to={menuItem.to} className={({ isActive }) => `flex ${isActive ? "bg-red-500 text-white" : "text-[#413F44]"}duration-150 rounded-md p-2 cursor-pointer hover:bg-secondary hover:text-white font-bold text-sm items-center gap-x-4`} >
                                    {menuItem.icon}<span className={`${!open && "hidden"} origin-left duration-200`}>{menuItem.label}</span>
                                </NavLink>
                            </li>
                        ))
                    }
                    <li>
                        <NavLink onClick={() => handleLogout()} className="flex duration-150 rounded-md p-2 cursor-pointer hover:bg-secondary hover:text-white font-bold text-sm items-center gap-x-4" >
                            <BiLogInCircle className='text-2xl' />
                            <span className={`${!open && "hidden"} origin-left duration-200`}>Logout</span>
                        </NavLink>
                    </li>
                </ul>
            </div>

            <div className='h-screen overflow-y-auto px-8 flex-1' >
                <Scroll/>
                <Outlet/>
            </div>
        </div>
    )
}

export default DashboardLayout
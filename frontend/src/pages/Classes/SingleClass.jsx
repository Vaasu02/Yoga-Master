import React, { useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import useUser from '../../hooks/useUser';
import useAxiosFetch from '../../hooks/useAxiosFetch';
import useAxiosSecure from '../../hooks/useAxiosSecure';
// import axiosSecure from '../../hooks/useAxiosSecure'

import { FaLanguage, FaLevelUpAlt, FaUser, FaUsers } from 'react-icons/fa'
import { MdBookOnline } from 'react-icons/md'
import {BiTime} from 'react-icons/bi'




const SingleClass = () => {
    const course = useLoaderData();
    // console.log(course);
    const { currentUser } = useUser();
    // console.log(currentUser?.role);
    const role = currentUser?.role;
    const [enrolledClasses, setenrolledClasses] = useState([]);
    const axiosFetch = useAxiosFetch();
    const axiosSecure = useAxiosSecure();


    const handleSelect = (id) => {
        // console.log(id);
        axiosSecure.get(`/enrolled-classes/${currentUser?.email}`)
            .then(res => setenrolledClasses(res.data))
            .catch(err => console.log(err))
        if (!currentUser) {
            alert("Please login to enroll in a class");
            return navigate('/login');
        }
    
    
        axiosSecure.get(`/cart-item/${id}?email=${currentUser?.email}`)
            .then(res => {
                if (res.data.classId === id) {
                    return alert("You have already added this class to your cart");
                } else if (enrolledClasses.find(item => item.classes._id === id)) {
                    // console.log(item);
                    return alert("You have already enrolled in this class");
                } else {
                    const data = {
                        classId: id,
                        userMail: currentUser.email,
                        date: new Date()
                    }
                    axiosSecure.post('/add-to-cart', data)
                        .then(res => {
                            alert("Class added to cart");
                            console.log(res.data);
                        }).catch(err => console.log(err))
                }
            })
    }




    return (
        <>
            <div className='font-gilroy font-medium text-gray dark:text-white text-lg leading-[27px] w-[90%] mx-auto'
                data-new-gr-c-s-check-Loaded="14.1157.e"
                date-gr-ext-installed=""
            >
                {/* header */}
                <div className="breadcrumbs bg-primary py-20 mt-20 section-padding bg-cover bg-center bg-no-repeat">
                    <div className='container text-center'>
                        <h2 className="">Course Details</h2>
                    </div>
                </div>

                <div className="nav-tab-rapper tabs section-padding mt-8">
                    <div className="container">
                        <div className="grid grid-cols-12 md:gap-[30px]">
                            <div className="lg:col-span-8 col-span-12">
                                <div className="single-course details">
                                    <div className="xl:h-[470px] h-[350px] mb-10 course-main-thumb">
                                        <img src={course?.image} alt="notfound"
                                            className='rounded-md object-fill w-full h-full block' />
                                    </div>
                                    <h2 className="text-2xl mb-2">{course?.name}</h2>

                                    <div className="author-meta mt-6 sm:flex lg:space-x-16 sm:space-x-5 space-y-5 sm:space-y-0 items-center">
                                        <div className="flex space-x-4 items-center group">
                                            <div className="flex-none">
                                                <div className="h-12 w-12 rounded">
                                                    <img src="https://i.ibb.co/864425K/yoga-practice-indoors-2021-08-30-02-28-57-utc.jpg" alt="" className='object-cover w-full h-full rounded' />
                                                </div>
                                            </div>

                                            <div className="flex-1">
                                                <p className="text-secondary">
                                                    Trainer
                                                    <a href="#" className='text-black'  >
                                                        : {course.instructorName}
                                                    </a>
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-secondary">Last Update:
                                                <a href="#" className='text-black ml-1' >
                                                    {new Date(course.submitted).toLocaleDateString()}
                                                </a>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="nav-tab-wrapper mt-12">
                                        <ul id='tabs-nav' className="course-tab mb-8">
                                            <li className="active">
                                                <a href="#tab1">Overview</a>
                                            </li>
                                            <li>
                                                <a href="#tab2">Curriculum</a>
                                            </li>
                                            <li>
                                                <a href="#tab3">Instructor</a>
                                            </li>
                                            <li>
                                                <a href="#tab4">Reviews</a>
                                            </li>
                                        </ul>
                                        <div id="tabs-content">
                                            <div id="tab1" className='tab-content'>
                                                <div>
                                                    <h3 className="text-2xl mt-8">Course Descriptions</h3>
                                                    <p className="mt-4">
                                                        This tutorial will help you learn quickly and
                                                        thoroughly Lorem ipsum, OF lipsum as it sometimes
                                                        known, is dummy text used in laying out print,
                                                        graphic or web designs. Lorem Ipsum dolor sit amet,
                                                        consectetuer adipiscing elit. Donec odio. Quisque
                                                        volutpat mattis eros.
                                                        <br /> <br /> You'll be exposed to principles and
                                                        strategies, but, more importantly, you'll learn how
                                                        actually apply these abstract concepts by coding
                                                        three different websites for three very different
                                                        the audiences. Lorem ipsum is dummy text used in
                                                        laying out print, graphic or web designs Lorem ipsum
                                                        blinding shot chinwag knees.
                                                    </p>
                                                    <div className="bg-[#F8F8F8] dark:bg-indigo-500 space-y-6 p-8 rounded-md my-8">
                                                        <h4 className="text-2xl">What you will Learn?</h4>
                                                        <ul className="grid sm:grid-cols-2 grid-cols-1 gap-6">
                                                            <li className="flex space-x-3">
                                                                <div className="flex-none relative top-1">
                                                                    <img src="https://i.ibb.co/864425K/yoga-practice-indoors-2021-08-30-02-28-57-utc.jpg" alt="" className='h-[40px] w-[50px]' />
                                                                </div>
                                                                <div className="flex-1">
                                                                    Learn how perspective works and how to  incorporate your art
                                                                </div>
                                                            </li>
                                                            <li className="flex space-x-3">
                                                                <div className="flex-none relative top-1">
                                                                    <img src="https://i.ibb.co/864425K/yoga-practice-indoors-2021-08-30-02-28-57-utc.jpg" alt="" className='h-[40px] w-[50px]' />
                                                                </div>
                                                                <div className="flex-1">
                                                                    Learn how perspective works and how to  incorporate your art
                                                                </div>
                                                            </li>
                                                            <li className="flex space-x-3">
                                                                <div className="flex-none relative top-1">
                                                                    <img src="https://i.ibb.co/864425K/yoga-practice-indoors-2021-08-30-02-28-57-utc.jpg" alt="" className='h-[40px] w-[50px]' />
                                                                </div>
                                                                <div className="flex-1">
                                                                    Learn how perspective works and how to  incorporate your art
                                                                </div>
                                                            </li>
                                                            <li className="flex space-x-3">
                                                                <div className="flex-none relative top-1">
                                                                    <img src="https://i.ibb.co/864425K/yoga-practice-indoors-2021-08-30-02-28-57-utc.jpg" alt="" className='h-[40px] w-[50px]' />
                                                                </div>
                                                                <div className="flex-1">
                                                                    Learn how perspective works and how to  incorporate your art
                                                                </div>
                                                            </li>




                                                        </ul>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-2xl">What you will Learn?</h4>
                                                        <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 mt-5">
                                                            <div className="bg-white rounded px-5 py-[18pк] flex shadow-box2 space-x-[10px] items-center">
                                                                <span className="flex-none">
                                                                    <img src="https://i.ibb.co/864425K/yoga-practice-indoors-2021-08-30-02-28-57-utc.jpg" alt="" className='h-[40px] w-[50px]' />
                                                                </span>
                                                                <span className="flex-1 text-black">
                                                                    Computer/Mobile
                                                                </span>

                                                            </div>
                                                            <div className="bg-white rounded px-5 py-[18pк] flex shadow-box2 space-x-[10px] items-center">
                                                                <span className="flex-none">
                                                                    <img src="https://i.ibb.co/864425K/yoga-practice-indoors-2021-08-30-02-28-57-utc.jpg" alt="" className='h-[40px] w-[50px]' />
                                                                </span>
                                                                <span className="flex-1 text-black">
                                                                    Paper &amp; Pencil
                                                                </span>

                                                            </div>
                                                            <div className="bg-white rounded px-5 py-[18pк] flex shadow-box2 space-x-[10px] items-center">
                                                                <span className="flex-none">
                                                                    <img src="https://i.ibb.co/864425K/yoga-practice-indoors-2021-08-30-02-28-57-utc.jpg" alt="" className='h-[40px] w-[50px]' />
                                                                </span>
                                                                <span className="flex-1 text-black">
                                                                    Internet Connect
                                                                </span>

                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div id="tab2" className='tab-content' >
                                                <div>
                                                    <h3 className="text-2xl mt-8">Lesson Plan</h3>
                                                    <p className="mt-4">
                                                        This tutorial will help you learn quickly and
                                                        thoroughly Lorem ipsum, OF lipsum as it sometimes
                                                        known, is dummy text used in laying out print,
                                                        graphic or web designs. Lorem Ipsum dolor sit amet,
                                                        consectetuer adipiscing elit. Donec odio. Quisque
                                                        volutpat mattis eros.
                                                        <br /> <br /> You'll be exposed to principles and
                                                        strategies, but, more importantly, you'll learn how
                                                        actually apply these abstract concepts by coding
                                                        three different websites for three very different
                                                        the audiences. Lorem ipsum is dummy text used in
                                                        laying out print, graphic or web designs Lorem ipsum
                                                        blinding shot chinwag knees.
                                                    </p>
                                                    <div className="bg-[#F8F8F8] dark:bg-indigo-500 space-y-6 p-8 rounded-md my-8">
                                                        <h4 className="text-2xl">This Course is For Beginner</h4>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-2xl mt-8">What you will Learn?</h3>
                                                        <p className="mt-4">
                                                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis vitae dolorum eius, sed quibusdam laudantium commodi est ad exercitationem iste molestias suscipit sit voluptatem blanditiis provident. Facere provident, perferendis cupiditate molestiae facilis suscipit non sapiente aperiam nostrum quis debitis soluta.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* right side */}
                            <div className="lg:col-span-4 col-span-12 mt-8 md:mt-0">
                                <div className="sidebarWrapper space-y-[30px]">
                                    <div className="wdiget custom-text space-y-5">
                                        <a href="#" className="h-[220px] rounded relative block">
                                            <img src={course.image} alt="" className='block w-full h-full object-cover rounded' />
                                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                                                <img src="https://i.ibb.co/864425K/yoga-practice-indoors-2021-08-30-02-28-57-utc.jpg" alt="noimg" className='h-[40px] w-[50px]' />
                                            </div>
                                        </a>
                                        <h3>${course.price}</h3>
                                        <button onClick={() => handleSelect(course._id)}
                                            title={role === 'admin' || role === 'instructor' ? 'Instructor/Admin can not be able to select' ? course.availableSeats < 1 : 'No seat available' : 'You can select Classes'}
                                            disabled={role === 'admin' || role === 'instructor' || course.availableSeats < 1}

                                            className='btn btn-primary w-full text-center bg-secondary py-2 px-6 text-white'>Enroll Now</button>
                                        <ul className='list'>
                                            <li className="flex space-x-3 border-b border-[#ECECEC] mb-4 pb-4 last:pb-0 past:mb-0 last:border-0">
                                                <div className="flex-1 space-x-3 flex items-center">
                                                    <FaUser className='inline-flex' />
                                                    <div className="text-black font-semibold">
                                                        Instructor
                                                    </div>
                                                </div>
                                                <div className='flex-none' >
                                                    {course.instructorName}
                                                </div>
                                            </li>

                                            <li className="flex space-x-3 border-b border-[#ECECEC] mb-4 pb-4 last:pb-0 past:mb-0 last:border-0">
                                                <div className="flex-1 space-x-3 flex items-center">
                                                    <MdBookOnline />
                                                    <div className="text-black font-semibold">
                                                        Lectures
                                                    </div>
                                                </div>
                                                <div className='flex-none' >
                                                    23
                                                </div>
                                            </li>
                                            <li className="flex space-x-3 border-b border-[#ECECEC] mb-4 pb-4 last:pb-0 past:mb-0 last:border-0">
                                                <div className="flex-1 space-x-3 flex items-center">
                                                    <BiTime />
                                                    <div className="text-black font-semibold">
                                                        Duration
                                                    </div>
                                                </div>
                                                <div className='flex-none' >
                                                    2Hr 36Minutes
                                                </div>
                                            </li>

                                            <li className="flex space-x-3 border-b border-[#ECECEC] mb-4 pb-4 last:pb-0 past:mb-0 last:border-0">
                                                <div className="flex-1 space-x-3 flex items-center">
                                                    <FaUsers />
                                                    <div className="text-black font-semibold">
                                                        Enrolled
                                                    </div>
                                                </div>
                                                <div className='flex-none' >
                                                    {course.totalEnrolled}
                                                </div>
                                            </li>

                                            <li className="flex space-x-3 border-b border-[#ECECEC] mb-4 pb-4 last:pb-0 past:mb-0 last:border-0">
                                                <div className="flex-1 space-x-3 flex items-center">
                                                    <FaLevelUpAlt />
                                                    <div className="text-black font-semibold">
                                                        Course Level
                                                    </div>
                                                </div>
                                                <div className='flex-none' >
                                                    Intermediate
                                                </div>
                                            </li>

                                            <li className="flex space-x-3 border-b border-[#ECECEC] mb-4 pb-4 last:pb-0 past:mb-0 last:border-0">
                                                <div className="flex-1 space-x-3 flex items-center">
                                                    <FaLanguage />
                                                    <div className="text-black font-semibold">
                                                        Language
                                                    </div>
                                                </div>
                                                <div className='flex-none' >
                                                    English
                                                </div>
                                            </li>
                                        </ul>
                                        <ul className="flex space-x-4 items-center pt-7">
                                            <li className="text-black font-semibold">Share On:</li>
                                            <li>
                                                <a href="#" className='flex h-10 w-10'
                                                >
                                                    <img src="https://i.ibb.co/864425K/yoga-practice-indoors-2021-08-30-02-28-57-utc.jpg" alt="no" />
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#" className='flex h-10 w-10'
                                                >
                                                    <img src="https://i.ibb.co/864425K/yoga-practice-indoors-2021-08-30-02-28-57-utc.jpg" alt="no" />
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#" className='flex h-10 w-10'
                                                >
                                                    <img src="https://i.ibb.co/864425K/yoga-practice-indoors-2021-08-30-02-28-57-utc.jpg" alt="no" />
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#" className='flex h-10 w-10'
                                                >
                                                    <img src="https://i.ibb.co/864425K/yoga-practice-indoors-2021-08-30-02-28-57-utc.jpg" alt="no" />
                                                </a>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="wdiget">
                                        <h4 className="widget-title">Related Courses:</h4>
                                        <ul className="list mt-5">
                                            <li className="flex space-x-4 border-[#ECECEC] pb-6 mb-6 last:pb-0 last:mb-0 last:border-0 border-b">
                                                <div className="flex-none">
                                                    <div className="h-20 w-20 rounded">
                                                        <img src="https://i.ibb.co/864425K/yoga-practice-indoors-2021-08-30-02-28-57-utc.jpg" alt="no" className='w-full h-full object-cover rounded'
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    {/* <div className="flex space-x-3 mb-2">
                                                        <iconify-icon>
                                                            icon="heroicons:star-20-solid"
                                                            className="text-tertiary"
                                                        </iconify-icon>
                                                        <iconify-icon>
                                                            icon="heroicons:star-20-solid"
                                                            className="text-tertiary"
                                                        </iconify-icon>
                                                        <iconify-icon>
                                                            icon="heroicons:star-20-solid"
                                                            className="text-tertiary"
                                                        </iconify-icon>
                                                        <iconify-icon>
                                                            icon="heroicons:star-20-solid"
                                                            className="text-tertiary"
                                                        </iconify-icon>
                                                        <iconify-icon>
                                                            icon="heroicons:star-20-solid"
                                                            className="text-tertiary"
                                                        </iconify-icon>
                                                    </div> */}
                                                    <div className='mb-1 font-semibold text-black'>
                                                        Greatest Passion In...
                                                    </div>
                                                    <span className="text-secondary font-semibold">
                                                        $38.00
                                                    </span>
                                                    
                                                </div>
                                            </li>
                                            <li className="flex space-x-4 border-[#ECECEC] pb-6 mb-6 last:pb-0 last:mb-0 last:border-0 border-b">
                                                <div className="flex-none">
                                                    <div className="h-20 w-20 rounded">
                                                        <img src="https://i.ibb.co/864425K/yoga-practice-indoors-2021-08-30-02-28-57-utc.jpg" alt="no" className='w-full h-full object-cover rounded'
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    
                                                    <div className='mb-1 font-semibold text-black'>
                                                        Greatest Passion In...
                                                    </div>
                                                    <span className="text-secondary font-semibold">
                                                        $38.00
                                                    </span>
                                                </div>
                                            </li>
                                            <li className="flex space-x-4 border-[#ECECEC] pb-6 mb-6 last:pb-0 last:mb-0 last:border-0 border-b">
                                                <div className="flex-none">
                                                    <div className="h-20 w-20 rounded">
                                                        <img src="https://i.ibb.co/864425K/yoga-practice-indoors-2021-08-30-02-28-57-utc.jpg" alt="no" className='w-full h-full object-cover rounded'
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    
                                                    <div className='mb-1 font-semibold text-black'>
                                                        Greatest Passion In...
                                                    </div>
                                                    <span className="text-secondary font-semibold">
                                                        $38.00
                                                    </span>
                                                </div>
                                            </li>

                                        </ul>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SingleClass
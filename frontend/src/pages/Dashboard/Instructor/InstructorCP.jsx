import React from 'react'
import bgimg from '../../../assets/gallery/instructor.jpg'

const InstructorCP = () => {
  return (
    <div>
        <div className="h-screen my-5">
            <h1 className="text-2xl font-bold">Instructor DashBoard</h1>
            <img src={bgimg} alt="" className='md:w-3/5' />
        </div>
    </div>
  )
}

export default InstructorCP
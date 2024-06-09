import { createBrowserRouter } from "react-router-dom"
import MainLayout from "../layout/MainLayout"
import Home from '../pages/Home/Home'
import Instructors from '../pages/Instructors/Instructors'
import Classes from '../pages/Classes/Classes'
import Login from "../pages/user/Login"
import Register from "../pages/user/Register"
import SingleClass from "../pages/Classes/SingleClass"
import DashboardLayout from "../layout/DashboardLayout"
import Dashboard from "../pages/Dashboard/Dashboard"
import StudentsCP from "../pages/Dashboard/Student/StudentsCP"
import EnrolledClasses from "../pages/Dashboard/Student/Enroll/EnrolledClasses"
import SelectedClass from "../pages/Dashboard/Student/SelectedClass"
import MyPaymentHistory from "../pages/Dashboard/Student/Payment/History/MyPaymentHistory"
import AsInstructor from "../pages/Dashboard/Student/Apply/AsInstructor"
import Payment from "../pages/Dashboard/Student/Payment/Payment"
import InstructorCP from "../pages/Dashboard/Instructor/InstructorCP"
import AddClass from "../pages/Dashboard/Instructor/AddClass"
import MyClasses from "../pages/Dashboard/Instructor/MyClasses"
import PendingCourse from "../pages/Dashboard/Instructor/PendingCourse"
import Approvedcourse from "../pages/Dashboard/Instructor/Approvedcourse"

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: "instructors",
        element: <Instructors />
      },
      {
        path: "classes",
        element: <Classes />

      },
      {
        path:'/login',
        element:<Login/>
      },
      {
        path:'/register',
        element:<Register/>
      },
      {
        path:'/class/:id',
        element:<SingleClass/>,
        loader:({params})=>fetch(`http://localhost:5000/class/${params.id}`)
      }
    ]
  },

  {
    path:"/dashboard",
    element:<DashboardLayout/>,
    children:[
      {
        index:true,
        element:<Dashboard/>
      },
      {
        path:"student-cp",
        element:<StudentsCP/>
      },
      {
        path:"enrolled-class",
        element:<EnrolledClasses/>
      },
      {
        path:"my-selected",
        element:<SelectedClass/>
      },
      {
        path:"my-payments",
        element:<MyPaymentHistory/>
      },
      {
        path:"apply-instructor",
        element:<AsInstructor/>
      },
      {
        path:"user/payment",
        element:<Payment/>
      },

      // instructor routes
      {
        path:"instructor-cp",
        element:<InstructorCP/>
      },
      {
        path:"add-class",
        element:<AddClass/>
      },
      {
        path:'my-classes',
        element:<MyClasses/>
      },
      {
        path:"my-pending",
        element:<PendingCourse/>
      },
      {
        path:"my-approved",
        element:<Approvedcourse/>
      }
    ]
  }
  
])

export default router
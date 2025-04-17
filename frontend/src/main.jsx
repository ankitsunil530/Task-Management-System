import { children, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './pages/Layout.jsx'
import Home from './components/Home.jsx'
import AboutUs from './pages/AboutUs.jsx'
import Services from './pages/Services.jsx'
import Login from './components/Login.jsx'
import Contact from './pages/Contact.jsx'
import SignUp from './components/SignUp.jsx'
import Layout1 from './UserPages/Layout1.jsx'
import UserDashboard from './UserPages/UserDashboard.jsx'
import TaskCreation from './UserPages/TaskCreate.jsx'
import Tasks from './UserPages/Tasks.jsx'
import AdminDashboard from './adminpanel/AdminDashboard.jsx'
import {Provider} from 'react-redux'
import store from './app/store.js'
const router=createBrowserRouter([
  {
    path:'/',
    element:<Layout/>,
    children:[
      {
        path:'',
        element:<Home/>
      },
      {
        path:'/about',
        element:<AboutUs/>
      },
      {
        path:'/services',
        element:<Services/>
      },
    
    {
      path:'/contact',
      element:<Contact/>
    }
   
    ]
  },
  {
    path:'/login',
    element:<Login/>, 
  },
  {
  path:'/user',
  element:<Layout1/>,
  children:[
  

    {
      path:'/user',
      element:<UserDashboard/>,
    },
    {
      path:'create-task',
      element:<TaskCreation/>
    },
    {
      path:'tasks',
      element:<Tasks/>
    }
  ]
  },
  {
     path:'/admin',
     element:<AdminDashboard/>
  },
  {
    path:'/signup',
    element:<SignUp/>
  },

])
  

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <RouterProvider router={router}/>
    <ToastContainer position="top-center" autoClose={3000} />
    </Provider>
   
  </StrictMode>,
)

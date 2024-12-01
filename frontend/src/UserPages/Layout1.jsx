import React from 'react'

import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
function Layout1() {
  return (
   <>
      <Header/>
      <Outlet/>
      <Footer/>
   </>
  )
}

export default Layout1
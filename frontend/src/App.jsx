
import Home from './components/Home'
import Layout from './pages/Layout'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import AboutUs from './pages/AboutUs';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Header from './components/Header';
import Footer from './components/Footer';
import SignUp from './components/SignUp';
import TaskCreation from './authentication/TaskCreation';
function App() {
  return (
    <BrowserRouter>
      
      <Routes>
                <Route path='/signup' element={<SignUp/>}/>
                <Route path="/" element={<Layout/>}/>
                
                <Route index element={<Home/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/task' element={<TaskCreation/>}/>
                <Route path='/about' element={<AboutUs/>}/>
                <Route path='/services' element={<Services/>}/>
                <Route path='/contact' element={<Contact/>}/>
                <Route path="header" element={<Header/>}/>
                <Route path="footer" element={<Footer/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;

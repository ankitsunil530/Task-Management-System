// eslint-disable-next-line no-unused-vars
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

function Header() {
  // Use the useNavigate hook for programmatic navigation
  const navigate = useNavigate();

  // Handle click event for the Login button
  const handleLoginClick = () => {
    navigate('/login'); // Navigate to the login page using useNavigate
  };

  return (
    <>
      <header className="bg-gray-800 p-6 flex justify-between items-center shadow-lg">
        {/* Logo */}
        <div className="flex items-center">
          <img 
            src="https://preview.redd.it/hi-this-is-a-logo-for-the-task-manager-application-called-v0-si3hzlaglc7b1.png?width=640&crop=smart&auto=webp&s=04d231d246026a59f988ac183a82e0ea2ca8ef4e" 
            alt="Logo" 
            className="h-10 w-10 mr-4"
          />
          <h1 className="text-white text-2xl font-bold font-style-italic">taskphiles</h1>
        </div>

        {/* Navigation */}
        <div className="flex space-x-8">
          <NavLink className={
            ({isActive})=>`${
              isActive ? "text-blue-500 text-xl hover:text-gray-400 cursor-pointer" : "text-white text-xl hover:text-gray-400 cursor-pointer"}`
          } 
          to={"/"}>Home</NavLink>
          <NavLink className={
            ({isActive})=>
              `${
                isActive?"text-blue-500 text-xl hover:text-gray-400 cursor-pointer":"text-white text-xl hover:text-gray-400 cursor-pointer"
              }`
            
          }
           to={"/about"}>About</NavLink>
          <NavLink className={
            ({isActive})=>
              `${ isActive?"text-blue-500 text-xl hover:text-gray-400 cursor-pointer":"text-white text-xl hover:text-gray-400 cursor-pointer"
            }`
          } 
          to={"/services"}>Services</NavLink>
          <NavLink className={
            ({isActive})=>
              `${ isActive?"text-blue-500 text-xl hover:text-gray-400 cursor-pointer":"text-white text-xl hover:text-gray-400 cursor-pointer"
            }`
          }  to={"/contact"}>Contact</NavLink>
        </div>

        {/* Login Button */}
        <button 
          className="bg-blue-500 text-white text-lg px-6 py-2 rounded hover:bg-blue-600 focus:outline-none"
          onClick={handleLoginClick} // Call handleLoginClick on button click
        >
          Login
        </button>
      </header>
    </>
  );
}

export default Header;

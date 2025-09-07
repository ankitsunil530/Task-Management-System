// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa"; // For mobile menu icons

function Header() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Handle Login
  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center cursor-pointer">
            <img
              src="https://preview.redd.it/hi-this-is-a-logo-for-the-task-manager-application-called-v0-si3hzlaglc7b1.png?width=640&crop=smart&auto=webp&s=04d231d246026a59f988ac183a82e0ea2ca8ef4e"
              alt="Logo"
              className="h-10 w-10 mr-3 rounded-full"
            />
            <h1 className="text-white text-2xl font-bold italic tracking-wide">
              taskphiles
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-10">
            {["/", "/about", "/services", "/contact"].map((path, idx) => {
              const names = ["Home", "About", "Services", "Contact"];
              return (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    `relative text-lg font-medium ${
                      isActive ? "text-blue-400" : "text-white"
                    } hover:text-blue-400 transition duration-300`
                  }
                >
                  {names[idx]}
                  {/* Underline animation */}
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-full"></span>
                </NavLink>
              );
            })}
          </nav>

          {/* Login Button */}
          <div className="hidden md:flex">
            <button
              className="bg-blue-500 text-white text-lg px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition"
              onClick={handleLoginClick}
            >
              Login
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-gray-800 bg-opacity-95 text-center py-6 space-y-6">
            {["/", "/about", "/services", "/contact"].map((path, idx) => {
              const names = ["Home", "About", "Services", "Contact"];
              return (
                <NavLink
                  key={path}
                  to={path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block text-lg font-medium ${
                      isActive ? "text-blue-400" : "text-white"
                    } hover:text-blue-400`
                  }
                >
                  {names[idx]}
                </NavLink>
              );
            })}
            <button
              className="bg-blue-500 text-white text-lg px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition"
              onClick={handleLoginClick}
            >
              Login
            </button>
          </div>
        )}
      </header>
    </>
  );
}

export default Header;

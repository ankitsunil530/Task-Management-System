import axios from 'axios';
import React from 'react';
import { FaUserCircle, FaCog } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AdminHeader = () => {
  const logout = async () => {
    try {
      
      await axios.post('/api/auth/logout', {}, {
        withCredentials: true, 
      });
  
      
      localStorage.removeItem('token');
  
      
      window.location.href = '/login'; 
    } catch (error) {
      console.error("Error logging out", error);
    }
  };
  return (
    <header className="bg-blue-600 shadow-md p-4 flex justify-between items-center">
      {/* Logo/Title */}
      <div className="flex items-center space-x-4">
        <h1 className="text-white text-2xl font-semibold">Admin Dashboard</h1>
      </div>

      {/* Navigation */}
      {/* <nav className="hidden md:flex space-x-6 text-white">
        <Link to="/admin/dashboard" className="hover:text-gray-200 transition-colors">
          Dashboard
        </Link>
        <Link to="/admin/tasks" className="hover:text-gray-200 transition-colors">
          Tasks
        </Link>
        <Link to="/admin/users" className="hover:text-gray-200 transition-colors">
          Users
        </Link>
        <Link to="/admin/settings" className="hover:text-gray-200 transition-colors">
          Settings
        </Link>
      </nav> */}
      <button
            onClick={() => {
              logout(); 
            }}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            Logout
          </button>
      {/* Profile and Settings */}
      <div className="flex items-center space-x-6">
        <button className="relative">
          <FaUserCircle className="text-white text-3xl" />
          <span className="absolute top-0 right-0 bg-red-500 text-xs text-white rounded-full w-4 h-4 flex items-center justify-center">1</span>
        </button>

        <button className="text-white hover:text-gray-200">
          <FaCog className="text-2xl" />
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;

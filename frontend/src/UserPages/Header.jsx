import React from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const Header = ( ) => {
    const nav = useNavigate();
  return (
    <header className="bg-gray-800 text-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Profile Info */}
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">taskphiles</h1>
          {/* <span className="text-lg font-semibold">ankitsunil530</span> */}
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          <NavLink
            to="/user"
            className={({ isActive }) =>
              isActive
                ? ' font-semibold text-blue-800'
                : 'text-white hover:text-gray-200'
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="tasks"
            className={({ isActive }) =>
              isActive
                ? ' font-semibold text-blue-800'
                : 'text-white hover:text-gray-200'
            }
          >
            View Tasks
          </NavLink>
          <button 
          className="bg-blue-800 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
          onClick={()=>{nav('create-task')}}
          >
            Create Task
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;

import React from 'react';
import { NavLink } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-8">
      <div className="container mx-auto py-4 px-6">
        {/* Left Section */}
        <div className="text-sm text-center">
          <p>&copy; {new Date().getFullYear()} taskphiles. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

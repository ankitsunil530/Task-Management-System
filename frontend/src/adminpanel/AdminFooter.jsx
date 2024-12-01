import React from 'react';

const AdminFooter = () => {
  return (
    <footer className="bg-blue-600 text-white p-6 mt-8">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row flex flex-row place-content-center">
        {/* Left Section: Copyright */}
        <div className="flex flex-row place-content-center md:text-left mb-4 md:mb-0">
          <p className="text-sm">&copy; {new Date().getFullYear()} Admin Panel. All rights reserved.</p>
        </div>

        {/* Right Section: Social Media Links (optional) */}
        {/* <div className="flex space-x-6">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-200 transition-colors"
          >
            <i className="fab fa-facebook text-xl"></i>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-200 transition-colors"
          >
            <i className="fab fa-twitter text-xl"></i>
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-200 transition-colors"
          >
            <i className="fab fa-linkedin text-xl"></i>
          </a>
        </div> */}
      </div>
    </footer>
  );
};

export default AdminFooter;

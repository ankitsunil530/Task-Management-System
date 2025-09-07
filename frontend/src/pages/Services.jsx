import React from "react";
import { FaTasks, FaUsers, FaBell, FaChartLine } from "react-icons/fa";
import servicesbg from "../images/servicesbg.jpg"; // Make sure path is correct

function Services() {
  return (
    <div
      className="bg-cover bg-center min-h-screen flex items-center justify-center"
      style={{ backgroundImage: `url(${servicesbg})` }}
    >
      {/* Dark overlay */}
      <div className="bg-black bg-opacity-70 w-full h-full py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          {/* Heading */}
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
            Our <span className="text-indigo-400">Services</span>
          </h1>
          <p className="text-lg md:text-xl max-w-3xl text-gray-200 mx-auto mb-16">
            We provide everything you need to stay on top of your tasks and boost
            team productivity. Whether you're working solo or with a team,
            TaskMaster has the right tools for you.
          </p>

          {/* Services grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Service 1 */}
            <div className="bg-gradient-to-br from-white to-gray-100 shadow-lg rounded-2xl p-8 transform hover:-translate-y-2 hover:shadow-2xl transition duration-300">
              <FaTasks className="text-5xl text-indigo-600 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Task Management
              </h2>
              <p className="text-gray-600">
                Create, assign, and organize tasks easily. Track progress and
                complete work on time without hassle.
              </p>
            </div>

            {/* Service 2 */}
            <div className="bg-gradient-to-br from-white to-gray-100 shadow-lg rounded-2xl p-8 transform hover:-translate-y-2 hover:shadow-2xl transition duration-300">
              <FaUsers className="text-5xl text-indigo-600 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Team Collaboration
              </h2>
              <p className="text-gray-600">
                Work seamlessly with your team. Assign tasks, share updates, and
                collaborate in real-time with ease.
              </p>
            </div>

            {/* Service 3 */}
            <div className="bg-gradient-to-br from-white to-gray-100 shadow-lg rounded-2xl p-8 transform hover:-translate-y-2 hover:shadow-2xl transition duration-300">
              <FaBell className="text-5xl text-indigo-600 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Real-time Notifications
              </h2>
              <p className="text-gray-600">
                Stay updated instantly with task alerts, deadline reminders, and
                important project notifications.
              </p>
            </div>

            {/* Service 4 */}
            <div className="bg-gradient-to-br from-white to-gray-100 shadow-lg rounded-2xl p-8 transform hover:-translate-y-2 hover:shadow-2xl transition duration-300">
              <FaChartLine className="text-5xl text-indigo-600 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Analytics & Reports
              </h2>
              <p className="text-gray-600">
                Get detailed insights with reports and analytics to measure
                productivity and track your progress.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;

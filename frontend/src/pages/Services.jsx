import React from 'react';
import { FaTasks, FaUsers, FaBell, FaChartLine } from 'react-icons/fa'; // Icons from react-icons
import servicesbg from '../images/servicesbg.jpg'; // Ensure the path to your background image is correct

function Services() {
  return (
    <div 
      className="bg-cover bg-center h-full py-16" 
      style={{ backgroundImage: `url(${servicesbg})` }} // Adding the background image
    >
      <div className="bg-black bg-opacity-50 h-full py-16">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-extrabold text-white mb-8">Our Services</h1>
          <p className="text-lg max-w-2xl text-white mx-auto mb-12">
            We offer a wide range of services designed to help you manage your tasks more efficiently. Our platform is built to streamline your workflow, whether you are working alone or in a team.
          </p>
          
          {/* Services grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Service 1: Task Management */}
            <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <FaTasks className="text-4xl text-indigo-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Task Management</h2>
              <p className="text-gray-600">
                Create, assign, and organize tasks with ease. Track progress and stay on top of your work.
              </p>
            </div>
            
            {/* Service 2: Team Collaboration */}
            <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <FaUsers className="text-4xl text-indigo-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Team Collaboration</h2>
              <p className="text-gray-600">
                Work seamlessly with your team. Assign tasks, set priorities, and collaborate in real-time.
              </p>
            </div>
            
            {/* Service 3: Real-time Notifications */}
            <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <FaBell className="text-4xl text-indigo-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Real-time Notifications</h2>
              <p className="text-gray-600">
                Stay updated with real-time notifications on task updates, deadlines, and more.
              </p>
            </div>
            
            {/* Service 4: Analytics and Reports */}
            <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <FaChartLine className="text-4xl text-indigo-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Analytics and Reports</h2>
              <p className="text-gray-600">
                Gain insights with detailed analytics and reports to track progress and productivity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;

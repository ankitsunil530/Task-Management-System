import React from 'react';
import aboutbg from '../images/aboutbg.jpg';
import aboutImage from '../images/aboutImage.jpg';

function AboutUs() {
  return (
    <div
      className="bg-cover bg-center min-h-screen"
      style={{ backgroundImage: `url(${aboutbg})` }}
    >
      <div className="bg-black bg-opacity-50 min-h-screen flex justify-center items-center p-10">
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          
          {/* Left: Image */}
          <div className="md:w-1/2 mb-8 md:mb-0 flex justify-center">
            <img
              src={aboutImage}
              alt="About Task Management System"
              className="rounded-lg shadow-lg max-h-[400px] object-cover"
            />
          </div>

          {/* Right: Content */}
          <div className="md:w-1/2 text-white md:pl-10 bg-gray-900/60 p-6 rounded-lg shadow-lg">
            <h1 className="text-5xl font-extrabold text-center md:text-left mb-6">
              About Us
            </h1>
            <div className="space-y-4 text-center md:text-left">
              <p className="text-xl leading-relaxed">
                Welcome to our Task Management System! We provide an efficient
                platform where users can register, log in, and manage their tasks
                seamlessly. Whether it's a simple to-do list or complex project
                management, our platform empowers you to stay organized and on top
                of your tasks.
              </p>
              <p className="text-lg leading-relaxed">
                We are constantly improving the platform to make it more
                user-friendly, intuitive, and feature-rich. Our system offers task
                creation, task assignment, deadline tracking, and real-time
                notifications to keep you informed at every step. We're also focused
                on building a highly customizable and scalable solution that fits
                individual users and teams alike.
              </p>
              <p className="text-lg leading-relaxed">
                Our vision is to streamline task management, reduce complexity, and
                help our users achieve their goals more efficiently. We're committed
                to providing a system that grows with your needs, supporting you
                with features like priority setting, task filtering, and advanced
                reporting tools.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AboutUs;

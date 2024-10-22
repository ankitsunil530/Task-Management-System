import React, { useState } from 'react';
import contactbg from '../images/contactbg.jpg'; // Ensure the path to your background image is correct

function ContactUs() {
  const [name, setName]=useState('');
  const [email, setEmail]=useState('');
  const [message, setMessage]=useState('');
  function handleSubmit() {
    alert(`Name: ${name}, Email: ${email}, Message: ${message}`);
      
  }
  return (
    
    <div 
      className="bg-cover bg-center h-full py-16" 
      style={{ backgroundImage: `url(${contactbg})` }} // Background image
    >
      <div className="bg-black bg-opacity-50 h-full py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-extrabold text-white text-center mb-12">Contact Us</h1>

          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Left side - Contact Form */}
            <div className="bg-gray-200 p-8 rounded-lg shadow-lg w-full md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Full Name
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="name"
                    value={name}
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    required/>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your Email"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
                    Message
                  </label>
                  <textarea
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Your Message"
                    rows="4"
                    required
                  />
                </div>
                <button
                  className="bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-indigo-700"
                  type="submit"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Right side - Contact Info */}
            <div className="text-white w-full md:w-1/2 md:pl-12">
              <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
              <p className="text-lg mb-4">
                If you have any questions or inquiries, feel free to contact us through the form or reach out to us at the details below:
              </p>
              <p className="text-lg">
                <strong>Address:</strong> 123 Task Management St, Lucknow, UP, India
              </p>
              <p className="text-lg">
                <strong>Email:</strong> support@taskmanagement.com
              </p>
              <p className="text-lg">
                <strong>Phone:</strong> +91 9876543210
              </p>
              <p className="text-lg mt-4">
                We are available from Monday to Friday, 9 AM to 6 PM.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;

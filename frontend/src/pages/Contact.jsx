import React, { useState } from 'react';
import contactbg from '../images/contactbg.jpg'; // Ensure the path to your background image is correct

function ContactUs() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(e) {
    e.preventDefault(); // Prevent page reload
    if (!name || !email || !message) {
      alert("Please fill out all fields.");
      return;
    }
    alert(`✅ Message sent!\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`);
    setName('');
    setEmail('');
    setMessage('');
  }

  return (
    <div
      className="bg-cover bg-center min-h-screen py-16"
      style={{ backgroundImage: `url(${contactbg})` }}
    >
      <div className="bg-black bg-opacity-60 min-h-screen py-16 flex items-center">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-extrabold text-white text-center mb-12 drop-shadow-lg">
            Contact Us
          </h1>

          <div className="flex flex-col md:flex-row justify-between items-start gap-10">
            {/* Left side - Contact Form */}
            <div className="bg-white/90 p-8 rounded-lg shadow-xl w-full md:w-1/2">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Get in Touch</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2" htmlFor="name">
                    Full Name
                  </label>
                  <input
                    className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your Email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2" htmlFor="message">
                    Message
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                    id="message"
                    rows="4"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Your Message"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Right side - Contact Info */}
            <div className="text-white w-full md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
              <p className="text-lg mb-4">
                If you have any questions or inquiries, feel free to contact us through the form or reach out to us at the details below:
              </p>
              <p className="text-lg mb-2">
                <strong>📍 Address:</strong> 123 Task Management St, Lucknow, UP, India
              </p>
              <p className="text-lg mb-2">
                <strong>📧 Email:</strong> support@taskmanagement.com
              </p>
              <p className="text-lg mb-2">
                <strong>📞 Phone:</strong> +91 9876543210
              </p>
              <p className="text-lg mt-4">
                🕘 Available from <strong>Monday to Friday, 9 AM - 6 PM</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;

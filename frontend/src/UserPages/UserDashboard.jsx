import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; 

const UserDashboard = () => {
  const [userData, setUserData] = useState([]); 
  const [profilePic, setProfilePic] = useState(null);
  const [tasks, setTasks] = useState([]);
  
  const fetchUserData = async () => {
    try {
      const response = await axios.get('/api/tasks/userid', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, 
        },
      });
      
      setUserData(response.data); 
      setProfilePic(response.data.profilePic || null); 
    } catch (error) {
      console.error('Error fetching user data', error);
    }
  };
  const fetchUserTasks = async () => {
    try {
      const response = await axios.get('/api/tasks/idtask', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log(response.data);
      setTasks(response.data); 
    } catch (error) {
      console.error('Error fetching tasks', error);
    }
  };
  useEffect(() => {
    fetchUserData();
    fetchUserTasks(); 
  }, []);

  
  useEffect(() => {
    console.log(userData);
  }, [userData]);
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
  if (!userData) {
    return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">User Dashboard</h1>

        {/* User Profile Section */}
        <div className="flex items-center mb-6">
          <div className="relative">
            <img
              src={profilePic || 'https:'}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
            />
            <label
              htmlFor="profilePicInput"
              className="absolute bottom-2 right-2 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600"
            >
              Upload
            </label>
            <input
              type="file"
              id="profilePicInput"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => setProfilePic(reader.result);
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>
          <div className="ml-6">
            <h2 className="text-2xl font-bold">{userData.name}</h2>
            <p className="text-gray-600">{userData.email}</p>
            <p className="text-gray-600 capitalize">{userData.role}</p>
          </div>
        </div>

        {/* User Info */}
        <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-200 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold">Total Tasks</h3>
          <div className="space-y-4">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <div key={task.id} className="bg-white shadow-md rounded-lg p-4">
                  <h4 className="text-xl font-semibold text-blue-600">{task.title}</h4>
                  <p className="text-gray-700">{task.description}</p>
                  <p className="text-gray-600 capitalize">{task.status}</p>
                </div>
              ))
            ) : (
              <p className="text-lg text-gray-500">No tasks available.</p>
            )}
          </div>
        </div>
          <div className="bg-gray-200 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">Role</h3>
            <p className="text-xl font-bold text-green-500 capitalize">{userData.role}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-between">
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Edit Profile
          </button>
          <button
            onClick={() => {
              logout(); 
            }}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

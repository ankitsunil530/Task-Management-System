import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../redux/userSlice';

const UserDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [tasks, setTasks] = useState([]);
  const dispatch = useDispatch();

  const fetchUserData = async () => {
    const sampleUser = {
      name: 'Sunil Kumar',
      email: 'sunil@example.com',
      role: 'user',
      profilePic: '',
    };
    setUserData(sampleUser);
    setProfilePic(sampleUser.profilePic || null);
  };

  const fetchUserTasks = async () => {
    try {
      const response = await axios.get('/api/tasks/usertsk', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks', error);
    }
  };

  useEffect(() => {
    fetchUserData(); // uses sample data
    fetchUserTasks(); // uses actual API
  }, []);

  const logout = () => {
    dispatch(logoutUser());
    localStorage.removeItem('token');
    toast.success('Logout successful!');
    window.location.href = '/login';
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-6">
        <h2 className="text-2xl font-semibold text-white mb-6">Dashboard</h2>
        <ul className="space-y-4">
          <li>
            <a href="/profile" className="text-lg hover:text-blue-400">Profile</a>
          </li>
          <li>
            <a href="/tasks" className="text-lg hover:text-blue-400">Tasks</a>
          </li>
          <li>
            <button onClick={logout} className="text-lg hover:text-blue-400">Logout</button>
          </li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* User Details */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-3xl font-semibold text-gray-800 mb-4">User Details</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={profilePic || 'https://via.placeholder.com/150'}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-semibold">Name</label>
                  <p className="text-lg text-gray-800">{userData.name}</p>
                </div>
                <div>
                  <label className="block text-gray-600 font-semibold">Email</label>
                  <p className="text-lg text-gray-800">{userData.email}</p>
                </div>
                <div>
                  <label className="block text-gray-600 font-semibold">Role</label>
                  <p className="text-lg text-gray-800">{userData.role}</p>
                </div>
              </div>
            </div>

            {/* Task List */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Your Tasks</h3>
              {tasks.length > 0 ? (
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div
                      key={task._id}
                      className="bg-white border border-gray-200 rounded-lg shadow-sm p-4"
                    >
                      <h4 className="text-xl font-semibold text-blue-600 mb-2">{task.title}</h4>
                      <p className="text-gray-600 mb-2">{task.description}</p>
                      <span
                        className={`inline-block px-4 py-2 text-sm rounded-full ${
                          task.status === 'completed'
                            ? 'bg-green-200 text-green-800'
                            : task.status === 'pending'
                            ? 'bg-yellow-200 text-yellow-800'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No tasks assigned.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

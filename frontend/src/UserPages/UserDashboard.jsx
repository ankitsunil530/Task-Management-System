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
      role: 'User',
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
    fetchUserData();
    fetchUserTasks();
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
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
          <ul className="space-y-4">
            <li>
              <a href="/profile" className="block py-2 px-3 rounded hover:bg-gray-700 transition">
                Profile
              </a>
            </li>
            <li>
              <a href="/tasks" className="block py-2 px-3 rounded hover:bg-gray-700 transition">
                Tasks
              </a>
            </li>
          </ul>
        </div>
        <button
          onClick={logout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded font-semibold transition"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* User Info */}
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col md:flex-row items-center md:items-start md:space-x-8">
            <img
              src={profilePic || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-blue-500 mb-4 md:mb-0 object-cover"
            />
            <div className="text-gray-800 space-y-2">
              <p>
                <span className="font-semibold">Name:</span> {userData.name}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {userData.email}
              </p>
              <p>
                <span className="font-semibold">Role:</span> {userData.role}
              </p>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Your Tasks</h3>
            {tasks.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {tasks.map((task) => (
                  <div
                    key={task._id}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-lg transition"
                  >
                    <h4 className="text-xl font-semibold text-blue-600 mb-2">{task.title}</h4>
                    <p className="text-gray-600 mb-2">{task.description}</p>
                    <span
                      className={`inline-block px-3 py-1 text-sm rounded-full ${
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
              <p className="text-gray-500">No tasks assigned yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

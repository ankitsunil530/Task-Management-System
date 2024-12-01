import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import AdminHeader from './AdminHeader';
import AdminFooter from './AdminFooter';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);

  
  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users/userdata');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  
  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks/taskData');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks', error);
    }
  };

  
  const handleDelete = async (userId) => {
    console.log('user ID to delete:', userId); 
    try {
      await axios.delete(`/api/users/delete/${userId}`);
      alert('User deleted successfully!');
      fetchUsers(); 
    } catch (error) {
      console.error('Error deleting user', error);
      alert('Failed to delete user. Please try again.');
    }
  };

  
  const handleEdit = async (userId) => {
    const newName = prompt(`Enter the new title for the user's name:`);
    if (!newName) return;

    try {
      await axios.put(`/api/users/edit/${userId}`, { name: newName });
      alert('User updated successfully!');
      fetchUsers(); 
    } catch (error) {
      console.error('Error editing user', error);
      alert('Failed to edit user. Please try again.');
    }
  };

  
  const handleTaskDelete = async (taskId) => {
    console.log('Task ID to delete:', taskId); 
    try {
      await axios.delete(`/api/tasks/delete/${taskId}`);
      alert('Task deleted successfully!');
      fetchTasks(); 
    } catch (error) {
      console.error('Error deleting task', error);
      alert('Failed to delete task. Please try again.');
    }
  };

  
  const handleTaskEdit = async (taskId) => {
    const newTitle = prompt('Enter the new title for the task:');
    if (!newTitle) return;

    try {
      await axios.put(`/api/tasks/edit/${taskId}`, { title: newTitle });
      alert('Task updated successfully!');
      fetchTasks(); 
    } catch (error) {
      console.error('Error editing task', error);
      alert('Failed to edit task. Please try again.');
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchTasks();
  }, []);

  const colorStatus = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-400';
      case 'in-progress':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };
const cmpCount=(tasks)=>{
  let cnt=0;
  tasks.forEach(task=>{
    if(task.status==="completed"){
      cnt++;
    }
  });
  return cnt;
}

const pendingCount=(tasks)=>{
  let cnt=0;
  tasks.forEach(task=>{
    if(task.status==="pending"){
      cnt++;
    }
  });
  return cnt;
}
  

  return (
    <div className="container mx-auto bg-gray-50 min-h-screen">
      <AdminHeader/>
      <h1 className="text-4xl font-bold text-center text-indigo-600 mb-8">Admin Dashboard</h1>

      {/* Overview Section */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="bg-white shadow-lg rounded-lg p-6 text-center transform hover:scale-105 transition-all duration-300">
          <h3 className="text-xl font-semibold text-indigo-500">Total Users</h3>
          <p className="text-3xl font-bold">{users.length}</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 text-center transform hover:scale-105 transition-all duration-300">
          <h3 className="text-xl font-semibold text-green-500">Active Tasks</h3>
          <p className="text-3xl font-bold">{tasks.length}</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 text-center transform hover:scale-105 transition-all duration-300">
          <h3 className="text-xl font-semibold text-gray-600">Completed Tasks</h3>
          <p className="text-3xl font-bold">{cmpCount(tasks)}</p>
        </div>
      </div>

      {/* Manage Users Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-6 flex flex-row place-content-center">Manage Users</h2>
        {users.length === 0 ? (
          <p className="text-lg text-gray-500">No users found.</p>
        ) : (
          <div className="bg-white shadow-lg rounded-lg p-4">
            <table className="min-w-full table-auto">
              <thead className="text-gray-600 text-sm uppercase bg-indigo-50">
                <tr>
                  <th className="px-4 py-3">Username</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Task Enter Date</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-t hover:bg-indigo-50">
                    <td className="px-4 py-3">{user.name}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-white ${user.status === 'active' ? 'bg-green-400' : 'bg-red-400'}`}
                      >
                        {user.created_at}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex justify-center gap-4">
                      <button
                        onClick={() => handleEdit(user.user_id)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white rounded-full p-2 transform hover:scale-105 transition-all duration-200"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(user.user_id)}
                        className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transform hover:scale-105 transition-all duration-200"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Manage Tasks Section */}
      <section>
        <h2 className="text-2xl font-semibold text-indigo-600 mb-6 flex flex-row place-content-center">Manage Tasks</h2>
        {tasks.length === 0 ? (
          <p className="text-lg text-gray-500">No tasks found.</p>
        ) : (
          <div className="bg-white shadow-lg rounded-lg p-4">
            <table className="min-w-full table-auto">
              <thead className="text-gray-600 text-sm uppercase bg-indigo-50">
                <tr>
                  <th className="px-4 py-3">Task Title</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Deadline</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.task_id} className="border-t hover:bg-indigo-50">
                    <td className="px-4 py-3">{task.title}</td>
                    <td className="px-4 py-3">{task.description}</td>
                    <td className="px-4 py-3">{task.category_name}</td>
                    <td className="px-4 py-3">{new Date(task.deadline).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-white ${colorStatus(task.status)}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex justify-center gap-4">
                      <button
                        onClick={() => handleTaskEdit(task.id)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white rounded-full p-2 transform hover:scale-105 transition-all duration-200"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleTaskDelete(task.id)}
                        className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transform hover:scale-105 transition-all duration-200"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <AdminFooter/>
    </div>
  );
};

export default AdminDashboard;

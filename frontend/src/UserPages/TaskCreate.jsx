import axios from 'axios';
import React, { useEffect, useState } from 'react';

const TaskCreate = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('low');
  const [status, setStatus] = useState('pending');
  const [deadline, setDeadline] = useState('');
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');

  const fetchUserAndCategories = async () => {
    try {
      const userResponse = await axios.get('/api/tasks/userid', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUserId(userResponse.data.user_id);
      setUsername(userResponse.data.user_id);

      const categoriesResponse = await axios.get('/api/tasks/categories');
      setCategories(categoriesResponse.data);
    } catch (error) {
      console.error('Error fetching user or categories', error);
    }
  };

  useEffect(() => {
    fetchUserAndCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!userId || !categoryId) {
    //   alert('User or Category is missing!',userId, categoryId);
    //   return;
    // }

    const newTask = {
      user_id: userId,
      title,
      description,
      priority,
      status,
      deadline,
      category_id: categoryId,
    };

    try {
      const response = await axios.post('/api/tasks/addTask', newTask, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert('Task created successfully!');
      console.log(response.data);
    } catch (error) {
      console.error('Error creating task', error);
      alert('Failed to create task. Please try again.');
    }
  };

  return (
    <div className="container mx-auto py-12 px-6">
      {/* Display logged-in user */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold text-indigo-600">Logged in as: {username}</h2>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">Create New Task</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-lg p-8 max-w-lg mx-auto">
        {/* Title */}
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full mt-2 p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-2 p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
          ></textarea>
        </div>

        {/* Priority */}
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-700">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full mt-2 p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Status */}
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-700">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full mt-2 p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
          </select>
        </div>

        {/* Deadline */}
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-700">Deadline</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full mt-2 p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
          />
        </div>

        {/* Category */}
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-700">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full mt-2 p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
          >
            <option value="">Select Category</option>
            {categories.length > 0 ? (
              categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))
            ) : (
              <option disabled>No categories available</option>
            )}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transform hover:scale-105 transition-all duration-200"
        >
          Create Task
        </button>
      </form>
    </div>
  );
};

export default TaskCreate;

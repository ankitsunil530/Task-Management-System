import React, { useState } from 'react';
import axios from 'axios';

const CategoryCreationPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newCategory = { name, description };
    try {
      const response = await axios.post('/api/category', newCategory);
      alert('Category created successfully!');
      console.log(response.data);
      setName(''); // Reset form fields
      setDescription('');
    } catch (error) {
      console.error('Error creating category', error);
      alert('Failed to create category. Please try again.');
    }
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">Create New Category</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6">
        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">Category Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full mt-2 p-2 border rounded-lg"
          />
        </div>
        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-2 p-2 border rounded-lg"
          ></textarea>
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          Create Category
        </button>
      </form>
    </div>
  );
};

export default CategoryCreationPage;

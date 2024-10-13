/* eslint-disable react/no-unescaped-entities */

import { useState } from 'react';
import { useNavigate } from "react-router-dom";
function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate=useNavigate();
  function handleSign(){
    navigate('/signup');
  }
  const handleLogin = (e) => {
    e.preventDefault();
    // Add login logic here
    alert(`Logging in with Username: ${username}, Password: ${password}`);
  };

  return (
  
    
    <div className="min-h-screen bg-white flex items-center justify-center">
      <form 
        onSubmit={handleLogin} 
        className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 p-8 rounded-lg shadow-lg w-full max-w-sm"
      >
        <h2 className="text-3xl font-bold text-center text-white mb-8">Login</h2>

        {/* Username Field */}
        <div className="mb-6">
          <label className="block text-white text-sm font-semibold mb-2" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border border-white rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-500"
            placeholder="Enter your username"
            required
          />
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <label className="block text-white text-sm font-semibold mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-white rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-500"
            placeholder="Enter your password"
            required
          />
        </div>

        {/* Login Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-yellow-500 text-black py-3 rounded-lg text-lg font-semibold hover:bg-yellow-600 focus:outline-none focus:ring-4 focus:ring-yellow-400"
          >
            Login
          </button>
        </div>
        <div className='flex flex-baseline'>
      <p className='text-slate-100 text-sm'>If you don't have an account, please register.</p>
      <button
      type='submit'
      id='sub'
      value={name}
      className="bg-blue-500 text-white text-sm px-6 py-2 rounded hover:bg-blue-600 focus:outline-none h-10 w-full"
      onClick={handleSign}
      >Sign Up</button>
      </div>
      </form>
      
      
    </div>

  
    
  );
}

export default Login;
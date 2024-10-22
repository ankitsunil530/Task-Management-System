import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [passVisible, setPassVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passErr, setPassErr] = useState('');
  const [validationError, setValidationError] = useState('');

  const validatePassword = (password) => {
    const lengthRegex = /.{8,}/;
    const upperCaseRegex = /[A-Z]/;
    const lowerCaseRegex = /[a-z]/;
    const numberRegex = /[0-9]/;
    const specialCharRegex = /[@#$%^&*!]/;

    if (!lengthRegex.test(password)) {
      return 'Password must be at least 8 characters long';
    }
    if (!upperCaseRegex.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!lowerCaseRegex.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!numberRegex.test(password)) {
      return 'Password must contain at least one digit';
    }
    if (!specialCharRegex.test(password)) {
      return 'Password must contain at least one special character (@#$%^&*!)';
    }

    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password
    const validationMessage = validatePassword(password);
    if (validationMessage) {
      setValidationError(validationMessage);
      return;
    } else if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    try {
      // Send POST request to backend
      const response = await axios.post('http://localhost:5000/api/signup', {
        name,
        email,
        username,
        password,
      });

      if (response.status === 201) {
        alert('Sign up successful');
        // Clear form
        setName('');
        setEmail('');
        setPhone('');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      console.error('There was an error signing up:', error);
      setValidationError('Failed to sign up. Please try again.');
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (passErr) setPassErr('');
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (passErr) setPassErr('');
  };

  return (
    <div className="min-h-screen flex items-center bg-gray-300 justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 p-8 rounded-lg shadow-lg w-full max-w-sm"
      >
        <h2 className="text-3xl font-bold text-center text-white mb-8">Sign Up</h2>
        
        {/* Full Name */}
        <label className="block mb-2 text-bold text-white">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border border-white rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-500"
          placeholder="Enter your name"
          required
        />
        
        {/* Username */}
        <label className="block mb-2 text-bold text-white">
          Username <span className="text-red-500">*</span>
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
        
        {/* Email */}
        <label className="block mb-2 text-bold text-white">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          className="w-full p-3 border border-white rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-500"
          type="text"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        
        {/* Phone */}
        {/* <label className="block mb-2 text-bold text-white mt-1">
          Phone <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          className="w-full p-3 border border-white rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-500"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter your phone number"
          required
        /> */}
        
        {/* Password */}
        <label className="block mb-2 text-bold text-white mt-1">
          Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={passVisible ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={handlePasswordChange}
            className="w-full p-3 border border-white rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-500"
            placeholder="Enter your password"
            required
          />
          <span>
            <FontAwesomeIcon
              icon={passVisible ? faEye : faEyeSlash}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
              onClick={() => setPassVisible(!passVisible)}
            />
          </span>
        </div>
        
        {/* Confirm Password */}
        <label className="block mb-2 text-bold text-white mt-1">
          Confirm Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={passVisible ? 'text' : 'password'}
            id="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className="w-full p-3 border border-white rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-500"
            placeholder="Confirm your password"
            required
          />
          <span>
            <FontAwesomeIcon
              icon={passVisible ? faEye : faEyeSlash}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
              onClick={() => setPassVisible(!passVisible)}
            />
          </span>
        </div>
        
        <button type="submit" className="w-full mt-4 p-3 bg-blue-500 text-white rounded-lg">
          Sign Up
        </button>
        {passErr && <p style={{ color: 'red', marginTop: '10px' }}>{passErr}</p>}
        {validationError && <p style={{ color: 'red', marginTop: '10px' }}>{validationError}</p>}
        <p className="mt-4">If you already have an account, please <a href="/login" className="text-white">Login</a></p>
      </form>
    </div>
  );
}

export default SignUp;

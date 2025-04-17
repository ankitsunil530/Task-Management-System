import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { registerUser } from '../redux/userSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SignUp() {
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [user_id, setUser_id] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passVisible, setPassVisible] = useState(false);
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

    const validationMessage = validatePassword(password);
    if (validationMessage) {
      setValidationError(validationMessage);
      return;
    } else if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    setValidationError('');

    try {
      const resultAction = await dispatch(
        registerUser({ name, user_id, email, password })
      );

      if (registerUser.fulfilled.match(resultAction)) {
        toast.success('Registration successful! 🎉');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        throw new Error(resultAction.payload || 'Registration failed');
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center bg-gray-300 justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 p-8 rounded-lg shadow-lg w-full max-w-sm"
      >
        <h2 className="text-3xl font-bold text-center text-white mb-8">Sign Up</h2>

        {/* Full Name */}
        <label className="block mb-2 font-bold text-white">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border border-white rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-500"
          placeholder="Enter your name"
          required
        />

        {/* Username */}
        <label className="block mt-4 mb-2 font-bold text-white">
          Username <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={user_id}
          onChange={(e) => setUser_id(e.target.value)}
          className="w-full p-3 border border-white rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-500"
          placeholder="Enter your username"
          required
        />

        {/* Email */}
        <label className="block mt-4 mb-2 font-bold text-white">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-white rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-500"
          placeholder="Enter your email"
          required
        />

        {/* Password */}
        <label className="block mt-4 mb-2 font-bold text-white">
          Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={passVisible ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-white rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-500"
            placeholder="Enter your password"
            required
          />
          <FontAwesomeIcon
            icon={passVisible ? faEye : faEyeSlash}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-white"
            onClick={() => setPassVisible(!passVisible)}
          />
        </div>

        {/* Confirm Password */}
        <label className="block mt-4 mb-2 font-bold text-white">
          Confirm Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={passVisible ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border border-white rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-500"
            placeholder="Confirm your password"
            required
          />
          <FontAwesomeIcon
            icon={passVisible ? faEye : faEyeSlash}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-white"
            onClick={() => setPassVisible(!passVisible)}
          />
        </div>

        {/* Validation Error */}
        {validationError && (
          <p className="mt-2 text-red-200 text-sm text-center">{validationError}</p>
        )}

        <button
          type="submit"
          className="w-full mt-6 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Sign Up
        </button>

        <p className="mt-4 text-white text-center">
          Already have an account? <a href="/login" className="underline">Login</a>
        </p>

        <ToastContainer position="top-center" />
      </form>
    </div>
  );
}

export default SignUp;

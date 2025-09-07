import { useState } from 'react';
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

    if (!lengthRegex.test(password)) return 'Password must be at least 8 characters long';
    if (!upperCaseRegex.test(password)) return 'Password must contain at least one uppercase letter';
    if (!lowerCaseRegex.test(password)) return 'Password must contain at least one lowercase letter';
    if (!numberRegex.test(password)) return 'Password must contain at least one digit';
    if (!specialCharRegex.test(password)) return 'Password must contain at least one special character (@#$%^&*!)';

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
      const resultAction = await dispatch(registerUser({ name, user_id, email, password }));

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-3xl"
      >
        <h2 className="text-4xl font-extrabold text-center text-white mb-8 tracking-wide">
          Create Account
        </h2>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="block mb-2 text-gray-200 font-semibold">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Username */}
          <div>
            <label className="block mb-2 text-gray-200 font-semibold">
              Username <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={user_id}
              onChange={(e) => setUser_id(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your username"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 text-gray-200 font-semibold">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 text-gray-200 font-semibold">
              Password <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type={passVisible ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your password"
                required
              />
              <FontAwesomeIcon
                icon={passVisible ? faEye : faEyeSlash}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-600 hover:text-indigo-500"
                onClick={() => setPassVisible(!passVisible)}
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-2 text-gray-200 font-semibold">
              Confirm Password <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type={passVisible ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Confirm your password"
                required
              />
              <FontAwesomeIcon
                icon={passVisible ? faEye : faEyeSlash}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-600 hover:text-indigo-500"
                onClick={() => setPassVisible(!passVisible)}
              />
            </div>
          </div>
        </div>

        {/* Validation Error */}
        {validationError && (
          <p className="mt-4 text-red-400 text-sm text-center">{validationError}</p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-8 py-3 bg-indigo-600 text-white rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-all focus:outline-none focus:ring-4 focus:ring-indigo-400"
        >
          Sign Up
        </button>

        {/* Login Link */}
        <p className="mt-4 text-gray-300 text-center">
          Already have an account?{' '}
          <a href="/login" className="text-indigo-400 hover:underline">
            Login
          </a>
        </p>

        <ToastContainer position="top-center" />
      </form>
    </div>
  );
}

export default SignUp;

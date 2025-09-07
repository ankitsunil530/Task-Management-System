import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { loginUser } from '../redux/userSlice';

function Login() {
  const [inputs, setInputs] = useState({
    user_id: '',
    password: '',
  });

  const dispatch = useDispatch();
  const [passVisible, setPassVisible] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await dispatch(loginUser({ user_id: inputs.user_id, password: inputs.password }));
    localStorage.setItem('token', res.payload.data?.accesstoken);
    console.log("Login Response:", res);
    if (res.payload.success) {
      toast.success(res.payload.message);
      console.log("User role:", res.payload.data?.user?.role);
      if (res.payload.data.user.role === 'Admin') {
        navigate('/admin');
      } else if (res.payload.data.user.role === 'User') {
        navigate('/user');
      }
    } else {
      toast.error(res.payload.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      <form
        onSubmit={handleLogin}
        className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-sm"
      >
        <h2 className="text-4xl font-extrabold text-center text-white mb-8 tracking-wide">
          Welcome Back
        </h2>

        {/* Username */}
        <div className="mb-6">
          <label
            className="block text-gray-200 text-sm font-semibold mb-2"
            htmlFor="user_id"
          >
            Username <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="user_id"
            name="user_id"
            value={inputs.user_id}
            onChange={handleInputChange}
            className="w-full p-3 rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter your username"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label
            className="block text-gray-200 text-sm font-semibold mb-2"
            htmlFor="password"
          >
            Password <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <input
              type={passVisible ? 'text' : 'password'}
              id="password"
              name="password"
              value={inputs.password}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your password"
              required
            />
            <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600">
              <FontAwesomeIcon
                icon={passVisible ? faEye : faEyeSlash}
                className="cursor-pointer hover:text-indigo-500"
                onClick={() => setPassVisible(!passVisible)}
              />
            </span>
          </div>
        </div>

        {/* Login Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-all focus:outline-none focus:ring-4 focus:ring-indigo-400"
          >
            Login
          </button>
        </div>

        {/* Sign Up link */}
        <div className="mt-6 text-center">
          <p className="text-gray-300">
            Don&apos;t have an account?{' '}
            <span
              className="text-indigo-400 hover:underline cursor-pointer"
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;

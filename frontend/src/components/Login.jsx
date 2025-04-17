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
    if(res.payload.success){
      toast.success(res.payload.message);
      console.log("User role:", res.payload.data?.user?.role); // Make sure user role is correct
      if(res.payload.data.user.role==='Admin'){
        navigate('/admin');
      }
      else if(res.payload.data.user.role==='User'){
        navigate('/user');
      }
    } else {
      toast.error(res.payload.message);
    }
    
    
  };

  return (
    <div className="min-h-screen bg-gray-300 flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 p-8 rounded-lg shadow-lg w-full max-w-sm"
      >
        <h2 className="text-3xl font-bold text-center text-white mb-8">Login</h2>

        <div className="mb-6">
          <label
            className="block text-white text-sm font-semibold mb-2"
            htmlFor="user_id"
          >
            Username <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="user_id"
            name="user_id"
            value={inputs.user_id}
            onChange={handleInputChange}
            className="w-full p-3 border border-white rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-500"
            placeholder="Enter your username"
            required
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-white text-sm font-semibold mb-2"
            htmlFor="password"
          >
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={passVisible ? 'text' : 'password'}
              id="password"
              name="password"
              value={inputs.password}
              onChange={handleInputChange}
              className="w-full p-3 border border-white rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
            <span className="absolute top-1/2 right-3 -translate-y-1/2">
              <FontAwesomeIcon
                icon={passVisible ? faEye : faEyeSlash}
                className="cursor-pointer"
                onClick={() => setPassVisible(!passVisible)}
              />
            </span>
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-yellow-500 text-black py-3 rounded-lg text-lg font-semibold hover:bg-yellow-600 focus:outline-none focus:ring-4 focus:ring-yellow-400"
          >
            Login
          </button>
        </div>

        {/* 👇 Sign Up section added here */}
        <div className="mt-6 text-center">
          <p className="text-white">
            Don&apos;t have an account?{' '}
            <span
              className="text-yellow-300 hover:underline cursor-pointer"
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

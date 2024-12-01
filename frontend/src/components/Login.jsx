import { useContext, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Login() {
  const [inputs, setInputs] = useState({
    user_id: '',
    password: '',
  });
  const { user_id, password } = inputs;
  const [error, setError] = useState('');
  const [passVisible, setPassVisible] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleInputChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await login(inputs);
      if (res.status === 200) {
        const { role } = res.data;
        console.log('Role:', role);
        if (role === 'admin') {
          navigate('/admin');
        } else if (role === 'user') {
          navigate('/user');
        } else {
          setError('Unknown role, contact support.');
        }
        setInputs({ user_id: '', password: '' });
      } else {
        setError('Login failed, please check your credentials.');
      }
      console.log('Login response:', res.data);
      
      setCurrentUser(res.data);


    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-300 flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 p-8 rounded-lg shadow-lg w-full max-w-sm"
      >
        <h2 className="text-3xl font-bold text-center text-white mb-8">Login</h2>

        {error && (
          <div className="mb-4 text-red-500 text-center font-semibold">{error}</div>
        )}

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
            value={user_id}
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
              value={password}
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
      </form>
    </div>
  );
}

export default Login;

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { register, resetAuthState } from "../features/auth/authSlice";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isSuccess, isError, message } = useSelector((s) => s.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (isSuccess) {
      navigate("/dashboard");
      dispatch(resetAuthState());
    }
  }, [isSuccess, navigate, dispatch]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return;
    dispatch(
      register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl p-8">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Create Account 🚀
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            Register to manage your tasks efficiently
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <input
            name="name"
            placeholder="Full Name"
            className="w-full px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-700 text-white"
            onChange={onChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="w-full px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-700 text-white"
            onChange={onChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-700 text-white"
            onChange={onChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="w-full px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-700 text-white"
            onChange={onChange}
            required
          />

          {/* Error Message */}
          {isError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-2 rounded-lg">
              {message || "Registration failed"}
            </div>
          )}

          <button
  disabled={isLoading}
  className={`w-full py-2.5 rounded-lg font-medium transition-all duration-300
    ${
      isLoading
        ? "bg-gray-700 text-gray-300 cursor-not-allowed"
        : "bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:bg-indigo-700 hover:scale-105 hover:shadow-[0_0_35px_rgba(99,102,241,0.7)] active:scale-95"
    }`}
>
  {isLoading ? "Creating..." : "Sign Up"}
</button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaSun, FaMoon } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../features/theme/themeSlice";

function Header() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.theme);

  const links = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-slate-900/80 dark:bg-[#0B1120]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="https://preview.redd.it/hi-this-is-a-logo-for-the-task-manager-application-called-v0-si3hzlaglc7b1.png?width=640&crop=smart&auto=webp&s=04d231d246026a59f988ac183a82e0ea2ca8ef4e"
            alt="logo"
            className="h-9 w-9 rounded-full"
          />
          <span className="text-slate-900 dark:text-white text-xl font-bold tracking-wide">
            TaskPhiles
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `relative text-sm font-medium transition ${
                  isActive ? "text-blue-400" : "text-slate-300"
                } hover:text-blue-400`
              }
            >
              {link.name}
              <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={() => dispatch(toggleTheme())}
            className="p-2 rounded-lg border border-slate-700 text-slate-300 hover:text-blue-400 hover:bg-slate-800 transition-all duration-300"
            title="Toggle theme"
          >
            {mode === "dark" ? <FaSun /> : <FaMoon />}
          </button>
  <button
    onClick={() => navigate("/login")}
    className="
      px-5 py-2
      rounded-lg
      text-sm font-semibold
      border border-blue-500/30
      text-slate-200
      shadow-lg shadow-blue-500/10
      transition-all duration-300
      hover:bg-slate-800
      hover:scale-105
      hover:border-blue-500
      hover:text-blue-400
      hover:shadow-xl hover:shadow-blue-500/30
      active:scale-95
    "
  >
    Login
  </button>

  <button
    onClick={() => navigate("/register")}
    className="
      px-5 py-2
      rounded-lg
      text-sm font-semibold
      bg-blue-600
      text-white
      shadow-[0_0_20px_rgba(59,130,246,0.4)]
      transition-all duration-300
      hover:bg-blue-700
      hover:scale-105
      hover:shadow-[0_0_35px_rgba(59,130,246,0.6)]
      active:scale-95
    "
  >
    Sign up
  </button>
</div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-slate-200 text-xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#0B1120] border-t border-slate-800 px-6 py-6 space-y-5">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block text-sm font-medium ${
                  isActive ? "text-blue-400" : "text-slate-300"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          <div className="pt-4 flex flex-col gap-3">
            {/* Mobile Theme Toggle */}
            <button
              onClick={() => {
                setIsOpen(false);
                dispatch(toggleTheme());
              }}
              className="w-full py-2 rounded-lg border border-slate-700 text-slate-200 transition-all duration-300 flex items-center justify-center gap-2"
            >
              {mode === "dark" ? <FaSun /> : <FaMoon />}
              Toggle Theme
            </button>
            <button
  onClick={() => {
    setIsOpen(false);
    navigate("/login");
  }}
  className="
    w-full py-2 rounded-lg
    border border-slate-700
    text-slate-200
    transition-all duration-300
    hover:bg-slate-800
    hover:scale-105
    hover:border-blue-500/50
    hover:shadow-lg hover:shadow-blue-500/20
    active:scale-95
  "
>
  Login
</button>

<button
  onClick={() => {
    setIsOpen(false);
    navigate("/register");
  }}
  className="
    w-full py-2 rounded-lg
    bg-blue-600 text-white
    font-medium
    transition-all duration-300
    hover:bg-blue-700
    hover:scale-105
    hover:-translate-y-0.5
    hover:shadow-lg hover:shadow-blue-500/30
    active:scale-95
  "
>
  Sign up
</button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;

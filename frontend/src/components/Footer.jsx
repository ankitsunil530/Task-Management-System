import { NavLink } from "react-router-dom";

function Footer() {
  const handleSubscribe = (e) => {
    e.preventDefault();
    alert("Subscribed!");
  };

  return (
    <footer className="bg-[#0B1120] text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* Brand */}
        <div>
  <div className="flex items-center gap-3 mb-4">
    <img
      src="https://preview.redd.it/hi-this-is-a-logo-for-the-task-manager-application-called-v0-si3hzlaglc7b1.png?width=640&crop=smart&auto=webp&s=04d231d246026a59f988ac183a82e0ea2ca8ef4e" // replace with your logo path
      alt="TaskPhiles Logo"
      className="w-10 h-10 object-contain"
    />
    <h2 className="text-2xl font-bold text-white">
      TaskPhiles
    </h2>
  </div>

  <p className="text-slate-400 leading-relaxed">
    Simplify your task management with{" "}
    <span className="text-white font-semibold">TaskPhiles</span>.
    Organize, prioritize, and stay productive effortlessly.
  </p>
</div>

        {/* Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Product</h3>
          <ul className="space-y-3">
            <li>
              <NavLink to="/about" className="hover:text-blue-400 transition">
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/services" className="hover:text-blue-400 transition">
                Features
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard" className="hover:text-blue-400 transition">
                Pricing
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className="hover:text-blue-400 transition">
                Contact
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Stay Updated</h3>
          <p className="text-slate-400 mb-4">
            Subscribe to our newsletter for product updates.
          </p>

          <form onSubmit={handleSubscribe} className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="flex-1 bg-[#111827] text-slate-200 px-4 py-2 rounded-l-lg outline-none border border-slate-700 focus:border-blue-500"
            />
            <button
  type="submit"
  className="
    bg-blue-600
    px-4 py-2
    rounded-r-lg
    text-white
    font-semibold
    shadow-[0_0_20px_rgba(59,130,246,0.4)]
    transition-all duration-300
    hover:bg-blue-700
    hover:scale-105
    hover:shadow-[0_0_35px_rgba(59,130,246,0.7)]
    active:scale-95
  "
>
  Subscribe
</button>
          </form>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-slate-800 py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} taskphiles. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;

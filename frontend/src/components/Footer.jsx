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
          <h2 className="text-2xl font-bold text-white mb-4">taskphiles</h2>
          <p className="text-slate-400 leading-relaxed">
            Simplify your task management with{" "}
            <span className="text-white font-semibold">taskphiles</span>.
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
              className="bg-blue-600 px-4 py-2 rounded-r-lg text-white font-semibold hover:bg-blue-700 transition"
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

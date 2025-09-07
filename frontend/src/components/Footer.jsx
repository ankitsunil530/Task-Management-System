import { NavLink } from "react-router-dom";

function Footer() {
  const handleSubscribe = (e) => {
    e.preventDefault(); // Prevent page refresh
    alert("Subscribed!");
  };

  return (
    <footer className="bg-gray-900 text-white py-10 px-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
        
        {/* Company Info */}
        <div>
          <h2 className="text-2xl font-bold mb-4">taskphiles</h2>
          <p className="text-gray-400">
            Simplify your task management with <span className="font-semibold">taskphiles</span>. 
            Organize, prioritize, and stay productive effortlessly.
          </p>
        </div>

        {/* Useful Links */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Useful Links</h2>
          <div className="flex flex-col space-y-2">
            <NavLink to={"/about"} className="hover:text-gray-300 transition-colors">About Us</NavLink>
            <NavLink to={"/services"} className="hover:text-gray-300 transition-colors">Features</NavLink>
            <NavLink to={"/dashboard"} className="hover:text-gray-300 transition-colors">Pricing</NavLink>
            <NavLink to={"/contact"} className="hover:text-gray-300 transition-colors">Contact</NavLink>
          </div>
        </div>

        {/* Subscribe */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Stay Updated</h2>
          <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest updates.</p>
          <form className="flex justify-center md:justify-start" onSubmit={handleSubscribe}>
            <input 
              type="email" 
              placeholder="Your email" 
              className="bg-gray-800 text-white p-2 rounded-l outline-none focus:ring focus:ring-blue-500 w-2/3"
              required
            />
            <button 
              type="submit" 
              className="bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600 transition-colors focus:outline-none"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-10 border-t border-gray-700 pt-4 text-center text-gray-500">
        &copy; {new Date().getFullYear()} taskphiles. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;

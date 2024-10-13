

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 px-6 ">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Company Info */}
        <div>
          <h2 className="text-2xl font-bold mb-4">taskphiles</h2>
          <p className="text-gray-400">
            Simplify your task management with TaskMaster. Organize, prioritize, and stay productive.
          </p>
        </div>

        {/* Useful Links */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Useful Links</h2>
          <ul>
            <li className="mb-2 hover:text-gray-300 cursor-pointer">About Us</li>
            <li className="mb-2 hover:text-gray-300 cursor-pointer">Features</li>
            <li className="mb-2 hover:text-gray-300 cursor-pointer">Pricing</li>
            <li className="mb-2 hover:text-gray-300 cursor-pointer">Contact</li>
          </ul>
        </div>

        {/* Subscribe */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Stay Updated</h2>
          <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest updates.</p>
          <form className="flex">
            <input 
              type="email" 
              placeholder="Your email" 
              className="bg-gray-800 text-white p-2 rounded-l outline-none focus:ring focus:ring-blue-500"
            />
            <button 
              type="submit" 
              className="bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600 focus:outline-none"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-500">
        &copy; 2024 taskphiles. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;

import Footer from "./Footer";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  function handleSign() {
    navigate("/signup");
  }

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center justify-between px-10 py-20 max-w-7xl mx-auto">
          {/* Left Side - Text */}
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 leading-tight">
              Stay Organized, <br />
              <span className="text-blue-600">Stay Productive</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mt-6 mb-8 max-w-lg">
              Manage your tasks effortlessly with <span className="font-semibold">TaskMaster</span>. Plan, track, and collaborate efficiently to get things done faster.
            </p>
            <button
              className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-blue-700 transition focus:outline-none"
              onClick={handleSign}
            >
              Get Started
            </button>
          </div>

          {/* Right Side - Illustration / Image */}
          <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2921/2921222.png"
              alt="Task Management Illustration"
              className="w-80 md:w-96 drop-shadow-lg"
            />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 bg-white shadow-inner">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            Why Choose <span className="text-blue-600">TaskMaster?</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-gradient-to-tr from-blue-50 to-white p-8 rounded-2xl shadow hover:shadow-lg transition">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                📌 Task Management
              </h3>
              <p className="text-gray-600">
                Organize your tasks efficiently with an intuitive interface. Add, edit, and prioritize tasks seamlessly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-tr from-green-50 to-white p-8 rounded-2xl shadow hover:shadow-lg transition">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                🤝 Collaboration
              </h3>
              <p className="text-gray-600">
                Work with your team in real-time. Assign tasks, set deadlines, and keep everyone aligned.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-tr from-purple-50 to-white p-8 rounded-2xl shadow hover:shadow-lg transition">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                📊 Progress Tracking
              </h3>
              <p className="text-gray-600">
                Stay informed with progress updates and visual reports to track tasks and projects effectively.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <h2 className="text-4xl font-bold mb-4">
            Boost Your Productivity Now 🚀
          </h2>
          <p className="text-lg mb-8">
            Join TaskMaster today and start managing your tasks better, faster, and smarter.
          </p>
          <button
            className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-100 transition"
            onClick={handleSign}
          >
            Sign Up Free
          </button>
        </section>
      </main>
    </>
  );
}

export default Home;

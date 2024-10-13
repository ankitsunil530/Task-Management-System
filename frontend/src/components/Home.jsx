import Footer from "./Footer";
import Header from "./Header";
import { useNavigate } from "react-router-dom";


function Home() {
  const navigate=useNavigate();
  function handleSign(){
    navigate('/signup');
  }
  return (
    <>
     
     
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-400">
      {/* Hero Section */}
      <section className="text-center py-16 px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 mb-6">
          Stay Organized, Stay Productive
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Manage your tasks effortlessly with TaskMaster. Plan, track, and collaborate efficiently to get things done.
        </p>
        <button className="bg-blue-500 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-blue-600 focus:outline-none"
        onClick={handleSign}
        >
          Get Started
        </button>
      </section>

      {/* Features Section */}
      <section className="py-12 px-6 bg-gray-400 w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-gray-100 p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Task Management</h3>
            <p className="text-gray-600">
              Organize your tasks efficiently with an easy-to-use interface. Add, edit, and prioritize tasks seamlessly.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-gray-100 p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Collaboration</h3>
            <p className="text-gray-600">
              Work with your team in real-time. Assign tasks, set deadlines, and keep everyone on the same page.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-gray-100 p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Progress Tracking</h3>
            <p className="text-gray-600">
              Track the progress of tasks and projects. Stay informed with visual progress updates and reports.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6 text-center bg-blue-500 text-white w-full">
        <h2 className="text-4xl font-bold mb-4">Boost Your Productivity Now</h2>
        <p className="text-lg mb-8">
          Join TaskMaster today and start managing your tasks better, faster, and smarter.
        </p>
        <button className="bg-white text-blue-500 px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-100 focus:outline-none"
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

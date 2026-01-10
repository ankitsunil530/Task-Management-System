import { FaTasks, FaUsers, FaBell, FaChartLine } from "react-icons/fa";

function Services() {
  const services = [
    {
      icon: <FaTasks />,
      title: "Task Management",
      desc: "Create, assign, prioritize and organize tasks easily. Stay in control of every project.",
    },
    {
      icon: <FaUsers />,
      title: "Team Collaboration",
      desc: "Collaborate in real-time with your team. Share updates and manage workflows seamlessly.",
    },
    {
      icon: <FaBell />,
      title: "Real-time Notifications",
      desc: "Receive instant alerts for deadlines, updates, and important changes.",
    },
    {
      icon: <FaChartLine />,
      title: "Analytics & Reports",
      desc: "Visualize productivity and performance with detailed analytics and reports.",
    },
  ];

  return (
    <main className="bg-[#0B1120] text-slate-300 min-h-screen pt-24">
      <div className="max-w-7xl mx-auto px-6 py-16 text-center">

        {/* Heading */}
        <span className="inline-block mb-4 px-4 py-1 text-sm rounded-full bg-blue-900/40 text-blue-400">
          Our Services
        </span>

        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
          Everything you need to manage work smarter
        </h1>

        <p className="max-w-3xl mx-auto text-slate-400 mb-16">
          taskphiles provides powerful tools to organize tasks, improve team
          collaboration, and track productivity — all in one modern platform.
        </p>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, i) => (
            <div
              key={i}
              className="bg-[#111827] border border-slate-800 rounded-2xl p-8 hover:border-blue-500/40 hover:shadow-xl transition"
            >
              <div className="text-4xl text-blue-400 mb-5 flex justify-center">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {service.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {service.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default Services;

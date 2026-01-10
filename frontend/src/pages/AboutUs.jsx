import aboutImage from "../images/aboutImage.jpg";

function AboutUs() {
  return (
    <main className="bg-[#0B1120] text-slate-300 min-h-screen pt-24">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">

        {/* Left Content */}
        <div>
          <span className="inline-block mb-3 px-4 py-1 text-sm rounded-full bg-blue-900/40 text-blue-400">
            About taskphiles
          </span>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Built to simplify task management
          </h1>

          <p className="mb-4 text-slate-400 leading-relaxed">
            taskphiles is a modern task management platform designed to help
            individuals and teams stay organized, focused, and productive.
            From simple to-do lists to complex project workflows, our system
            adapts to your needs.
          </p>

          <p className="mb-4 text-slate-400 leading-relaxed">
            We provide features such as task creation, assignments, deadlines,
            real-time updates, and progress tracking — all in a clean and
            intuitive interface.
          </p>

          <p className="text-slate-400 leading-relaxed">
            Our mission is to remove complexity from daily planning and empower
            users with tools that grow alongside their goals.
          </p>
        </div>

        {/* Right Image */}
        <div className="flex justify-center">
          <img
            src={aboutImage}
            alt="About taskphiles"
            className="rounded-2xl shadow-2xl w-full max-w-md border border-slate-800"
          />
        </div>
      </div>

      {/* Stats Section */}
      <section className="border-t border-slate-800 py-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">

          {[
            { value: "10K+", label: "Tasks Managed" },
            { value: "1K+", label: "Users" },
            { value: "99.9%", label: "Uptime" },
            { value: "24/7", label: "Support" },
          ].map((stat, i) => (
            <div key={i}>
              <h3 className="text-3xl font-bold text-white mb-2">
                {stat.value}
              </h3>
              <p className="text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default AboutUs;

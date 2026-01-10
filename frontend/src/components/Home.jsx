import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <main className="bg-[#0B1120] text-slate-200">
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block mb-4 px-4 py-1 text-sm font-semibold rounded-full bg-blue-900/40 text-blue-400">
            🚀 Task Management Simplified
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-white">
            Manage work. <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Ship faster.
            </span>
          </h1>

          <p className="mt-6 text-lg text-slate-400 max-w-xl">
            TaskMaster helps teams organize tasks, collaborate efficiently, and
            track progress — all in one powerful platform.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/register")}
              className="px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              Get Started Free
            </button>

            <button
              onClick={() => navigate("/login")}
              className="px-8 py-3 rounded-lg border border-slate-600 hover:bg-slate-800 transition"
            >
              Login
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2921/2921222.png"
            alt="dashboard"
            className="w-[320px] md:w-[420px] drop-shadow-2xl"
          />
        </div>
      </section>

      {/* TRUST */}
      <section className="py-12 bg-[#0F172A] border-y border-slate-800">
        <p className="text-center text-slate-500 mb-6">
          Trusted by students & developers building modern projects
        </p>
        <div className="flex justify-center gap-10 text-slate-500 text-sm font-semibold">
          <span>IIITDM</span>
          <span>Open Source</span>
          <span>Developers</span>
          <span>Startups</span>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-14 text-white">
          Everything you need to stay productive
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Smart Task Management",
              desc: "Create, update, prioritize and manage tasks with a clean interface.",
              icon: "📌",
            },
            {
              title: "Team Collaboration",
              desc: "Assign tasks, set deadlines and work together in real time.",
              icon: "🤝",
            },
            {
              title: "Progress Analytics",
              desc: "Track task status and visualize productivity trends easily.",
              icon: "📊",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-[#111827] p-8 rounded-2xl border border-slate-800 hover:border-blue-500/50 hover:shadow-xl transition"
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-white">
                {f.title}
              </h3>
              <p className="text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-700 to-purple-700 text-white py-20 text-center px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Start organizing your work today
        </h2>
        <p className="text-lg mb-8 text-blue-200">
          Free to use. No credit card required.
        </p>
        <button
          onClick={() => navigate("/register")}
          className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-slate-100 transition"
        >
          Create Free Account
        </button>
      </section>
    </main>
  );
}

export default Home;

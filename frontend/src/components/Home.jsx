import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <main className="bg-slate-50 dark:bg-[#0B1120]">
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block mb-4 px-4 py-1 text-sm font-semibold rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
            🚀 Task Management Simplified
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-slate-900 dark:text-white">
            Manage work. <br />
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 bg-clip-text text-transparent">
              Ship faster.
            </span>
          </h1>

          <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 max-w-xl">
            TaskPhiles helps teams organize tasks, collaborate efficiently, and
            track progress — all in one powerful platform.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
  onClick={() => navigate("/register")}
  className="px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold
             shadow-lg shadow-blue-500/30
             transition-all duration-300
             hover:bg-blue-700 hover:scale-105
             active:scale-95"
>
  Get Started Free
</button>

<button
  onClick={() => navigate("/login")}
  className="px-8 py-3 rounded-lg border border-blue-500
             text-blue-400
             shadow-lg shadow-blue-500/20
             transition-all duration-300
             hover:bg-slate-800 hover:scale-105
             hover:shadow-xl hover:shadow-blue-500/30
             active:scale-95"
>
  Login
</button>
          </div>
        </div>

        <div className="flex justify-center">
  <img
    src="/WhatsApp Image 2026-06-17 at 07.40.42.jpeg"
    alt="dashboard"
    className="w-[320px] md:w-[420px]
               drop-shadow-[0_0_25px_rgba(59,130,246,0.4)]
               transition-all duration-500
               hover:scale-105 hover:-translate-y-3
               hover:drop-shadow-[0_0_40px_rgba(59,130,246,0.7)]"
  />
</div>
      </section>

      {/* TRUST */}
      <section className="py-14 bg-slate-100 dark:bg-[#0F172A] border-y border-slate-200 dark:border-slate-800">
  <p className="text-center text-slate-600 dark:text-slate-400 mb-8 text-lg">
    Trusted by students & developers building modern projects
  </p>

  <div className="flex flex-wrap justify-center gap-6">
  {["IIITDM", "Open Source", "Developers", "Startups"].map((item) => (
    <div
      key={item}
      className="
        px-6 py-4
        rounded-xl
        border border-blue-500/30
        bg-slate-50 dark:bg-slate-900/50
        text-slate-800 dark:text-slate-300
        font-semibold
        cursor-pointer
        shadow-lg shadow-blue-500/10
        transition-all duration-300
        hover:scale-105
        hover:-translate-y-1
        hover:border-blue-500
        hover:text-blue-600 dark:hover:text-blue-400
        hover:shadow-xl hover:shadow-blue-500/30
      "
    >
      {item}
    </div>
  ))}
</div>
</section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-14 text-slate-900 dark:text-white">
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
      className="
        bg-white dark:bg-[#111827]
        p-8
        rounded-2xl
        border border-slate-200 dark:border-blue-500/20
        shadow-[0_0_20px_rgba(59,130,246,0.1)]
        transition-all duration-300
        hover:-translate-y-2
        hover:scale-105
        hover:border-blue-500/50
        hover:shadow-[0_15px_40px_rgba(59,130,246,0.3)]
      "
    >
      <div className="text-3xl mb-4">
        {f.icon}
      </div>

      <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">
        {f.title}
      </h3>

      <p className="text-slate-600 dark:text-slate-400">
        {f.desc}
      </p>
    </div>
  ))}
</div>
      </section>

      {/* CTA */}
      <section className="bg-slate-100 dark:bg-[#111827] border-t border-slate-200 dark:border-slate-800 py-20 text-center px-6">
  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
    Start organizing your work today
  </h2>

  <p className="text-lg mb-8 text-slate-600 dark:text-slate-400">
    Free to use. No credit card required.
  </p>

  <button
  onClick={() => navigate("/register")}
  className="
    bg-blue-600
    text-white
    px-8 py-3
    rounded-lg
    font-semibold
    shadow-lg shadow-blue-500/30
    transition-all duration-300
    hover:bg-blue-700
    hover:scale-105
    hover:shadow-xl hover:shadow-blue-500/50
    active:scale-95
  "
>
  Create Free Account
</button>
</section>
    </main>
  );
}

export default Home;

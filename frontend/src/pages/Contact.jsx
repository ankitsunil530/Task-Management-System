import { useState } from "react";

function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !email || !message) {
      alert("Please fill out all fields.");
      return;
    }
    alert("✅ Message sent successfully!");
    setName("");
    setEmail("");
    setMessage("");
  }

  return (
    <main className="bg-[#0B1120] text-slate-300 min-h-screen pt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Heading */}
        <div className="text-center mb-14">
          <span className="inline-block mb-3 px-4 py-1 text-sm rounded-full bg-blue-900/40 text-blue-400">
            Contact
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Get in touch with us
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Have questions, feedback, or partnership ideas? We'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">

          {/* Form */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-semibold text-white mb-6">Send a message</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block mb-1 text-sm">Full Name</label>
                <input
                  className="w-full bg-[#0B1120] border border-slate-700 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-sm">Email address</label>
                <input
                  type="email"
                  className="w-full bg-[#0B1120] border border-slate-700 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-sm">Message</label>
                <textarea
                  rows="4"
                  className="w-full bg-[#0B1120] border border-slate-700 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
              >
                Send message
              </button>
            </form>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">Contact information</h2>

            <p className="text-slate-400">
              Reach out to us anytime. Our support team is available to help you with any questions.
            </p>

            <div className="space-y-3 text-slate-300">
              <p>📍 Lucknow, Uttar Pradesh, India</p>
              <p>📧 support@taskphiles.com</p>
              <p>📞 +91 98765 43210</p>
              <p>🕘 Mon – Fri, 9 AM – 6 PM</p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

export default ContactUs;

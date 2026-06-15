import { useState } from "react";
import {
  FaEnvelope,
  FaLocationDot,
  FaPhone,
  FaRegClock,
} from "react-icons/fa6";

const contactDetails = [
  {
    icon: FaLocationDot,
    label: "Office location",
    value: "Lucknow, Uttar Pradesh, India",
  },
  {
    icon: FaEnvelope,
    label: "Email support",
    value: "support@taskphiles.com",
    href: "mailto:support@taskphiles.com",
  },
  {
    icon: FaPhone,
    label: "Phone number",
    value: "+91 98765 43210",
    href: "tel:+919876543210",
  },
  {
    icon: FaRegClock,
    label: "Working hours",
    value: "Mon - Fri, 9 AM - 6 PM",
  },
];

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
    alert("Message sent successfully!");
    setName("");
    setEmail("");
    setMessage("");
  }

  return (
    <main className="min-h-screen bg-[#0B1120] pt-24 text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Heading */}
        <div className="mb-14 text-center">
          <span className="mb-3 inline-block rounded-full bg-blue-900/40 px-4 py-1 text-sm text-blue-400">
            Contact
          </span>
          <h1 className="mb-4 text-4xl font-extrabold text-white md:text-5xl">
            Get in touch with us
          </h1>
          <p className="mx-auto max-w-2xl text-slate-400">
            Have questions, feedback, or partnership ideas? We'd love to hear from you.
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-2">
          {/* Form */}
          <div className="rounded-2xl border border-slate-800 bg-[#111827] p-8 shadow-xl">
            <h2 className="mb-6 text-2xl font-semibold text-white">Send a message</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-1 block text-sm">Full Name</label>
                <input
                  className="w-full rounded-lg border border-slate-700 bg-[#0B1120] px-4 py-2 outline-none focus:border-blue-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm">Email address</label>
                <input
                  type="email"
                  className="w-full rounded-lg border border-slate-700 bg-[#0B1120] px-4 py-2 outline-none focus:border-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm">Message</label>
                <textarea
                  rows="4"
                  className="w-full rounded-lg border border-slate-700 bg-[#0B1120] px-4 py-2 outline-none focus:border-blue-500"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Send message
              </button>
            </form>
          </div>

          {/* Info */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#111827] p-5 shadow-xl">
            <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-blue-600/20 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-20 w-20 rounded-full bg-cyan-500/10 blur-3xl" />

            <div className="relative">
              <span className="mb-2 inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-blue-300">
                Contact information
              </span>
              <h2 className="text-xl font-semibold text-white">We're here to help</h2>
              <p className="mt-1.5 max-w-xl text-xs leading-5 text-slate-400">
                Reach out for product help, account questions, or collaboration requests.
              </p>

              <div className="mt-4 grid gap-2.5">
                {contactDetails.map(({ icon: Icon, label, value, href }) => {
                  const content = (
                    <>
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-blue-400/20 bg-blue-500/10 text-blue-300">
                        <Icon className="text-sm" />
                      </span>
                      <span>
                        <span className="block text-[11px] font-medium text-slate-400">
                          {label}
                        </span>
                        <span className="block text-sm font-semibold text-white">
                          {value}
                        </span>
                      </span>
                    </>
                  );

                  return href ? (
                    <a
                      key={label}
                      href={href}
                      className="flex items-center gap-3 rounded-lg border border-slate-700/70 bg-slate-900/60 px-3 py-2.5 transition hover:border-blue-500/60 hover:bg-slate-900"
                    >
                      {content}
                    </a>
                  ) : (
                    <div
                      key={label}
                      className="flex items-center gap-3 rounded-lg border border-slate-700/70 bg-slate-900/60 px-3 py-2.5"
                    >
                      {content}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-300">
                  Average response time
                </p>
                <p className="mt-0.5 text-lg font-bold text-white">Within 24 hours</p>
                <p className="mt-0.5 text-xs leading-5 text-slate-400">
                  For urgent task or workspace issues, call us during working hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ContactUs;

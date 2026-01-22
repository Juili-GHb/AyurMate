import { Link as ScrollLink } from "react-scroll"; // for scrolling
import { Link } from "react-router-dom"; // for navigation
import { motion } from "framer-motion"; // ✅ for animations

export default function Home() {
  return (
    <section className="relative pt-24">
      {/* Hero */}
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid items-center gap-10 md:grid-cols-2">
          
          {/* Left Text Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200">
              Holistic Wellness • Ayurveda
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-gray-900 md:text-5xl">
              Welcome to <span className="text-emerald-700">AyurMate</span>
            </h1>
            <p className="mt-4 text-lg text-gray-700">
              Discover personalized Ayurvedic wellness with AyurMate – your guide to remedies, lifestyle tips, and holistic health. Embrace balance, boost vitality, and live naturally every day.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/login"
                className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                Signup / Login
              </Link>
              <ScrollLink
                to="about"
                smooth={true}
                duration={500}
                className="cursor-pointer rounded-xl px-5 py-3 font-semibold text-emerald-700 ring-1 ring-emerald-300 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                Learn More
              </ScrollLink>
            </div>
          </motion.div>

          {/* Hero Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm"
          >
            <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 p-6">
              <h3 className="text-xl font-semibold text-emerald-800">Daily Balance</h3>
              <p className="mt-2 text-gray-700">
                Track habits, get gentle reminders, and explore Ayurvedic tips tailored to your routine.
              </p>
              <ul className="mt-4 space-y-2 text-gray-700">
                <li>• Mindful morning rituals</li>
                <li>• Seasonal diet suggestions</li>
                <li>• Simple, natural remedies</li>
              </ul>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
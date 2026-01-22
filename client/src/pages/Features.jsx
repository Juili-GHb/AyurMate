import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaLeaf,
  FaSeedling,
  FaHeartbeat,
  FaBell,
  FaPenFancy,
  FaStethoscope,
} from "react-icons/fa";

export default function Features() {
  const [selectedFeature, setSelectedFeature] = useState(null);

  const features = [
    { title: "Remedies", desc: "Explore natural Ayurvedic solutions.", icon: <FaLeaf className="text-emerald-600 text-3xl" /> },
    { title: "Herbs", desc: "Learn about healing herbs and uses.", icon: <FaSeedling className="text-emerald-600 text-3xl" /> },
    { title: "Lifestyle Tips", desc: "Balance your day with Ayurvedic wisdom.", icon: <FaHeartbeat className="text-emerald-600 text-3xl" /> },
    { title: "Reminders", desc: "Set wellness reminders to stay on track.", icon: <FaBell className="text-emerald-600 text-3xl" /> },
    { title: "Posts", desc: "Read and share Ayurvedic insights.", icon: <FaPenFancy className="text-emerald-600 text-3xl" /> },
    { title: "Symptom Tracker", desc: "Log and track symptoms for guidance.", icon: <FaStethoscope className="text-emerald-600 text-3xl" /> },
  ];

  return (
    <section className="relative pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Title */}
        <motion.h1
          className="text-3xl font-extrabold text-gray-900 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: false, amount: 0.3 }}
        >
          Features
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="mt-3 text-lg text-gray-700 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          viewport={{ once: false, amount: 0.3 }}
        >
          Explore the AyurMate features designed to support your holistic wellness journey.
          <br />
          <span className="text-emerald-700 font-medium">
            Sign up or log in to unlock full access.
          </span>
        </motion.p>

        {/* Cards */}
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="rounded-2xl border border-emerald-100 bg-white p-8 shadow-sm hover:shadow-lg hover:scale-[1.03] transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.8, ease: 'easeOut' }}
              viewport={{ once: false, amount: 0.2 }}
              onClick={() => setSelectedFeature(feature)}
            >
              <div className="flex items-center space-x-3">
                {feature.icon}
                <h3 className="text-xl font-semibold text-emerald-800">{feature.title}</h3>
              </div>
              <p className="mt-3 text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedFeature && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFeature(null)}
            />

            {/* Modal Box */}
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-6"
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="bg-white rounded-2xl shadow-2xl border border-emerald-100 max-w-md w-full p-8 text-center">
                <h2 className="text-2xl font-bold text-emerald-800">
                  {selectedFeature.title}
                </h2>
                <p className="mt-3 text-gray-700">
                  Please login or signup to explore <b>{selectedFeature.title}</b> in detail.
                </p>

                <div className="mt-6 flex justify-center">
                  <Link
                    to="/login"
                    className="px-6 py-2.5 rounded-lg bg-emerald-600 text-white font-semibold shadow-md hover:bg-emerald-700 hover:shadow-lg transition"
                  >
                    Login / Signup
                  </Link>

                </div>

                <button
                  className="mt-6 text-sm text-gray-600 hover:text-gray-800"
                  onClick={() => setSelectedFeature(null)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
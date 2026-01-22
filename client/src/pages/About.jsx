import { Leaf, HeartPulse, Sparkles } from "lucide-react";
import { motion } from "framer-motion"; // ✅ for animations

export default function About() {
  return (
    <section
      id="about"
      className="mx-auto max-w-5xl px-6 py-20 min-h-screen flex flex-col justify-center"
    >
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-4xl font-extrabold text-gray-900 text-center"
      >
        About <span className="text-emerald-700">AyurMate</span>
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="mt-4 text-lg text-gray-600 text-center max-w-2xl mx-auto"
      >
        Your digital Ayurvedic wellness companion 🌿  
        Making Ayurveda simple, practical, and part of your daily life.
      </motion.p>

      {/* Features with Icons */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {/* Card 1 */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="flex flex-col items-center p-6 bg-white shadow-lg rounded-2xl"
        >
          <Leaf className="w-10 h-10 text-emerald-700 mb-3" />
          <h3 className="text-xl font-semibold text-gray-900">Natural Remedies</h3>
          <p className="mt-2 text-gray-600 text-sm">
            Discover herbal solutions for balance and wellness.
          </p>
        </motion.div>

        {/* Card 2 */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          className="flex flex-col items-center p-6 bg-white shadow-lg rounded-2xl"
        >
          <HeartPulse className="w-10 h-10 text-emerald-700 mb-3" />
          <h3 className="text-xl font-semibold text-gray-900">Lifestyle Tips</h3>
          <p className="mt-2 text-gray-600 text-sm">
            Simple routines to keep your mind and body aligned.
          </p>
        </motion.div>

        {/* Card 3 */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
          className="flex flex-col items-center p-6 bg-white shadow-lg rounded-2xl"
        >
          <Sparkles className="w-10 h-10 text-emerald-700 mb-3" />
          <h3 className="text-xl font-semibold text-gray-900">Daily Balance</h3>
          <p className="mt-2 text-gray-600 text-sm">
            Stay connected with nature’s wisdom every day.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
import { Link } from "react-scroll";
import { User, Leaf, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [showAlert, setShowAlert] = useState(false);

  return (
    <nav className="bg-green-700 text-white px-6 py-4 flex justify-between items-center fixed top-0 left-0 w-full z-50 shadow-md">
      
      {/* 🌿 Logo + Name */}
      <div className="flex items-center gap-2">
        <Leaf className="w-6 h-6 text-white" />
        <h1 className="text-xl font-bold">AyurMate</h1>
      </div>

      {/* 🔗 Nav Links + Profile */}
      <div className="flex items-center gap-6">
        <Link to="home" smooth duration={500} className="cursor-pointer hover:text-green-200">
          Home
        </Link>
        <Link to="about" smooth duration={500} className="cursor-pointer hover:text-green-200">
          About
        </Link>
        <Link to="features" smooth duration={500} className="cursor-pointer hover:text-green-200">
          Features
        </Link>

        {/* 👤 User Icon with Click Modal */}
        <div className="relative">
          <User
            className="w-6 h-6 cursor-pointer hover:text-green-300 transition-transform duration-300 hover:scale-110"
            onClick={() => setShowAlert(true)}
          />

          {/* 🌿 Beautiful Alert Modal */}
          {showAlert && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[100] transition-opacity duration-300">
              <div className="bg-white text-green-800 p-6 rounded-2xl shadow-xl w-80 relative text-center border border-green-200">
                
                {/* ❌ Close Button */}
                <button
                  className="absolute top-3 right-3 text-green-700 hover:text-green-900"
                  onClick={() => setShowAlert(false)}
                >
                  <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-semibold flex items-center justify-center gap-2 text-green-800 mb-2">
                  🌿 Unlock Your AyurMate Dashboard
                </h2>

                <p className="text-sm text-green-700 mb-5">
                  Sign up or log in to access personalized Ayurvedic insights, dosha analysis,
                  symptom tracking, lifestyle tips, and wellness reminders.
                </p>
                
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
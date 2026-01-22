import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import LoginSignup from "./pages/LoginSignup.jsx";
import DoshaQuiz from "./pages/DoshaQuiz.jsx"; // ✅ import the quiz

import Features from "./pages/Features.jsx";
import Remedies from "./pages/Remedies.jsx";
import Herbs from "./pages/Herbs.jsx";
import LifestyleTips from "./pages/LifestyleTips.jsx";

function LandingPage() {
  return (
    <main className="flex-1">
      <section id="home">
        <Home />
      </section>
      <section id="about">
        <About />
      </section>
      <section id="features">
        <Features />
      </section>
    </main>
  );
}

function AppContent() {
  const location = useLocation();

  // Hide navbar & footer on login, dashboard, or quiz pages
  const hideLayout = ["/login", "/dashboard", "/quiz", "/remedies","/herbs","/lifestyletips"].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {!hideLayout && <Navbar />}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/quiz" element={<DoshaQuiz />} /> {/* ✅ new quiz route */}
        <Route path="/remedies" element={<Remedies />} /> {/* ✅ new remedies route */}
        <Route path="/herbs" element={<Herbs />} /> {/* ✅ new herbs route */}
        <Route path="/lifestyletips" element={<LifestyleTips />} /> {/* ✅ new tips route */}
      </Routes>

      {!hideLayout && <Footer />}
    </div>
  );
}

export default function App() {
  return <AppContent />;
}

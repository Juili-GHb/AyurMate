import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf, Flame, Wind, Droplet, BookOpen } from "lucide-react"; // Icons for Vata, Pitta, Kapha

export default function Remedies() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [remedies, setRemedies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDosha, setSelectedDosha] = useState("");

  useEffect(() => {
    const fetchRemedies = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/remedies", {
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("Failed to fetch remedies");
        const data = await res.json();
        setRemedies(data);
      } catch (err) {
        console.error(err);
        setError("Could not load remedies.");
      } finally {
        setLoading(false);
      }
    };

    fetchRemedies();
  }, [token]);

  if (loading) return <p className="p-10 text-center">Loading remedies...</p>;
  if (error) return <p className="p-10 text-center text-red-500">{error}</p>;
  if (remedies.length === 0) return <p className="p-10 text-center">No remedies found.</p>;

  // --- Filtering ---
  const filteredRemedies = remedies.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.description && r.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDosha = selectedDosha ? r.doshaType === selectedDosha : true;

    return matchesSearch && matchesDosha;
  });

  const groupedRemedies = {
    Vata: filteredRemedies.filter((r) => r.doshaType === "Vata"),
    Pitta: filteredRemedies.filter((r) => r.doshaType === "Pitta"),
    Kapha: filteredRemedies.filter((r) => r.doshaType === "Kapha"),
  };

  const getDoshaIcon = (type) => {
    switch (type) {
      case "Vata": return <Wind className="w-6 h-6 text-green-600" />;
      case "Pitta": return <Flame className="w-6 h-6 text-red-500" />;
      case "Kapha": return <Droplet className="w-6 h-6 text-blue-500" />;
      default: return <Leaf className="w-6 h-6 text-green-600" />;
    }
  };

  const renderRemedyCards = (remedyArray) =>
    remedyArray.map((remedy) => (
      <div
        key={remedy._id}
        className="relative group bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition cursor-pointer flex flex-col justify-between gap-3 h-64"
      >
        <div className="flex flex-col gap-2 z-10 relative">
          <div className="flex items-center gap-3">
            {getDoshaIcon(remedy.doshaType)}
            <h2 className="text-xl font-semibold text-green-700">{remedy.title}</h2>
          </div>
          <p className="text-gray-700">{remedy.description}</p>
        </div>

        {remedy.source && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm p-6 rounded-2xl flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition duration-300 z-20 hover:scale-105">
            <BookOpen className="w-8 h-8 mb-3 text-green-700" />
            <h3 className="text-lg font-semibold mb-2">Source</h3>
            <p className="text-center text-sm">{remedy.source.title}</p>
          </div>
        )}
      </div>
    ));

  return (
    <div className="min-h-screen p-10 bg-green-50">
      <h1 className="text-3xl font-bold text-green-900 mb-8 text-center">Herbal Remedies</h1>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
        {/* Search Input */}
        <div className="relative w-full sm:w-1/3">
          <input
            type="text"
            placeholder="Search remedies..."
            className="w-full p-3 pl-10 rounded-full bg-green-100 text-green-900 placeholder-green-700 shadow-inner focus:bg-green-200 focus:ring-2 focus:ring-green-600 outline-none transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="absolute left-3 top-3.5 w-5 h-5 text-green-800"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
            />
          </svg>
        </div>

        {/* Dosha Dropdown */}
        <div className="relative w-full sm:w-1/4">
          <select
            className="w-full p-3 pl-10 rounded-full bg-green-100 text-green-900 shadow-inner
             focus:bg-green-200 focus:ring-2 focus:ring-green-600
             outline-none transition cursor-pointer appearance-none hover:bg-green-200"
            value={selectedDosha}
            onChange={(e) => setSelectedDosha(e.target.value)}
          >
            <option value="">All Doshas</option>
            <option value="Vata">Vata</option>
            <option value="Pitta">Pitta</option>
            <option value="Kapha">Kapha</option>
          </select>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="absolute right-3 top-3.5 w-5 h-5 text-green-800 pointer-events-none"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10l4 4 4-4" />
          </svg>
        </div>
      </div>

      {/* Remedies by Dosha */}
      {groupedRemedies.Vata.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-green-800 mb-4">Vata Remedies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {renderRemedyCards(groupedRemedies.Vata)}
          </div>
        </section>
      )}

      {groupedRemedies.Pitta.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-green-800 mb-4">Pitta Remedies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {renderRemedyCards(groupedRemedies.Pitta)}
          </div>
        </section>
      )}

      {groupedRemedies.Kapha.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-green-800 mb-4">Kapha Remedies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {renderRemedyCards(groupedRemedies.Kapha)}
          </div>
        </section>
      )}

      {filteredRemedies.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No remedies match your search/filter.</p>
      )}

      <div className="mt-10 text-center">
        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
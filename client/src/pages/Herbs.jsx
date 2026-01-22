import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf, BookOpen } from "lucide-react";

export default function Herbs() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [herbs, setHerbs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDosha, setSelectedDosha] = useState("");

  useEffect(() => {
    const fetchHerbs = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/herbs", {
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("Failed to fetch herbs");
        const data = await res.json();

        const mappedData = data.map((herb) => {
          let imagePath = "/images/default.jpg"; // fallback
          switch (herb.name.toLowerCase()) {
            // Vata Herbs
            case "ashwagandha":
              imagePath = "/ashwagandha.jpg";
              break;
            case "tulsi":
              imagePath = "/tulsi2.jpg";
              break;
            case "shatavari":
              imagePath = "/shatavari.jpg";
              break;
            case "bala":
              imagePath = "/bala.jpg";
              break;
            case "licorice":
              imagePath = "/licorice.jpg";
              break;
            case "cardamom":
              imagePath = "/cardamom.jpg";
              break;

            // Pitta Herbs
            case "brahmi":
              imagePath = "/brahmi.jpg";
              break;
            case "neem":
              imagePath = "/neem.jpg";
              break;
            case "amla":
              imagePath = "/amla.jpg";
              break;
            case "guduchi":
              imagePath = "/guduchi.jpg";
              break;
            case "coriander":
              imagePath = "/coriander.jpg";
              break;
            case "fennel":
              imagePath = "/fennel.jpg";
              break;

            // Kapha Herbs
            case "ginger":
              imagePath = "/ginger.jpg";
              break;
            case "triphala":
              imagePath = "/triphala2.jpg";
              break;
            case "cinnamon":
              imagePath = "/cinnamon.jpg";
              break;
            case "black pepper":
              imagePath = "/blackpepper.jpg";
              break;
            case "mustard":
              imagePath = "/mustard.jpg";
              break;
            case "clove":
              imagePath = "/clove.jpg";
              break;

            default:
              break;
          }
          return { ...herb, imageUrl: imagePath };
        });

        setHerbs(mappedData);
      } catch (err) {
        console.error(err);
        setError("Could not load herbs.");
      } finally {
        setLoading(false);
      }
    };

    fetchHerbs();
  }, [token]);

  if (loading) return <p className="p-10 text-center">Loading herbs...</p>;
  if (error) return <p className="p-10 text-center text-red-500">{error}</p>;
  if (herbs.length === 0) return <p className="p-10 text-center">No herbs found.</p>;

  // --- Filtering ---
  const filteredHerbs = herbs.filter((h) => {
    const matchesSearch =
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (Array.isArray(h.uses) && h.uses.join(", ").toLowerCase().includes(searchTerm.toLowerCase())) ||
      (Array.isArray(h.benefits) && h.benefits.join(", ").toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDosha = selectedDosha ? h.doshaType === selectedDosha : true;

    return matchesSearch && matchesDosha;
  });

  const groupedHerbs = {
    Vata: filteredHerbs.filter((h) => h.doshaType === "Vata"),
    Pitta: filteredHerbs.filter((h) => h.doshaType === "Pitta"),
    Kapha: filteredHerbs.filter((h) => h.doshaType === "Kapha"),
  };

  const renderHerbCards = (herbArray) =>
    herbArray.map((herb) => (
      <div
        key={herb._id}
        className="relative group bg-white p-4 rounded-2xl shadow-lg hover:shadow-2xl transition cursor-pointer flex flex-col justify-between gap-3 h-72"
      >
        <div className="flex flex-col gap-2 z-10 relative">
          <img
            src={herb.imageUrl}
            alt={herb.name}
            className="w-full h-32 object-cover rounded-xl mb-2"
          />
          <div className="flex items-center gap-3">
            <Leaf className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold text-green-700">{herb.name}</h2>
          </div>
          <p className="text-gray-700 text-sm">
            <strong>Uses:</strong>{" "}
            {Array.isArray(herb.uses) ? herb.uses.join(", ") : herb.uses}
            <br />
            <strong>Benefits:</strong>{" "}
            {Array.isArray(herb.benefits) ? herb.benefits.join(", ") : herb.benefits}
          </p>
        </div>

        {herb.source && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm p-6 rounded-2xl flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition duration-300 z-20 hover:scale-105">
            <BookOpen className="w-8 h-8 mb-3 text-green-700" />
            <h3 className="text-lg font-semibold mb-2">Source</h3>
            <p className="text-center text-sm">{herb.source.title}</p>
          </div>
        )}
      </div>
    ));

  return (
    <div className="min-h-screen p-10 bg-green-50">
      <h1 className="text-3xl font-bold text-green-900 mb-8 text-center">Herbs</h1>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
        {/* Search Input */}
        <div className="relative w-full sm:w-1/3">
          <input
            type="text"
            placeholder="Search herbs..."
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10l4 4 4-4"
            />
          </svg>
        </div>
      </div>

      {groupedHerbs.Vata.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-green-800 mb-4">Vata Herbs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {renderHerbCards(groupedHerbs.Vata)}
          </div>
        </section>
      )}

      {groupedHerbs.Pitta.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-green-800 mb-4">Pitta Herbs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {renderHerbCards(groupedHerbs.Pitta)}
          </div>
        </section>
      )}

      {groupedHerbs.Kapha.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-green-800 mb-4">Kapha Herbs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {renderHerbCards(groupedHerbs.Kapha)}
          </div>
        </section>
      )}

      {filteredHerbs.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No herbs match your search/filter.</p>
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
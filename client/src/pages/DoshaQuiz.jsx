import { useState } from "react"; 
import { useNavigate } from "react-router-dom";

export default function DoshaQuiz() {
  const navigate = useNavigate();
  
  // Updated questions with unique options only
  const questions = [
  { question: "What is your skin type?", options: ["Dry skin", "Oily skin", "Cool skin"] },
  { question: "How is your sleep pattern?", options: ["Light sleep", "Normal sleep", "Oversleeping"] },
  { question: "How is your digestion?", options: ["Irregular hunger", "Sharp hunger", "Slow digestion"] },
  { question: "How is your energy level?", options: ["Low stamina", "Strong stamina", "Lethargy"] },
  { question: "How is your body temperature?", options: ["Cold hands", "Hot temper", "Cool body"] },
  { question: "How is your mental state?", options: ["Anxiety", "Intense focus", "Calm nature"] },
  { question: "How is your speech pattern?", options: ["Quick speech", "Sharp speech", "Slow speech"] },
  { question: "How is your appetite?", options: ["Bloating", "Acid reflux", "Weight gain"] }, // all in map
  { question: "How is your emotional nature?", options: ["Restlessness", "Irritability", "Emotional attachment"] },
  { question: "How is your memory/thirst?", options: ["Forgetfulness", "Thirsty", "Soft voice"] } // align with map
];

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleAnswer = async (option) => {
    if (loading) return;

    const newAnswers = [...answers];
    newAnswers[current] = option; // preserve previous answers
    setAnswers(newAnswers);

    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Please login to take the quiz");

        const res = await fetch(`${API_URL}/api/dosha/quiz`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ answers: newAnswers }),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to analyze dosha");
        }

        const data = await res.json();
        setResult(data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRestart = () => {
    setCurrent(0);
    setAnswers([]);
    setResult(null);
    setError("");
  };

  const handlePrevious = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  const getDominantDoshas = (score) => {
    if (!score) return [];
    const maxScore = Math.max(score.vata, score.pitta, score.kapha);
    const dominants = [];
    if (score.vata === maxScore) dominants.push("Vata");
    if (score.pitta === maxScore) dominants.push("Pitta");
    if (score.kapha === maxScore) dominants.push("Kapha");
    return dominants;
  };

  const dominantDoshas = getDominantDoshas(result?.scoreBreakdown);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100 p-4">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8 md:p-12">
        <h2 className="text-3xl md:text-4xl font-bold text-green-700 mb-6 text-center">Dosha Quiz</h2>

        {loading && <p className="text-green-600 mb-4 text-center">Analyzing your result...</p>}
        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        {!result ? (
          <>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
              <div
                className="bg-green-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${((current + 1) / questions.length) * 100}%` }}
              ></div>
            </div>

            <p className="text-gray-700 font-medium mb-3 text-center">
              Question {current + 1} of {questions.length}
            </p>

            <h3 className="text-xl md:text-2xl text-green-700 font-semibold mb-6 text-center">
              {questions[current].question}
            </h3>

            <div className="flex flex-col gap-4">
              {questions[current].options.map((opt, idx) => (
                <button
                  key={idx}
                  className={`${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-800"} bg-green-700 text-white px-6 py-3 rounded-xl text-lg md:text-xl font-medium transition`}
                  onClick={() => handleAnswer(opt)}
                  disabled={loading}
                >
                  {opt}
                </button>
              ))}
            </div>

            {/* Only Previous Button Centered */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={handlePrevious}
                disabled={current === 0}
                className="bg-green-700 text-white px-6 py-3 rounded-xl text-lg md:text-xl hover:bg-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-black">
              Your Dosha Detected:{" "}
              {dominantDoshas.map((dosha, idx) => (
                <span key={dosha}>
                  {dosha}
                  {idx < dominantDoshas.length - 1 ? " and " : ""}
                </span>
              ))}
            </h3>

            {result.scoreBreakdown && (
              <div className="bg-green-50 rounded-xl p-5 mb-6 text-left">
                <h4 className="font-semibold text-green-700 mb-3 text-lg">Score Breakdown:</h4>
                <ul className="list-disc list-inside text-green-700 text-base md:text-lg">
                  {["Vata", "Pitta", "Kapha"].map((dosha) => (
                    <li key={dosha}>
                      {dosha}: {result.scoreBreakdown[dosha.toLowerCase()]}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col md:flex-row justify-center gap-4">
              <button
                className="bg-green-700 text-white px-6 py-3 rounded-xl text-lg md:text-xl hover:bg-green-800 transition w-full md:w-64"
                onClick={() => navigate("/dashboard")}
              >
                View Personalized Plan
              </button>
              <button
                className="bg-green-700 text-white px-6 py-3 rounded-xl text-lg md:text-xl hover:bg-green-800 transition w-full md:w-64"
                onClick={handleRestart}
              >
                Retake Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
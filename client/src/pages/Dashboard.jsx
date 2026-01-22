import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Leaf,
  Home,
  Heart,
  Diamond,
  Bell,
  ClipboardCheck,
  BookOpen,
  User,
  LogOut,
  Trash2,
  Plus,
  Coffee,
  Edit,
  X
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";
import { Calendar, ArrowLeft, ArrowRight } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const storedUserId = localStorage.getItem("userId");
  const storedUserName = localStorage.getItem("userName");
  const token = localStorage.getItem("token");

  const userId = storedUserId;
  const userName = storedUserName || "User";

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ayurPosts, setAyurPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [oldResults, setOldResults] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // === Reminders State ===
  const [reminders, setReminders] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentReminder, setCurrentReminder] = useState(null);
  const [reminderTitle, setReminderTitle] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [reminderFrequency, setReminderFrequency] = useState("daily");
  const [reminderIntervalDays, setReminderIntervalDays] = useState("");

  const featuresRef = useRef(null);
  const ayurFeedRef = useRef(null);

  const apiBase = "http://localhost:5000/api/reminders";

  useEffect(() => {
    if (!userId) navigate("/login");
  }, [userId, navigate]);

  // === Symptom Tracker State ===
  const scrollToSymptomTracker = () => {
    document.getElementById("symptom-timeline")?.scrollIntoView({ behavior: "smooth" });
  };

  const [symptomLogs, setSymptomLogs] = useState([]);
  const [newSymptoms, setNewSymptoms] = useState([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
    return new Date(now.setDate(diff));
  });

  // === Fetch Symptom Logs ===
  useEffect(() => {
    if (!userId) return;
    const fetchSymptoms = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/symptoms/user/${userId}`);
        const data = await res.json();
        setSymptomLogs(data);
      } catch (err) {
        console.error("Error fetching symptom logs:", err);
      }
    };
    fetchSymptoms();
  }, [userId]);

  // === Add New Symptom Log ===
  const handleAddSymptom = async () => {
    if (newSymptoms.length === 0) return;
    try {
      const res = await fetch("http://localhost:5000/api/symptoms/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, symptoms: newSymptoms })
      });
      const data = await res.json();
      setSymptomLogs(prev => [data.data, ...prev]);
      setNewSymptoms([]);
    } catch (err) {
      console.error("Error adding symptom log:", err);
    }
  };

  // === Utility: Check if a date is in current week ===
  const isInCurrentWeek = (date) => {
    const d = new Date(date);
    const weekStart = currentWeekStart;
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return d >= weekStart && d <= weekEnd;
  };

  // === Navigate Weeks ===
  const changeWeek = (direction) => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(currentWeekStart.getDate() + (direction === "prev" ? -7 : 7));
    setCurrentWeekStart(newStart);
  };

  // Fetch dashboard summary
  useEffect(() => {
    if (!userId) return;
    const fetchDashboard = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/dashboard/summary/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setDashboard(data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
    fetchReminders();
  }, [userId, token]);

  // Fetch old quiz results
  const fetchOldResults = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/dosha/history`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      const mappedResults = data.map(item => ({
        date: item.createdAt,
        dominantDosha: item.doshaType,
        scores: item.scoreBreakdown,
      }));
      setOldResults(mappedResults);
      setShowHistoryModal(true);
    } catch (err) {
      console.error("Error fetching old results:", err);
    }
  };

  // === Fetch Reminders ===
  const fetchReminders = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`${apiBase}/user/${userId}`);
      const data = await res.json();
      if (data.success) setReminders(data.reminders);
    } catch (err) {
      console.error("Error fetching reminders:", err);
    }
  };

  // === Reminder Modal ===
  const openReminderModal = (reminder = null) => {
    setCurrentReminder(reminder);
    if (reminder) {
      setReminderTitle(reminder.title);
      setReminderTime(new Date(reminder.time).toISOString().slice(0, 16));
      setReminderFrequency(reminder.frequency);
      setReminderIntervalDays(reminder.intervalDays || "");
    } else {
      setReminderTitle("");
      setReminderTime("");
      setReminderFrequency("daily");
      setReminderIntervalDays("");
    }
    setModalOpen(true);
  };

  // saving reminder
  const handleSaveReminder = async () => {
    if (!userId) return;

    const payload = {
      userId,
      title: reminderTitle,
      time: reminderTime,
      frequency: reminderFrequency
    };

    if (reminderFrequency === "every_n_days") {
      payload.intervalDays = Number(reminderIntervalDays);
    }

    try {
      if (currentReminder) {
        await fetch(`${apiBase}/${currentReminder._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch(`${apiBase}/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      setModalOpen(false);
      fetchReminders();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReminder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this reminder?")) return;
    try {
      await fetch(`${apiBase}/${id}`, { method: "DELETE" });
      fetchReminders();
    } catch (err) {
      console.error(err);
    }
  };

  // === Schedule Reminders ===
  useEffect(() => {
    // clear all previous timers
    let timers = [];

    reminders.forEach((rem) => {
      const now = new Date().getTime();
      const reminderTime = new Date(rem.time).getTime();
      const diff = reminderTime - now;

      if (diff > 0) {
        // schedule it at exact time
        const timerId = setTimeout(async () => {
          alert(`Reminder: ${rem.title}`);

          // if it's once / weekly / monthly => delete after firing
          if (["once", "weekly", "monthly"].includes(rem.frequency)) {
            await fetch(`${apiBase}/${rem._id}`, { method: "DELETE" });
            fetchReminders();
          }

          // if it's daily => reschedule for next day
          if (rem.frequency === "daily") {
            const nextTime = new Date(reminderTime);
            nextTime.setDate(nextTime.getDate() + 1);
            await fetch(`${apiBase}/${rem._id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...rem, time: nextTime }),
            });
            fetchReminders();
          }

          // every_n_days logic
          if (rem.frequency === "every_n_days" && rem.intervalDays) {
            const nextTime = new Date(reminderTime);
            nextTime.setDate(nextTime.getDate() + rem.intervalDays);
            await fetch(`${apiBase}/${rem._id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...rem, time: nextTime }),
            });
            fetchReminders();
          }

        }, diff);

        timers.push(timerId);
      }
    });

    return () => {
      timers.forEach((id) => clearTimeout(id));
    };
  }, [reminders]);

  const features = [
    { icon: <Heart className="w-6 h-6 text-green-700" />, title: "Dosha Quiz", desc: "Start now", route: "/quiz" },
    { icon: <Diamond className="w-6 h-6 text-green-700" />, title: "Remedies", desc: "Search for herbal remedies", route: "/remedies" },
    { icon: <Leaf className="w-6 h-6 text-green-700" />, title: "Herbs", desc: "Explore herbs for your dosha", route: "/herbs" },
    { icon: <Coffee className="w-6 h-6 text-green-700" />, title: "Lifestyle Tips", desc: "Based on your quiz results", route: "/lifestyletips" },
    { icon: <Bell className="w-6 h-6 text-green-700" />, title: "Reminder", desc: "Set a reminder", route: "#" },
    { icon: <ClipboardCheck className="w-6 h-6 text-green-700" />, title: "Symptoms Tracker", desc: "Track your symptoms over time", onClick: scrollToSymptomTracker },
  ];

  const ayurFeedFeature = { icon: <BookOpen className="w-6 h-6 text-green-700" />, title: "AyurFeed", desc: "Benefits of Seasonal Detox" };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) return;

    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToAyurFeed = () => {
    ayurFeedRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // === AyurFeed API Base ===
  const ayurFeedAPI = "http://localhost:5000/api/feed";

  // ✅ Fetch all posts for the current logged-in user
  useEffect(() => {
    if (!userId) return;
    fetchUserPosts();
  }, [userId]);

  const fetchUserPosts = async () => {
    try {
      const res = await fetch(`${ayurFeedAPI}/user/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();

      // ✅ Normalize so every post has userId object
      const normalized = data.map((post) => ({
        ...post,
        userId:
          typeof post.userId === "object"
            ? post.userId
            : { _id: userId, name: userName || "Anonymous" },
      }));

      setAyurPosts(normalized);
    } catch (error) {
      console.error("🚨 Error fetching user posts:", error);
      alert("⚠️ Could not load your AyurFeed posts. Please try again later.");
    }
  };

  // ✅ Add Post (connects to backend)
  const addAyurPost = async () => {
    const trimmedPost = newPost.trim();
    const trimmedTags = hashtags
      .split(" ")
      .map((tag) => tag.trim().replace(/^#/, "")) // remove '#' if typed
      .filter(Boolean);

    if (!trimmedPost) {
      alert("⚠️ Please write something before posting 🌿");
      return;
    }

    if (trimmedPost.length < 5) {
      alert("⚠️ Post too short — write at least 5 characters 🌱");
      return;
    }

    try {
      const body = {
        content: trimmedPost,
        userId,
        hashtags: trimmedTags.length > 0 ? trimmedTags : [], // ✅ safe even if empty
      };

      const res = await fetch(`${ayurFeedAPI}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "⚠️ Could not add post");
        return;
      }

      const saved = data.savedPost || data.post || data;

      const newPostObj = {
        ...saved,
        userId: {
          _id: userId,
          name: userName || "Anonymous",
        },
      };

      setAyurPosts((prev) => [newPostObj, ...prev]);
      setNewPost("");
      setHashtags("");
      alert("✅ Post added successfully!");
    } catch (err) {
      console.error("Error adding post:", err);
      alert("⚠️ Unexpected server error. Please try again later.");
    }
  };

  // 🗑️ Delete Post
  const deleteAyurPost = async (id) => {
    try {
      const response = await fetch(`${ayurFeedAPI}/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      if (response.ok) {
        setAyurPosts(ayurPosts.filter((p) => p._id !== id));
      } else {
        alert(data.message || "Error deleting post");
      }
    } catch (err) {
      console.error("Error deleting AyurFeed post:", err);
    }
  };

  if (loading) return <p className="p-10 text-center">Loading dashboard...</p>;

  const { dominantDoshas, scores, remedies, herbs, lifestyleTips } = dashboard || {};

  const pieColors = ["#16a34a", "#ea580c", "#0ea5e9"];
  const pieData = scores
    ? Object.entries(scores).map(([k, v], idx) => ({
      name: k.charAt(0).toUpperCase() + k.slice(1),
      value: v,
      color: pieColors[idx]
    }))
    : [];

  return (
    <div className="min-h-screen flex bg-green-50">
      {/* Sidebar */}
      <aside className="w-64 bg-green-200 p-6 rounded-r-2xl flex-shrink-0 sticky top-0 h-screen overflow-auto">
        <div className="flex items-center gap-2 mb-10">
          <Leaf className="w-8 h-8 text-green-700" />
          <h1 className="text-2xl font-bold text-green-900">AyurMate</h1>
        </div>
        <nav className="space-y-4">
          <div
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3 bg-green-700 text-white px-4 py-2 rounded-lg cursor-pointer"
          >
            <Home className="w-5 h-5" /> Dashboard
          </div>
          {features.map((f, idx) => (
            <div
              key={idx}
              onClick={() => f.title === "Reminder" ? openReminderModal() : f.onClick ? f.onClick() : navigate(f.route)}
              className="flex items-center gap-3 hover:bg-green-300 px-4 py-2 rounded-lg cursor-pointer"
            >
              {f.icon} {f.title}
            </div>
          ))}
          <div
            onClick={scrollToAyurFeed}
            className="flex items-center gap-3 hover:bg-green-300 px-4 py-2 rounded-lg cursor-pointer"
          >
            {ayurFeedFeature.icon} {ayurFeedFeature.title}
          </div>
        </nav>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 p-10 pt-6 overflow-y-auto">
        {/* Top Navbar */}
        <div className="flex justify-between items-center mb-8 p-4 bg-white rounded-lg shadow">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-green-700" />
            <span className="font-medium text-gray-800">{userName}</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 hover:bg-green-200"
          >
            <LogOut className="w-5 h-5 text-green-700" />
          </button>
        </div>

        {/* New User Message */}
        {(!dominantDoshas || dominantDoshas.length === 0) && (
          <div className="bg-green-100 text-green-800 p-4 rounded-lg shadow mb-10">
            <p>Take the Dosha Quiz to get started!</p>
          </div>
        )}

        {/* Dosha Analysis Section */}
        {dominantDoshas && dominantDoshas.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow mb-10">
            <h3 className="font-semibold text-gray-800 text-xl mb-6">
              Your Dosha Analysis
            </h3>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Pie Chart */}
              <div className="flex-1 h-64 md:h-72 lg:h-80 p-4 bg-green-50 rounded-lg shadow-inner">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius="78%"
                      labelLine={true}
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={30} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Dosha Info */}
              <div className="flex-1 flex flex-col gap-3">
                <p className="text-gray-800 text-lg">
                  Dominant Doshas:{" "}
                  <strong className="text-green-700">
                    {dominantDoshas.join(" & ")}
                  </strong>
                </p>
                {dominantDoshas.map((dosha) => {
                  const remedy = remedies?.find(r => r.doshaType.toLowerCase() === dosha.toLowerCase());
                  const herb = herbs?.find(h => h.doshaType.toLowerCase() === dosha.toLowerCase());
                  const tip = lifestyleTips?.find(t => t.doshaType.toLowerCase() === dosha.toLowerCase());

                  if (!remedy && !herb && !tip) return null;

                  return (
                    <div
                      key={dosha}
                      className="bg-green-50 p-3 rounded-lg shadow hover:shadow-lg transition"
                    >
                      <h4 className="font-semibold text-green-700 text-md mb-1 capitalize">{dosha}</h4>
                      {remedy && <p className="text-gray-700 text-sm"><strong>Remedy:</strong> {remedy.title}</p>}
                      {herb && <p className="text-gray-700 text-sm"><strong>Herb:</strong> {herb.name}</p>}
                      {tip && <p className="text-gray-700 text-sm"><strong>Lifestyle Tip:</strong> {tip.tip}</p>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* === Dashboard Reminders Section === */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Bell className="w-6 h-6 text-green-700" /> Your Reminders
              </h3>

              {reminders.length === 0 ? (
                <p className="text-gray-600">No reminders set yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {reminders.map((rem) => (
                    <div key={rem._id} className="bg-white p-5 rounded-xl shadow relative transition-transform transform hover:scale-105">
                      <h4 className="text-green-700 font-semibold">{rem.title}</h4>
                      <p className="text-gray-600">{new Date(rem.time).toLocaleString()}</p>
                      <p className="text-gray-600">{rem.frequency}</p>

                      <div className="absolute top-4 right-4 flex gap-2">
                        <button onClick={() => openReminderModal(rem)} className="text-blue-500 hover:text-blue-700">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDeleteReminder(rem._id)} className="text-red-500 hover:text-red-700">
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-4">
              <button
                onClick={scrollToFeatures}
                className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Explore More
              </button>
              <button
                onClick={fetchOldResults}
                className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                View Quiz History
              </button>
            </div>
          </div>
        )}

        {/* Features Grid */}
        <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {features.map((f, idx) => (
            <div
              key={idx}
              onClick={() => f.title === "Reminder" ? openReminderModal() : f.onClick ? f.onClick() : navigate(f.route)}
              className="bg-white p-6 rounded-lg shadow flex flex-col items-start gap-3 hover:shadow-lg transition cursor-pointer"
            >
              {f.icon}
              <h3 className="text-lg font-semibold text-gray-800">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>

        <div id="symptom-timeline" className="mt-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6  text-green-700" /> Symptom Tracker
          </h3>

          {/* Week Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => changeWeek("prev")} className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1">
              <ArrowLeft size={16} /> Previous
            </button>
            <span className="font-medium  text-green-700">
              Week of {currentWeekStart.toLocaleDateString()}
            </span>
            <button onClick={() => changeWeek("next")} className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1">
              Next <ArrowRight size={16} />
            </button>
          </div>

          {/* Week Timeline */}
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[...Array(7)].map((_, i) => {
              const dayDate = new Date(currentWeekStart);
              dayDate.setDate(currentWeekStart.getDate() + i);
              const dayLogs = symptomLogs.filter(log => {
                const logDate = new Date(log.date);
                return logDate.toDateString() === dayDate.toDateString();
              });

              return (
                <div key={i} className="bg-green-600 min-w-[150px] p-3 rounded-xl shadow-lg flex flex-col gap-3 hover:bg-green-700 transition">
                  <div className="text-center font-medium text-white mb-2">
                    {dayDate.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
                  </div>

                  {/* Add symptom input */}
                  <input
                    type="text"
                    placeholder="Add symptom..."
                    value={newSymptoms[i] || ""}
                    onChange={(e) => {
                      const copy = [...newSymptoms];
                      copy[i] = e.target.value;
                      setNewSymptoms(copy);
                    }}
                    className="p-2 border border-green-400 rounded-lg text-sm bg-green-700 text-white placeholder-green-200"
                  />
                  <button
                    onClick={async () => {
                      const today = new Date().toDateString();
                      const selectedDay = new Date(dayDate).toDateString();

                      // 🟡 Check if selected day is not today
                      if (selectedDay !== today) {
                        alert("You can add symptoms only for today's date.");
                        // 🧹 Clear input after alert
                        const copy = [...newSymptoms];
                        copy[i] = "";
                        setNewSymptoms(copy);
                        return;
                      }

                      if (!newSymptoms[i]?.trim()) {
                        alert("Please enter a symptom before adding.");
                        return;
                      }

                      const res = await fetch("http://localhost:5000/api/symptoms/add", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ userId, symptoms: [newSymptoms[i]], date: dayDate })
                      });

                      const data = await res.json();
                      setSymptomLogs((prev) => [data.data, ...prev]);

                      // 🧹 Clear input after adding successfully
                      const copy = [...newSymptoms];
                      copy[i] = "";
                      setNewSymptoms(copy);

                      alert("Symptom added successfully!");
                    }}
                    className="bg-green-800 text-white rounded-lg px-2 py-1 text-sm hover:bg-green-900 transition"
                  >
                    Add
                  </button>


                  {/* Day's Logs */}
                  <div className="flex flex-col gap-2 mt-2">
                    {dayLogs.length === 0 ? (
                      <p className="text-green-200 text-xs italic">No symptoms</p>
                    ) : (
                      dayLogs.map(log => (
                        <div key={log._id} className="bg-green-700 p-2 rounded-lg shadow-sm hover:shadow-md text-white transition">
                          {log.symptoms.join(", ")}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* === Weekly Symptom Trends (Stacked Bars + Insights + Wellness Score) === */}
        <div className="mt-10 bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-green-700" /> Weekly Symptom Trends
          </h3>

          {(() => {
            if (!symptomLogs) return <p className="text-gray-600">Loading...</p>;

            // ✅ Ensure week always starts from Monday
            const start = new Date(currentWeekStart);
            const day = start.getDay();
            const diff = day === 0 ? -6 : 1 - day; // Adjust so Monday is start
            start.setDate(start.getDate() + diff);
            start.setHours(0, 0, 0, 0);

            const end = new Date(start);
            end.setDate(start.getDate() + 6);
            end.setHours(23, 59, 59, 999);

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const isFutureWeek = start > today;

            // ✅ Filter logs within current selected week (Monday → Sunday)
            const logsToAnalyze = symptomLogs.filter((log) => {
              const logDate = new Date(log.date);
              logDate.setHours(0, 0, 0, 0);
              return logDate >= start && logDate <= end;
            });

            // 🗓️ Create Monday → Sunday list
            const days = Array.from({ length: 7 }).map((_, i) => {
              const d = new Date(start);
              d.setDate(start.getDate() + i);
              d.setHours(0, 0, 0, 0);
              return {
                label: d.toLocaleDateString("en-US", { weekday: "short" }),
                date: d,
              };
            });

            // 🕓 Upcoming week message
            if (isFutureWeek) {
              return (
                <div className="text-gray-700 bg-green-50 p-4 rounded-lg">
                  <p className="text-lg font-medium text-green-800">🕓 Upcoming Week</p>
                  <p className="text-sm mt-1">
                    You haven’t logged any symptoms for this upcoming week yet. Start fresh when it begins!
                  </p>
                </div>
              );
            }

            // ❌ No logs in this week
            if (logsToAnalyze.length === 0) {
              return (
                <div className="text-gray-700 bg-green-50 p-4 rounded-lg">
                  <p className="text-lg font-medium text-green-800">No Logs This Week</p>
                  <p className="mt-1">
                    You reported no symptoms this week.
                    <br />
                    Most common: <strong>None</strong>.
                    <br />
                    Weekly progress: <strong>No progress this week</strong>.
                  </p>
                </div>
              );
            }

            // 🧩 Collect unique symptoms
            const allSymptoms = new Set();
            logsToAnalyze.forEach((log) =>
              log.symptoms.forEach((s) => allSymptoms.add(s.trim().toLowerCase()))
            );
            const symptomList = Array.from(allSymptoms);

            // 🎨 Prepare daily data (grey only for missing *past* days)
            const dailyData = days.map((d) => {
              const dayObj = { day: d.label };
              symptomList.forEach((s) => (dayObj[s] = 0));

              const found = logsToAnalyze.filter((log) => {
                const logDate = new Date(log.date);
                logDate.setHours(0, 0, 0, 0);
                return logDate.getTime() === d.date.getTime();
              });

              if (found.length > 0) {
                found.forEach((log) => {
                  log.symptoms.forEach((s) => {
                    const key = s.trim().toLowerCase();
                    dayObj[key] += 1;
                  });
                });
              } else if (d.date < today && d.date >= start) {
                // ✅ Grey bar only for missing past days (not future)
                dayObj["noLogs"] = 1;
              }

              return dayObj;
            });

            const colors = [
              "#16a34a",
              "#f97316",
              "#dc2626",
              "#2563eb",
              "#9333ea",
              "#14b8a6",
              "#ca8a04",
            ];

            // 📊 Symptom frequency summary
            const symptomCount = {};
            logsToAnalyze.forEach((log) =>
              log.symptoms.forEach((s) => {
                const key = s.trim().toLowerCase();
                symptomCount[key] = (symptomCount[key] || 0) + 1;
              })
            );
            const totalSymptoms = Object.values(symptomCount).reduce((a, b) => a + b, 0);
            const sortedSymptoms = Object.entries(symptomCount).sort((a, b) => b[1] - a[1]);
            const mostCommon = sortedSymptoms.slice(0, 2).map(([s]) => s);

            // 🧘 Weekly progress
            const daysLogged = new Set(
              logsToAnalyze.map((log) => new Date(log.date).toDateString())
            ).size;
            const wellnessScore = Math.round((daysLogged / 7) * 100);

            let wellnessQuote = "";
            if (wellnessScore <= 20)
              wellnessQuote = "🌱 You logged rarely this week — try to track more often.";
            else if (wellnessScore <= 50)
              wellnessQuote = "🍃 You're making progress! Keep logging regularly.";
            else if (wellnessScore <= 80)
              wellnessQuote = "🌿 Great consistency this week — you're building a healthy habit!";
            else wellnessQuote = "🌸 Excellent work! You tracked daily — true mindfulness in action.";

            return (
              <>
                {/* === Stacked Bar Chart === */}
                <div className="relative h-80 bg-green-50 rounded-lg p-4 shadow-inner">
                  <div className="absolute top-3 right-4 text-sm text-green-700 font-medium">
                    Symptom Severity
                  </div>

                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyData} margin={{ top: 30, right: 20, bottom: 20, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" tick={{ fill: "#166534" }} />
                      <YAxis allowDecimals={false} tick={{ fill: "#166534" }} />

                      {/* Tooltip only for logged or missing days */}
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (!active) return null;
                          const dayObj = dailyData.find((d) => d.day === label);
                          if (dayObj?.noLogs)
                            return (
                              <div className="bg-green-50 border border-green-200 rounded-lg p-2 shadow-sm text-gray-600">
                                <p className="font-semibold">No logs this day</p>
                              </div>
                            );

                          const filtered = payload.filter((p) => p.value > 0 && p.dataKey !== "noLogs");
                          if (filtered.length === 0) return null;
                          return (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-2 shadow-sm">
                              <p className="font-semibold text-green-700">{label}</p>
                              {filtered.map((p) => (
                                <p key={p.dataKey} style={{ color: p.fill }} className="text-sm">
                                  {p.dataKey}: {p.value}
                                </p>
                              ))}
                            </div>
                          );
                        }}
                      />

                      {/* Symptom bars */}
                      {symptomList.map((sym, idx) => (
                        <Bar
                          key={sym}
                          dataKey={sym}
                          stackId="a"
                          fill={colors[idx % colors.length]}
                          radius={idx === symptomList.length - 1 ? [6, 6, 0, 0] : [0, 0, 0, 0]}
                        />
                      ))}
                      {/* Grey bar only for missing past days */}
                      <Bar dataKey="noLogs" stackId="a" fill="#d1d5db" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* === Summary Insight === */}
                <div className="mt-6 bg-green-100 text-green-900 p-4 rounded-lg shadow-sm">
                  <p className="text-base">
                    🌿 You reported <strong>{totalSymptoms}</strong> symptoms this week.
                  </p>
                  <p className="mt-1">
                    Most common:{" "}
                    <strong>
                      {mostCommon.length > 0
                        ? mostCommon.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" & ")
                        : "None"}
                    </strong>
                    .
                  </p>
                </div>

                {/* === Wellness Score Bar === */}
                <div className="mt-6">
                  <h4 className="text-green-700 font-semibold mb-2">Weekly Wellness Progress</h4>
                  <div className="w-full bg-green-200 rounded-full h-5 overflow-hidden">
                    <div
                      className="bg-green-600 h-5 rounded-full transition-all duration-700"
                      style={{ width: `${wellnessScore}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{wellnessQuote}</p>
                </div>
              </>
            );
          })()}
        </div>

        {/* 🌿 AyurFeed – Wellness Journal Section */}
        <div
          ref={ayurFeedRef}
          className="mt-12 bg-green-50 p-6 rounded-2xl shadow-md border border-green-100"
        >
          <h3 className="text-2xl font-semibold text-green-700 mb-6 flex items-center gap-2">
            <BookOpen className="w-7 h-7" /> AyurFeed – Your Wellness Journal
          </h3>

          {/* ✍️ Create a New Post */}
          <div className="flex flex-col gap-3 mb-6">
            <input
              type="text"
              placeholder="🌿 Share your Ayurvedic moment — e.g., 'Tried herbal tea today ☕'"
              className="p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-gray-700"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />

            <input
              type="text"
              placeholder="#wellness #yoga (optional)"
              className="p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-gray-700"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
            />

            <button
              onClick={addAyurPost}
              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 shadow-md"
            >
              <Plus className="w-5 h-5" /> Post
            </button>
          </div>

          {/* 🪷 User Posts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ayurPosts.length === 0 ? (
              <p className="text-gray-500 text-center col-span-full italic">
                No entries yet — start your wellness journey today 🌸
              </p>
            ) : (
              ayurPosts.map((post) => {
                const content = post.content?.toLowerCase() || "";
                let emoji = "🌿";
                if (content.includes("tea") || content.includes("drink")) emoji = "🍵";
                else if (content.includes("yoga") || content.includes("meditation")) emoji = "🧘‍♀️";
                else if (content.includes("walk") || content.includes("run")) emoji = "🚶‍♀️";
                else if (content.includes("sleep") || content.includes("nap")) emoji = "🌙";
                else if (content.includes("food") || content.includes("meal") || content.includes("fruit")) emoji = "🥗";
                else if (content.includes("sun") || content.includes("morning")) emoji = "☀️";
                else if (content.includes("music")) emoji = "🎶";
                else if (content.includes("exercise") || content.includes("workout")) emoji = "💪";
                else if (content.includes("breathe") || content.includes("relax")) emoji = "🌸";
                else if (content.includes("happy") || content.includes("joy")) emoji = "😊";
                else if (content.includes("calm") || content.includes("peace")) emoji = "🕊️";
                else if (content.includes("herb") || content.includes("ayurvedic")) emoji = "🌺";

                return (
                  <div
                    key={post._id}
                    className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition relative border-l-4 border-green-400"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xl">
                        {emoji}
                      </div>
                      <div>
                        <p className="font-medium text-green-800">
                          {post.userId?.name || "Anonymous"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(post.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-700 text-base italic leading-relaxed">
                      {post.content}
                    </p>

                    <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                      {post.hashtags?.length > 0 && (
                        <span className="text-green-700 font-medium">
                          #{post.hashtags.join(" #")}
                        </span>
                      )}
                      {post.userId?._id === userId && (
                        <button
                          onClick={() => deleteAyurPost(post._id)}
                          className="text-red-500 hover:text-red-700 flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="mt-6 text-center border-t border-green-200 pt-4">
            <p className="text-green-700 font-medium italic">
              🌿 Small daily habits create lasting wellness 🌿
            </p>
          </div>
        </div>

        {/* Reminder Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                {currentReminder ? "Edit Reminder" : "Add Reminder"}
              </h3>
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Reminder Title"
                  value={reminderTitle}
                  onChange={(e) => setReminderTitle(e.target.value)}
                  className="p-2 border rounded-lg"
                />
                <input
                  type="datetime-local"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="p-2 border rounded-lg"
                />

                <select
                  value={reminderFrequency}
                  onChange={(e) => setReminderFrequency(e.target.value)}
                  className="p-2 border rounded-lg"
                >
                  <option value="once">Once</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="every_n_days">Every N Days</option>
                </select>

                {reminderFrequency === "every_n_days" && (
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter number of days"
                    value={reminderIntervalDays}
                    onChange={(e) => setReminderIntervalDays(e.target.value)}
                    className="p-2 border rounded-lg"
                  />
                )}

              </div>
              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveReminder}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quiz History Modal */}
        {showHistoryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto w-11/12 md:w-2/3">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Quiz History</h3>
              {oldResults.length === 0 ? (
                <p className="text-gray-600">No previous quiz results found.</p>
              ) : (
                <ul className="space-y-3">
                  {oldResults.map((res, idx) => (
                    <li key={idx} className="bg-green-50 p-3 rounded-lg shadow">
                      <p><strong>Date:</strong> {new Date(res.date).toLocaleString()}</p>
                      <p><strong>Dominant Dosha:</strong> {res.dominantDosha}</p>
                      <p>
                        <strong>Scores:</strong> Vata: {res.scores.vata}, Pitta: {res.scores.pitta}, Kapha: {res.scores.kapha}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
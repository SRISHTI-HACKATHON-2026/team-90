import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";


// ================= COMMUNITY DASHBOARD =================
function CommunityDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/get-status");
      const json = await res.json();
      setData(json);
      setError(false);
    } catch {
      setError(true);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (error) return <h1 style={styles.text}>No Data</h1>;
  if (!data) return <h1 style={styles.text}>Loading...</h1>;

  const color =
    data.status === "green"
      ? "green"
      : data.status === "yellow"
      ? "yellow"
      : "red";

  const weather =
    data.status === "green"
      ? "☀️"
      : data.status === "yellow"
      ? "⛅"
      : "⛈️";

  const label =
    data.status === "green"
      ? "GOOD"
      : data.status === "yellow"
      ? "WARNING"
      : "CRITICAL";

  const getAction = () => {
    if (!data.worst) return "";

    if (data.worst === "water") return "🚰 Reduce water usage";
    if (data.worst === "waste") return "🧹 Clean waste today";
    if (data.worst === "energy") return "🔌 Save electricity";

    return "";
  };

  const trendIcon =
    data.trend === "up" ? "🔺 Increasing" : "🔻 Decreasing";

  return (
    <div style={styles.container}>
      <h1>Community Status</h1>

      <div style={{ ...styles.circle, background: color }} />

      <h2>{label}</h2>

      <h2>{data.message}</h2>

      <h3>{getAction()}</h3>

      <div style={styles.resources}>
        <div>💧 {data.water}</div>
        <div>♻️ {data.waste}</div>
        <div>⚡ {data.energy}</div>
      </div>

      <div style={styles.weather}>{weather}</div>

      <div style={styles.trend}>{trendIcon}</div>
    </div>
  );
}


// ================= ADMIN DASHBOARD =================
function AdminDashboard() {
  const [logs, setLogs] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [zones, setZones] = useState({});

  const fetchData = async () => {
    const logsRes = await fetch("http://127.0.0.1:5000/logs");
    const analyticsRes = await fetch("http://127.0.0.1:5000/analytics");
    const zonesRes = await fetch("http://127.0.0.1:5000/zones");

    setLogs(await logsRes.json());
    setAnalytics(await analyticsRes.json());
    setZones(await zonesRes.json());
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.adminContainer}>
      <h1>Admin Dashboard</h1>

      <div style={styles.section}>
        <h2>Live Feed</h2>
        {logs.map((log, i) => (
          <div key={i}>
            {log.resource} +{log.value}
          </div>
        ))}
      </div>

      <div style={styles.section}>
        <h2>Resource Breakdown</h2>
        <div>💧 {analytics.water}</div>
        <div>♻️ {analytics.waste}</div>
        <div>⚡ {analytics.energy}</div>
      </div>

      <div style={styles.section}>
        <h2>Zone Activity</h2>
        <div style={styles.grid}>
          {Object.entries(zones).map(([zone, count]) => (
            <div key={zone} style={styles.box}>
              {zone}: {count}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// ================= ROUTER =================
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CommunityDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}


// ================= STYLES =================
const styles = {
  container: {
    textAlign: "center",
    background: "#111",
    color: "white",
    height: "100vh",
    paddingTop: "20px",
  },
  text: {
    color: "white",
    textAlign: "center",
    marginTop: "40px",
  },
  circle: {
    width: "250px",
    height: "250px",
    borderRadius: "50%",
    margin: "30px auto",
  },
  resources: {
    display: "flex",
    justifyContent: "center",
    gap: "40px",
    fontSize: "24px",
  },
  weather: {
    fontSize: "60px",
    marginTop: "20px",
  },
  trend: {
    marginTop: "10px",
    fontSize: "20px",
  },

  adminContainer: {
    background: "#111",
    color: "white",
    padding: "20px",
  },
  section: {
    marginBottom: "30px",
  },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },
  box: {
    background: "gray",
    padding: "10px",
  },
};

export default App;
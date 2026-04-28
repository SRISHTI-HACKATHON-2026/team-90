import { useEffect, useState } from "react";

function Admin() {
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
    <div style={styles.container}>
      <h1>Admin Dashboard</h1>

      {/* LIVE FEED */}
      <div style={styles.section}>
        <h2>Live Feed</h2>
        {logs.map((log, i) => (
          <div key={i}>
            {log.resource} +{log.value}
          </div>
        ))}
      </div>

      {/* ANALYTICS */}
      <div style={styles.section}>
        <h2>Resource Breakdown</h2>
        <div>💧 Water: {analytics.water}</div>
        <div>♻️ Waste: {analytics.waste}</div>
        <div>⚡ Energy: {analytics.energy}</div>
      </div>

      {/* ZONES */}
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

const styles = {
  container: {
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

export default Admin;
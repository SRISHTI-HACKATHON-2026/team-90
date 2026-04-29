import { useState, useEffect, useCallback } from "react";
import { CommandHeader } from "./_components/CommandHeader.tsx";
import { PerformanceHeader } from "./_components/PerformanceHeader.tsx";
import { SpatialAnalytics } from "./_components/SpatialAnalytics.tsx";
import { AuditLog } from "./_components/AuditLog.tsx";
import { BroadcastControl } from "./_components/BroadcastControl.tsx";
import FloatingNav from "../../components/Floatingnav.tsx";

const API_BASE = "http://127.0.0.1:5000";

export type StatusData = {
  water: number;
  waste: number;
  energy: number;
  ciu_score: number;
  status: string;
  worst: string | null;
  trend: string;
  message: string;
};

export type BackendLog = {
  phone: string;
  sender: string | null;
  type: string | null;
  resource: string | null;
  value: number | null;
  message: string | null;
  time: string;
};

export default function AdminIndex() {
  const [activeTab, setActiveTab] = useState<"overview" | "audit" | "broadcast">("overview");
  const [statusData, setStatusData] = useState<StatusData | null>(null);
  const [logs, setLogs] = useState<BackendLog[]>([]);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/get-status`);
      const data = await res.json();
      console.log("STATUS:", data);
      setStatusData(data);
    } catch (err) {
      console.error("Status fetch error:", err);
    }
  }, []);

  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/logs`);
      const data = await res.json();
      console.log("LOGS:", data);
      setLogs(data);
    } catch (err) {
      console.error("Logs fetch error:", err);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    fetchLogs();

    const interval = setInterval(() => {
      fetchStatus();
      fetchLogs();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchStatus, fetchLogs]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <FloatingNav />
      <CommandHeader activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-auto p-4 space-y-4">
        {activeTab === "overview" && (
          <>
            <PerformanceHeader statusData={statusData} />
            <SpatialAnalytics />
          </>
        )}
        {activeTab === "audit" && <AuditLog backendLogs={logs} />}
        {activeTab === "broadcast" && <BroadcastControl />}
      </main>
    </div>
  );
}

import { useState } from "react";
import { CommandHeader } from "./_components/CommandHeader.tsx";
import { PerformanceHeader } from "./_components/PerformanceHeader.tsx";
import { SpatialAnalytics } from "./_components/SpatialAnalytics.tsx";
import { AuditLog } from "./_components/AuditLog.tsx";
import { BroadcastControl } from "./_components/BroadcastControl.tsx";

export default function Index() {
  const [activeTab, setActiveTab] = useState<"overview" | "audit" | "broadcast">("overview");

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <CommandHeader activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-auto p-4 space-y-4">
        {activeTab === "overview" && (
          <>
            <PerformanceHeader />
            <SpatialAnalytics />
          </>
        )}
        {activeTab === "audit" && <AuditLog />}
        {activeTab === "broadcast" && <BroadcastControl />}
      </main>
    </div>
  );
}
import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DefaultProviders } from "./components/providers/default.tsx";
import AuthCallback from "./pages/auth/Callback.tsx";
import EcoLedger from "./pages/eco-ledger/page.tsx";
import AdminIndex from "./pages/admin/page.tsx";
import NotFound from "./pages/NotFound.tsx";

// ✅ NEW IMPORT
import Landing from "./pages/Landing.tsx";

export default function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <DefaultProviders>
      <BrowserRouter>
        <Routes>
          {/* ✅ NEW LANDING PAGE (SAFE ROUTE) */}
          <Route path="/home" element={<Landing />} />

          {/* EXISTING ROUTES (UNCHANGED) */}
          <Route path="/" element={<EcoLedger />} />
          <Route path="/admin" element={<AdminIndex />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </DefaultProviders>
  );
}
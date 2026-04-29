import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DefaultProviders } from "./components/providers/default.tsx";
import AuthCallback from "./pages/auth/Callback.tsx";
import EcoLedger from "./pages/eco-ledger/page.tsx";
import AdminIndex from "./pages/admin/page.tsx";
import NotFound from "./pages/NotFound.tsx";

export default function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <DefaultProviders>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<EcoLedger />} />
          <Route path="/admin" element={<AdminIndex />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </DefaultProviders>
  );
}

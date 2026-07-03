import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { IndicatorDetail } from "./pages/IndicatorDetail";

export default function App() {
  return (
    <BrowserRouter>
      <main style={{ fontFamily: "sans-serif", padding: "2rem", maxWidth: 960, margin: "0 auto" }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/indicadores/:code" element={<IndicatorDetail />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

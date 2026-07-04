import { BrowserRouter, Routes, Route } from "react-router-dom";
import styled from "styled-components";
import { Dashboard } from "./pages/Dashboard";
import { IndicatorDetail } from "./pages/IndicatorDetail";
import { Header } from "./components/Header";

const Main = styled.main`
  font-family: sans-serif;
  padding: 16px;
  max-width: 960px;
  margin: 0px auto;
`;

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/indicadores/:code" element={<IndicatorDetail />} />
        </Routes>
      </Main>
    </BrowserRouter>
  );
}

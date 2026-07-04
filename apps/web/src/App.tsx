import { BrowserRouter, Routes, Route } from "react-router-dom";
import styled from "styled-components";
import { Dashboard } from "./pages/Dashboard";
import { IndicatorDetail } from "./pages/IndicatorDetail";
import { Header } from "./components/Header";
import { Container } from "./assets/components";

const Main = styled.main`
  font-family: sans-serif;
  padding-top: 32px;
  padding-bottom: 32px;
  color: #ffffff;
  background-color: #2d2d3f;
`;

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Main>
        <Container>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/indicadores/:code" element={<IndicatorDetail />} />
          </Routes>
        </Container>
      </Main>
    </BrowserRouter>
  );
}

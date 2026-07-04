import { BrowserRouter, Routes, Route } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import { theme } from "./styles/theme";
import { Dashboard } from "./pages/Dashboard";
import { IndicatorDetail } from "./pages/IndicatorDetail";
import { Favorites } from "./pages/Favorites";
import { Header } from "./components/Header";
import { Container } from "./assets/components";

const Main = styled.main`
  font-family: sans-serif;
  padding-top: 32px;
  padding-bottom: 32px;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.background};
`;

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Header />
        <Main>
          <Container>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/indicadores/:code" element={<IndicatorDetail />} />
              <Route path="/favoritos" element={<Favorites />} />
            </Routes>
          </Container>
        </Main>
      </BrowserRouter>
    </ThemeProvider>
  );
}

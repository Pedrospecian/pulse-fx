import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { Container } from "../assets/components";

const HeaderComponent = styled.header`
  font-family: sans-serif;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.headerBackground};
  padding: 16px 0;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
`;

const Brand = styled.span`
  font-size: 32px;
  font-weight: 700;
`;

const Nav = styled.nav`
  display: flex;
  gap: 20px;
`;

const NavItem = styled(NavLink)`
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  font-size: 16px;
  opacity: 0.7;

  &.active {
    opacity: 1;
    font-weight: 700;
  }

  &:hover {
    opacity: 1;
  }
`;

export function Header() {
  return (
    <HeaderComponent>
      <Container>
        <HeaderRow>
          <Brand>Pulse FX</Brand>
          <Nav>
            <NavItem to="/" end>
              Início
            </NavItem>
            <NavItem to="/favoritos">Meus Indicadores</NavItem>
          </Nav>
        </HeaderRow>
      </Container>
    </HeaderComponent>
  );
}

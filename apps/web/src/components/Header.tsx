import styled from "styled-components";
import { Container } from "../assets/components";

const HeaderComponent = styled.header`
  font-family: sans-serif;
  font-size: 32px;
  color: #ffffff;
  background-color: #435472;
  font-weight: 700;
  padding: 16px;
`;

export function Header() {
  return (
    <HeaderComponent>
      <Container>
        Pulse FX
      </Container>
    </HeaderComponent>
  );
}

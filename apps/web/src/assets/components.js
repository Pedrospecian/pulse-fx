import styled from "styled-components";
import { Link } from "react-router-dom";

export const Text = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
`;

export const Container = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding-left: 16px;
  padding-right: 16px;
  max-width: 1152px;
  margin-left: auto;
  margin-right: auto;
`;

export const PageTitle = styled.h1`
	width: 100%;
	border-bottom: solid 3px ${({ theme }) => theme.colors.border};
	padding-bottom: 6px;
	margin-bottom: 32px;
	margin-top: 0px;
`;

export const BackButton = styled(Link)`
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  border-radius: 6px;
  padding: 9px;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.colors.buttonBackground};
  width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

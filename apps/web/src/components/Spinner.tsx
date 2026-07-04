import styled, { keyframes } from "styled-components";

interface SpinnerProps {
  size?: number;
  color?: string;
  label?: string;
}

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const CircleWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Circle = styled.span<{ $size: number; $color: string }>`
  display: inline-block;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border: ${({ $size }) => Math.max(2, $size / 8)}px solid rgba(0, 0, 0, 0.1);
  border-top-color: ${({ $color }) => $color};
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`;

const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

export function Spinner({ size = 24, color = "#999999", label = "Carregando..." }: SpinnerProps) {
  return (
    <CircleWrapper>
      <Circle role="status" $size={size} $color={color} data-testid="spinner">
        <VisuallyHidden>{label}</VisuallyHidden>
      </Circle>
    </CircleWrapper>
  );
}

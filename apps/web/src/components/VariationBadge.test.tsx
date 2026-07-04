import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ThemeProvider } from "styled-components";
import type { ReactElement } from "react";
import { theme } from "../styles/theme";
import { VariationBadge } from "./VariationBadge";

function renderWithTheme(ui: ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

describe("VariationBadge", () => {
  it("mostra sinal de + e cor verde para variação positiva", () => {
    renderWithTheme(<VariationBadge variationPercent={2.5} />);
    const badge = screen.getByTestId("variation-badge");
    expect(badge).toHaveTextContent("+2.50%");
  });

  it("mostra variação negativa e sinal de -", () => {
    renderWithTheme(<VariationBadge variationPercent={-3.14} />);
    expect(screen.getByTestId("variation-badge")).toHaveTextContent("-3.14%");
  });

  it("mostra mensagem de dado insuficiente quando variação é null", () => {
    renderWithTheme(<VariationBadge variationPercent={null} />);
    expect(screen.getByTestId("variation-badge")).toHaveTextContent("sem dado suficiente");
  });
});

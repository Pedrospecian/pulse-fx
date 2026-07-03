import { Link } from "react-router-dom";
import type { IndicatorSummary } from "../lib/api";

interface Props {
  indicator: IndicatorSummary;
  isFavorite: boolean;
  onToggleFavorite: (code: string) => void;
}

export function IndicatorCard({ indicator, isFavorite, onToggleFavorite }: Props) {
  return (
    <div style={{ border: "1px solid #d0d7de", borderRadius: 8, padding: 16, minWidth: 220 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
        <Link to={`/indicadores/${indicator.code}`} style={{ fontWeight: 600, textDecoration: "none" }}>
          {indicator.name}
        </Link>
      </div>

      <p style={{ fontSize: 22, margin: "8px 0 4px" }}>
        {indicator.lastValue?.toLocaleString("pt-BR", { maximumFractionDigits: 4 }) ?? "—"}{" "}
        <small>{indicator.unit}</small>
      </p>
    </div>
  );
}

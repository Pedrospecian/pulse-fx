import { Link } from "react-router-dom";
import type { IndicatorSummary } from "../lib/api";
import { VariationBadge } from "./VariationBadge";

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
        <button
          onClick={() => onToggleFavorite(indicator.code)}
          aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          style={{ border: "none", background: "none", cursor: "pointer", fontSize: 18 }}
        >
          {isFavorite ? "★" : "☆"}
        </button>
      </div>

      <p style={{ fontSize: 22, margin: "8px 0 4px" }}>
        {indicator.lastValue?.toLocaleString("pt-BR", { maximumFractionDigits: 4 }) ?? "—"}{" "}
        <small>{indicator.unit}</small>
      </p>

      <VariationBadge variationPercent={indicator.variationPercent} />

      <p style={{ fontSize: 12, color: "#444444", marginTop: 8 }}>
        Ref.:{" "}
        {indicator.lastReferenceDate
          ? new Date(indicator.lastReferenceDate).toLocaleDateString("pt-BR")
          : "—"}
      </p>
    </div>
  );
}

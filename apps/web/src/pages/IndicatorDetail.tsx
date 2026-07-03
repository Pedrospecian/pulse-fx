import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, type IndicatorDetail as IndicatorDetailType } from "../lib/api";
import { VariationBadge } from "../components/VariationBadge";

export function IndicatorDetail() {
  const { code } = useParams<{ code: string }>();
  const [data, setData] = useState<IndicatorDetailType | null>(null);

  useEffect(() => {
    api
      .getIndicatorDetail(code)
      .then(setData);
  }, [code]);

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.description}</p>

      <VariationBadge variationPercent={data.variationPercent} />

      <table style={{ marginTop: 24, borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", borderBottom: "1px solid #d0d7de" }}>Data</th>
            <th style={{ textAlign: "right", borderBottom: "1px solid #d0d7de" }}>Valor</th>
          </tr>
        </thead>
        <tbody>
          {[...data.history].reverse().map((point) => (
            <tr key={point.referenceDate}>
              <td>{new Date(point.referenceDate).toLocaleDateString("pt-BR")}</td>
              <td style={{ textAlign: "right" }}>{point.value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ fontSize: 12, color: "#444444", marginTop: 16 }}>{data.limitations}</p>
    </div>
  );
}

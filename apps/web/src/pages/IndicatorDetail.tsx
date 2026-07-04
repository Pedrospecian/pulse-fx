import styled from "styled-components";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, type IndicatorDetail as IndicatorDetailType } from "../lib/api";
import { VariationBadge } from "../components/VariationBadge";
import { FaArrowLeft } from "react-icons/fa";

const IndicatorTable = styled.table`
  margin-top: 24px;
  border-collapse: collapse;
  width: 100%;
`;

const LimitationsText = styled.p`
  font-size: 12px;
  color: #999999;
  margin-top: 16px;
`;

const BackButton = styled(Link)`
  color: #ffffff;
  text-decoration: none;
  border-radius: 6px;
  padding: 9px;
  box-sizing: border-box;
  background-color: #444444;
  width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export function IndicatorDetail() {
  const { code } = useParams<{ code: string }>();
  const [data, setData] = useState<IndicatorDetailType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!code) return;
    setLoading(true);
    api
      .getIndicatorDetail(code)
      .then(setData)
      .finally(() => setLoading(false));
  }, [code]);

  if (loading) return <p>Carregando...</p>;
  if (!data) return <p>Indicador não encontrado.</p>;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.description}</p>

      <p style={{ fontSize: 28 }}>
        {data.lastValue?.toLocaleString("pt-BR", { maximumFractionDigits: 4 })} <small>{data.unit}</small>
      </p>
      <VariationBadge variationPercent={data.variationPercent} />

      <IndicatorTable>
        <thead>
          <tr>
            <th style={{ textAlign: "left", borderBottom: "1px solid #cccccc" }}>Data</th>
            <th style={{ textAlign: "right", borderBottom: "1px solid #cccccc" }}>Valor</th>
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
      </IndicatorTable>

      <LimitationsText>
        {data.limitations}
      </LimitationsText>
      <BackButton to="/">
        <FaArrowLeft size={16} style={{ marginRight: '6px' }} />
        Voltar
      </BackButton>
    </div>
  );
}

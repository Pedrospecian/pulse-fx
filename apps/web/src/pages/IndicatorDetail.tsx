import styled from "styled-components";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, type IndicatorDetail as IndicatorDetailType } from "../lib/api";
import { VariationBadge } from "../components/VariationBadge";
import { Spinner } from "../components/Spinner";
import { FaArrowLeft } from "react-icons/fa";
import { PageTitle, BackButton } from "../assets/components";

const IndicatorTable = styled.table`
  margin-top: 24px;
  border-collapse: collapse;
  width: 100%;
`;

const LimitationsText = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 16px;
`;

const StyledRow = styled.tr`
  background-color: transparent;

  &:nth-child(2n) {
    background-color: ${({ theme }) => theme.colors.rowStripe};
  }

  td {
    padding-top: 6px;
    padding-bottom: 6px;
  }
`;

const IndicatorValue = styled.p`
  font-size: 24px;
  display: flex;
  align-items: center;
`;

const Th = styled.th<{ $align: "left" | "right" }>`
  text-align: ${({ $align }) => $align};
  border-bottom: 1px solid ${({ theme }) => theme.colors.tableBorder};
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

  if (loading) {
    return <Spinner />;
  }
  if (!data) {
    return (<div>
      <p>Indicador não encontrado.</p>

      <BackButton to="/">
        <FaArrowLeft size={16} style={{ marginRight: '6px' }} />
        Voltar
      </BackButton>
    </div>);
  }

  return (
    <div>
      <PageTitle>{data.name}</PageTitle>
      <p>{data.description}</p>

      <IndicatorValue>
        Último valor: {data.lastValue?.toLocaleString("pt-BR", { maximumFractionDigits: 4 })} <small>{data.unit}</small>
        <VariationBadge variationPercent={data.variationPercent} />
      </IndicatorValue>

      <IndicatorTable>
        <thead>
          <tr>
            <Th $align="left">Data</Th>
            <Th $align="right">Valor</Th>
          </tr>
        </thead>
        <tbody>
          {[...data.history].reverse().map((point) => (
            <StyledRow key={point.referenceDate}>
              <td>{new Date(point.referenceDate).toLocaleDateString("pt-BR")}</td>
              <td style={{ textAlign: "right" }}>{point.value}</td>
            </StyledRow>
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

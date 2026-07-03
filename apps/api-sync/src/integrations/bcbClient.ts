export interface RawPoint {
  date: Date;
  value: number;
}

function formatDateForPtax(date: Date): string {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${mm}-${dd}-${yyyy}`;
}

function formatDateForSgs(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export async function fetchPtax(startDate: Date, endDate: Date): Promise<RawPoint[]> {
  const url =
    `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarPeriodo(` +
    `dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)` +
    `?@dataInicial='${formatDateForPtax(startDate)}'&@dataFinalCotacao='${formatDateForPtax(endDate)}'` +
    `&$format=json&$select=cotacaoVenda,dataHoraCotacao`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`BCB PTAX respondeu ${res.status}`);
  }

  const body = (await res.json()) as { value: Array<{ cotacaoVenda: number; dataHoraCotacao: string }> };

  // A PTAX publica múltiplos boletins por dia. O sistema pega o último de cada data.
  const byDate = new Map<string, RawPoint>();
  for (const item of body.value) {
    const date = new Date(item.dataHoraCotacao);
    const key = date.toISOString().slice(0, 10);
    byDate.set(key, { date: new Date(key), value: item.cotacaoVenda });
  }

  return Array.from(byDate.values());
}

export async function fetchSgsSeries(seriesCode: string, startDate: Date, endDate: Date): Promise<RawPoint[]> {
  const url =
    `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${seriesCode}/dados` +
    `?formato=json&dataInicial=${formatDateForSgs(startDate)}&dataFinal=${formatDateForSgs(endDate)}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`BCB SGS (${seriesCode}) respondeu ${res.status}`);
  }

  const body = (await res.json()) as Array<{ data: string; valor: string }>;

  return body.map((item) => {
    const [dd, mm, yyyy] = item.data.split("/");
    return { date: new Date(`${yyyy}-${mm}-${dd}`), value: Number(item.valor) };
  });
}

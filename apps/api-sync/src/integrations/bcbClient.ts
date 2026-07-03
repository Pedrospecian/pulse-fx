export interface RawPoint {
  date: Date;
  value: number;
}

export async function fetchPtax(startDate: Date, endDate: Date): Promise<RawPoint[]> {
  const url =
    `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarPeriodo(` +
    `dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)` +
    `?@dataInicial='${startDate}'&@dataFinalCotacao='${endDate}'` +
    `&$format=json&$select=cotacaoVenda,dataHoraCotacao`;

  const res = await fetch(url);

  const body = (await res.json()) as { value: Array<{ cotacaoVenda: number; dataHoraCotacao: string }> };

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
    `?formato=json&dataInicial=${startDate}&dataFinal=${endDate}`;

  const res = await fetch(url);

  const body = (await res.json()) as Array<{ data: string; valor: string }>;

  return body.map((item) => {
    const [dd, mm, yyyy] = item.data.split("/");
    return { date: new Date(`${dd}/${mm}/${yyyy}`), value: Number(item.valor) };
  });
}

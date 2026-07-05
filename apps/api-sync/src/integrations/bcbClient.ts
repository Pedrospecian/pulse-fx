export interface RawPoint {
  date: Date;
  value: number;
}

/**
 * 502/503/504 costumam ser falhas transitórias do lado do provedor (comum em
 * APIs de governo, especialmente a PTAX via Olinda/OData, que na prática é
 * mais instável que a do SGS). Vale tentar de novo antes de desistir.
 */
async function fetchJsonWithRetry(url: string, sourceLabel: string, retries = 2): Promise<unknown> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
    });

    if (res.ok) return res.json();

    const isTransient = [502, 503, 504].includes(res.status);
    if (!isTransient || attempt === retries) {
      throw new Error(`${sourceLabel} respondeu ${res.status}`);
    }

    const backoffMs = 1000 * (attempt + 1);
    console.warn(`[bcbClient] ${sourceLabel} respondeu ${res.status}, tentando de novo em ${backoffMs}ms (tentativa ${attempt + 1}/${retries})...`);
    await new Promise((resolve) => setTimeout(resolve, backoffMs));
  }

  // Inalcançável — o loop sempre retorna ou lança antes de chegar aqui.
  throw new Error(`${sourceLabel}: falha inesperada no fetch`);
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

  const body = (await fetchJsonWithRetry(url, "BCB PTAX")) as {
    value: Array<{ cotacaoVenda: number; dataHoraCotacao: string }>;
  };

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

  const body = (await fetchJsonWithRetry(url, `BCB SGS (${seriesCode})`)) as Array<{
    data: string;
    valor: string;
  }>;

  return body.map((item) => {
    const [dd, mm, yyyy] = item.data.split("/");
    return { date: new Date(`${yyyy}-${mm}-${dd}`), value: Number(item.valor) };
  });
}

export const theme = {
  colors: {
    // Fundo geral e superfícies (tema escuro)
    background: "#2d2d34",
    headerBackground: "#434452",
    cardHeaderOverlay: "#15151544", // overlay escuro no header do card
    rowStripe: "#55555588", // zebra da tabela de histórico
    buttonBackground: "#555555", // BackButton

    // Texto
    text: "#ffffff",
    textMuted: "#999999",
    border: "#999999", // linha embaixo do PageTitle
    tableBorder: "#cccccc",

    // Ações / destaque
    accent: "#ffbb00", // estrela de favorito

    // Semânticas de variação (badge e overlay do card)
    positive: "#55b542",
    negative: "#ff6552",
    neutral: "#5d5d5d",
    positiveSurface: "#6d8d5d88",
    negativeSurface: "#8d4d4d88",
    neutralSurface: "#5d5d5d88",
    onBadge: "#ffffff",
  },
} as const;

export type AppTheme = typeof theme;

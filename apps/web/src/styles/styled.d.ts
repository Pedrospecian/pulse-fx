import "styled-components";
import type { AppTheme } from "./theme";

// Faz `theme` em qualquer `styled.xxx` e no hook `useTheme()` vir tipado
// com as chaves definidas em theme.ts, com autocomplete incluso.
declare module "styled-components" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends AppTheme {}
}

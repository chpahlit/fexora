import de from "../locales/de/common.json";
import en from "../locales/en/common.json";

export const locales = { de, en } as const;

export type Locale = keyof typeof locales;

export function getMessages(locale: Locale) {
  return locales[locale];
}

import type { I18nLocale, Localizations } from "~/types/locale";

export const COUNTRIES: Localizations = {
  default: {
    label: "United States (USD $)",
    language: "EN",
    country: "US",
    currency: "USD",
  },
  "/en-ad": {
    label: "Andorra (EUR €)",
    language: "EN",
    country: "AD",
    currency: "EUR",
  },
  "/en-at": {
    label: "Austria (EUR €)",
    language: "EN",
    country: "AT",
    currency: "EUR",
  },
  "/en-au": {
    label: "Australia (AUD $)",
    language: "EN",
    country: "AU",
    currency: "AUD",
  },
  "/en-be": {
    label: "Belgium (EUR €)",
    language: "EN",
    country: "BE",
    currency: "EUR",
  },
  "/en-ca": {
    label: "Canada (CAD $)",
    language: "EN",
    country: "CA",
    currency: "CAD",
  },
  "/en-cn": {
    label: "China (CNY ¥)",
    language: "EN",
    country: "CN",
    currency: "CNY",
  },
  "/en-cy": {
    label: "Cyprus (EUR €)",
    language: "EN",
    country: "CY",
    currency: "EUR",
  },
  "/en-de": {
    label: "Germany (EUR €)",
    language: "EN",
    country: "DE",
    currency: "EUR",
  },
  "/en-ee": {
    label: "Estonia (EUR €)",
    language: "EN",
    country: "EE",
    currency: "EUR",
  },
  "/en-es": {
    label: "Spain (EUR €)",
    language: "EN",
    country: "ES",
    currency: "EUR",
  },
  "/en-fi": {
    label: "Finland (EUR €)",
    language: "EN",
    country: "FI",
    currency: "EUR",
  },
  "/en-fr": {
    label: "France (EUR €)",
    language: "EN",
    country: "FR",
    currency: "EUR",
  },
  "/en-gb": {
    label: "United Kingdom (GBP £)",
    language: "EN",
    country: "GB",
    currency: "GBP",
  },
  "/en-gr": {
    label: "Greece (EUR €)",
    language: "EN",
    country: "GR",
    currency: "EUR",
  },
  "/en-id": {
    label: "Indonesia (IDR Rp)",
    language: "EN",
    country: "ID",
    currency: "IDR",
  },
  "/en-ie": {
    label: "Ireland (EUR €)",
    language: "EN",
    country: "IE",
    currency: "EUR",
  },
  "/en-in": {
    label: "India (INR ₹)",
    language: "EN",
    country: "IN",
    currency: "INR",
  },
  "/en-it": {
    label: "Italy (EUR €)",
    language: "EN",
    country: "IT",
    currency: "EUR",
  },
  "/en-jp": {
    label: "Japan (JPY ¥)",
    language: "EN",
    country: "JP",
    currency: "JPY",
  },
  "/en-kr": {
    label: "South Korea (KRW ₩)",
    language: "EN",
    country: "KR",
    currency: "KRW",
  },
  "/en-lt": {
    label: "Lithuania (EUR €)",
    language: "EN",
    country: "LT",
    currency: "EUR",
  },
  "/en-lu": {
    label: "Luxembourg (EUR €)",
    language: "EN",
    country: "LU",
    currency: "EUR",
  },
  "/en-lv": {
    label: "Latvia (EUR €)",
    language: "EN",
    country: "LV",
    currency: "EUR",
  },
  "/en-mc": {
    label: "Monaco (EUR €)",
    language: "EN",
    country: "MC",
    currency: "EUR",
  },
  "/en-me": {
    label: "Montenegro (EUR €)",
    language: "EN",
    country: "ME",
    currency: "EUR",
  },
  "/en-mt": {
    label: "Malta (EUR €)",
    language: "EN",
    country: "MT",
    currency: "EUR",
  },
  "/en-nl": {
    label: "Netherlands (EUR €)",
    language: "EN",
    country: "NL",
    currency: "EUR",
  },
  "/en-nz": {
    label: "New Zealand (NZD $)",
    language: "EN",
    country: "NZ",
    currency: "NZD",
  },
  "/en-pt": {
    label: "Portugal (EUR €)",
    language: "EN",
    country: "PT",
    currency: "EUR",
  },
  "/en-sg": {
    label: "Singapore (SGD $)",
    language: "EN",
    country: "SG",
    currency: "SGD",
  },
  "/en-si": {
    label: "Slovenia (EUR €)",
    language: "EN",
    country: "SI",
    currency: "EUR",
  },
  "/en-sk": {
    label: "Slovakia (EUR €)",
    language: "EN",
    country: "SK",
    currency: "EUR",
  },
  "/en-sm": {
    label: "San Marino (EUR €)",
    language: "EN",
    country: "SM",
    currency: "EUR",
  },
  "/en-th": {
    label: "Thailand (THB ฿)",
    language: "EN",
    country: "TH",
    currency: "THB",
  },
  "/en-va": {
    label: "Vatican City (EUR €)",
    language: "EN",
    country: "VA",
    currency: "EUR",
  },
  "/en-vn": {
    label: "Vietnam (VND ₫)",
    language: "EN",
    country: "VN",
    currency: "VND",
  },
  "/en-xk": {
    label: "Kosovo (EUR €)",
    language: "EN",
    country: "XK",
    currency: "EUR",
  },
};

export const PAGINATION_SIZE = 16;

export const DEFAULT_LOCALE: I18nLocale = Object.freeze({
  ...COUNTRIES.default,
  pathPrefix: "",
});
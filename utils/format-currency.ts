export function formatCurrency(amount: number, currency: "ZAR" | "USD" | "EUR" = "ZAR", locale = "en-ZA"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function parseCurrency(value: string): number {
  return Number.parseFloat(value.replace(/[^\d.-]/g, "")) || 0
}

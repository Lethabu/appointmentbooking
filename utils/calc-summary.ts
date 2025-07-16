import type { Service } from "@/types"

export interface BookingSummary {
  totalPrice: number
  totalDuration: number
  serviceCount: number
  formattedPrice: string
  formattedDuration: string
}

export function calcSummary(services: Service[], currency: "ZAR" | "USD" | "EUR" = "ZAR"): BookingSummary {
  const totalPrice = services.reduce((sum, service) => sum + service.price, 0)
  const totalDuration = services.reduce((sum, service) => sum + service.duration_minutes, 0)

  const hours = Math.floor(totalDuration / 60)
  const minutes = totalDuration % 60

  return {
    totalPrice,
    totalDuration,
    serviceCount: services.length,
    formattedPrice: new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(totalPrice),
    formattedDuration: hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`,
  }
}

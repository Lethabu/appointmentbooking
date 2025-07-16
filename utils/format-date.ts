export function formatDate(date: string | Date, locale = "en-ZA", options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === "string" ? new Date(date) : date

  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }

  return new Intl.DateTimeFormat(locale, options || defaultOptions).format(dateObj)
}

export function formatTime(time: string | Date, locale = "en-ZA"): string {
  const timeObj = typeof time === "string" ? new Date(`2000-01-01T${time}`) : time

  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(timeObj)
}

export function formatDateTime(datetime: string | Date, locale = "en-ZA"): string {
  const dateObj = typeof datetime === "string" ? new Date(datetime) : datetime

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(dateObj)
}

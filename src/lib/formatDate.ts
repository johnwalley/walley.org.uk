export function formatDate(dateString: string) {
  return new Date(`${dateString}T00:00:00Z`).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

// Expands a YYYY-MM-DD date to a full ISO 8601 datetime at midnight UTC, as
// Google's structured data validator expects (matches formatDate above).
export function toIsoDateTime(dateString: string) {
  return `${dateString}T00:00:00+00:00`
}

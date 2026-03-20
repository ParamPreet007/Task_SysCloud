export function formatRelativeMinutes(epochMs, nowMs = Date.now()) {
  const deltaMs = Math.max(0, nowMs - epochMs)
  const minutes = Math.floor(deltaMs / 60_000)
  if (minutes <= 1) return '1 minute ago'
  if (minutes < 60) return `${minutes} minutes ago`
  const hours = Math.floor(minutes / 60)
  if (hours === 1) return '1 hour ago'
  if (hours < 24) return `${hours} hours ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return '1 day ago'
  return `${days} days ago`
}


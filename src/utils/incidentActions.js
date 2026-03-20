
export function applyActionToStatus(current, actionId) {
  switch (actionId) {
    case 'acknowledge':
      return current === 'Open' ? 'Acknowledged' : current
    case 'resolve':
      return current === 'Open' || current === 'Acknowledged' ? 'Resolved' : current
    case 'reopen':
      return current === 'Resolved' ? 'Open' : current
    default:
      return current
  }
}


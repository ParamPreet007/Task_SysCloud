

import { Chip } from '@mui/material'

function bg(border, text) {
  return {
    bgcolor: border,
    color: text,
    border: `1px solid ${border}`,
    fontWeight: 600,
  }
}

export function ServiceStatusChip(props) {
  const map = {
    Healthy: bg('rgba(46, 204, 113, 0.25)', '#1f7a3f'),
    Degraded: bg('rgba(241, 196, 15, 0.25)', '#7a5b00'),
    Down: bg('rgba(231, 76, 60, 0.25)', '#8f1f14'),
  }

  return (
    <Chip
      size="small"
      label={props.status}
      sx={map[props.status]}
      data-testid={`svc-status-${props.status}`}
    />
  )
}

export function SeverityBadge(props) {
  const map = {
    Critical: bg('rgba(231, 76, 60, 0.25)', '#8f1f14'),
    High: bg('rgba(245, 158, 11, 0.25)', '#7a3f00'),
    Medium: bg('rgba(52, 152, 219, 0.20)', '#0b4c73'),
    Low: bg('rgba(39, 174, 96, 0.18)', '#1f6c3d'),
  }

  return (
    <Chip
      size="small"
      label={props.severity}
      sx={map[props.severity]}
      data-testid={`sev-${props.severity}`}
    />
  )
}

export function IncidentStatusChip(props) {
  const map = {
    Open: bg('rgba(231, 76, 60, 0.22)', '#8f1f14'),
    Acknowledged: bg('rgba(245, 158, 11, 0.22)', '#7a3f00'),
    Resolved: bg('rgba(46, 204, 113, 0.18)', '#1f7a3f'),
  }

  return (
    <Chip
      size="small"
      label={props.status}
      sx={map[props.status]}
      data-testid={`inc-status-${props.status}`}
    />
  )
}


import {
  Box,
  Button,
  Chip,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { SeverityBadge, IncidentStatusChip } from '../common/StatusIndicators'
import { formatRelativeMinutes } from '../../utils/format'

export function IncidentTable(props) {
  const renderCell = (col, incident) => {
    if (col.type === 'text') {
      return (
        <Typography variant="body2" data-testid={`cell-${col.id}-${incident.id}`}>
          {String(incident[col.field || ''])}
        </Typography>
      )
    }

    if (col.type === 'link') {
      return (
        <Button
          variant="text"
          onClick={() => props.onOpenIncident(incident.id)}
          data-testid={`incident-title-${incident.id}`}
          sx={{ textAlign: 'left', padding: 0, textTransform: 'none' }}
        >
          {incident.title}
        </Button>
      )
    }

    if (col.type === 'badge') {
      return <SeverityBadge severity={incident.severity} />
    }

    if (col.type === 'chip') {
      if (col.chipKind === 'status') {
        return <IncidentStatusChip status={incident.status} />
      }

      if (col.chipKind === 'service') {
        return (
          <Chip
            size="small"
            label={incident.serviceName}
            variant="outlined"
            sx={{ fontWeight: 700, background: 'rgba(99, 102, 241, 0.06)' }}
            data-testid={`svc-chip-${incident.id}`}
          />
        )
      }
    }

    if (col.type === 'relativeTime') {
      return (
        <Typography
          variant="body2"
          color="text.secondary"
          data-testid={`cell-${col.id}-${incident.id}`}
        >
          {formatRelativeMinutes(incident.createdAt)}
        </Typography>
      )
    }

    if (col.type === 'actions') {
      const visibleActions = props.actions.filter(
        (a) =>
          a.roles.includes(props.role) &&
          a.allowedStatuses.includes(incident.status)
      )

      return (
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {visibleActions.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              —
            </Typography>
          ) : (
            visibleActions.map((a) => (
              <Button
                key={a.id}
                size="small"
                variant="contained"
                onClick={() => props.onAction(incident.id, a.id)}
                data-testid={`row-action-${a.id}-${incident.id}`}
              >
                {a.label}
              </Button>
            ))
          )}
        </Box>
      )
    }

    return null
  }

  const skeletonRows = Array.from({ length: props.pageSize }).map((_, i) => i)

  return (
    <TableContainer sx={{ border: 1, borderColor: 'divider', borderRadius: 2 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
          py: 1.5,
          background: 'linear-gradient(90deg, #f8fafc, #eef2ff)',
        }}

      >
         <Typography variant="subtitle1" fontWeight={700}>
          Incidents
        </Typography>
        {props.backgroundUpdating ? (
          <Typography variant="body2" color="text.secondary">
            Background updating…
          </Typography>
        ) : null}
      </Box>

      <Table size="small">
        <TableHead>
          <TableRow sx={{
    background: '#1976D2',
    
  }}
>
            {props.columns.map((c) => (
              <TableCell key={c.id}>
                <Typography sx={{ color: '#fff', fontWeight: 700 }}
 variant="subtitle2" fontWeight={800}>
                  {c.label}
                </Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {props.loadingInitial ? (
            skeletonRows.map((i) => (
              <TableRow key={i}>
                {props.columns.map((c) => (
                  <TableCell key={c.id}>
                    <Skeleton variant="text" width="80%" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : props.incidents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={props.columns.length}>
                <Box sx={{ p: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    No incidents found for the selected filters.
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            props.incidents.map((inc) => (
              <TableRow key={inc.id} hover>
                {props.columns.map((c) => (
                  <TableCell key={c.id}>
                    {renderCell(c, inc)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
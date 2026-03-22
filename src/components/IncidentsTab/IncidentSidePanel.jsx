import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Box,
  CircularProgress,
  Divider,
  Drawer,
  Stack,
  TextField,
  Typography,
  Chip,
  IconButton,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import BuildIcon from '@mui/icons-material/Build'
import PersonIcon from '@mui/icons-material/Person'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import NotesIcon from '@mui/icons-material/Notes'
import { mutateIncidentNotes } from '../../graphql/mockGraphqlClient'
import { SeverityBadge, IncidentStatusChip } from '../common/StatusIndicators'
import { formatRelativeMinutes } from '../../utils/format'
import { dashboardConfig } from '../../config/dashboardConfig'

export function IncidentSidePanel(props) {
  const incidentId = props.incident?.id ?? ''

  const [value, setValue] = useState('')
  const [lastSavedText, setLastSavedText] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const startedSavingTextRef = useRef('')
  const pendingSaveRef = useRef(false)
  const debounceTimerRef = useRef(null)
  const requestSeqRef = useRef(0)
  const valueRef = useRef(value)

  useEffect(() => {
    valueRef.current = value
  }, [value])

  const initialNotes = props.incident?.notes ?? ''

  useEffect(() => {
    setValue(initialNotes)
    setLastSavedText(initialNotes)
    setIsSaving(false)
    startedSavingTextRef.current = ''
    pendingSaveRef.current = false
  }, [incidentId, initialNotes])

  const displayState = useMemo(() => {
    if (value === lastSavedText) return { kind: 'saved' }
    if (isSaving) {
      const typedSinceSaveStarted = value !== startedSavingTextRef.current
      if (typedSinceSaveStarted) return { kind: 'unsaved' }
      return { kind: 'saving' }
    }
    return { kind: 'unsaved' }
  }, [isSaving, lastSavedText, value])

  const startSave = async (notesToSave) => {
    const seq = ++requestSeqRef.current
    setIsSaving(true)
    pendingSaveRef.current = false
    startedSavingTextRef.current = notesToSave

    try {
      if (!props.incident) return

      const updated = await mutateIncidentNotes({
        incidentId: props.incident.id,
        notes: notesToSave,
      })

      if (seq !== requestSeqRef.current) return

      props.onIncidentUpdated(updated)
      setLastSavedText(updated.notes)

      const latestValue = valueRef.current
      if (pendingSaveRef.current && latestValue !== updated.notes && props.open) {
        startSave(latestValue)
      }
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    if (!props.open || !props.incident) return

    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current)
    }

    if (value === lastSavedText) return

    debounceTimerRef.current = window.setTimeout(() => {
      if (value === lastSavedText) return

      if (isSaving) {
        pendingSaveRef.current = true
        return
      }

      startSave(value)
    }, 1500)

    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current)
      }
    }
  }, [props.open, props.incident, value, lastSavedText, isSaving])

  return (
    <Drawer
      anchor="right"
      open={props.open}
      onClose={props.onClose}
      PaperProps={{ sx: { width: 480, p: 0, borderRadius: '16px 0 0 16px' } }}
    >
      {props.incident ? (
        <Stack sx={{ height: '100%' }}>

          {/* Header */}
          <Box sx={{ p: 3, borderBottom: '1px solid #eee' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" fontWeight={700}>
                Incident Details
              </Typography>
              <IconButton onClick={props.onClose}>
                <CloseIcon />
              </IconButton>
            </Stack>

            <Typography variant="h5" fontWeight={800} sx={{ mt: 1 }}>
              {props.incident.title}
            </Typography>

            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <SeverityBadge severity={props.incident.severity} />
              <IncidentStatusChip status={props.incident.status} />
            </Stack>
          </Box>

          {/* Content */}
          <Stack spacing={3} sx={{ p: 3, flex: 1, overflowY: 'auto' }}>

            {/* Details Card */}
            <Box sx={{ p: 2, borderRadius: 3, boxShadow: 1 }}>
              <Typography fontWeight={700} sx={{ mb: 2 }}>
                {dashboardConfig.incidentsTab.sidePanel.detailsTitle}
              </Typography>

              <Stack spacing={2}>

                <Stack direction="row" spacing={2} alignItems="center">
                  <BuildIcon color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Service</Typography>
                    <Typography fontWeight={600}>{props.incident.serviceName}</Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center">
                  <PersonIcon color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Assignee</Typography>
                    <Typography fontWeight={600}>{props.incident.assignee}</Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center">
                  <AccessTimeIcon color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Created</Typography>
                    <Typography fontWeight={600}>{formatRelativeMinutes(props.incident.createdAt)}</Typography>
                  </Box>
                </Stack>

              </Stack>
            </Box>

            {/* Notes */}
            <Box sx={{ p: 2, borderRadius: 3, boxShadow: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <NotesIcon fontSize="small" />
                <Typography fontWeight={700}>
                  {dashboardConfig.incidentsTab.sidePanel.notesTitle}
                </Typography>
              </Stack>

              <TextField
                multiline
                minRows={6}
                fullWidth
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Write notes..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />

              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                {displayState.kind === 'saved' ? (
                  <Typography variant="caption" color="success.main">
                    ✓ All changes saved
                  </Typography>
                ) : displayState.kind === 'saving' ? (
                  <>
                    <CircularProgress size={14} />
                    <Typography variant="caption" color="text.secondary">
                      Saving...
                    </Typography>
                  </>
                ) : (
                  <Typography variant="caption" color="warning.main">
                    Unsaved changes
                  </Typography>
                )}
              </Stack>
            </Box>

          </Stack>
        </Stack>
      ) : (
        <Box sx={{ p: 3 }}>
          <Typography color="text.secondary">Select an incident</Typography>
        </Box>
      )}
    </Drawer>
  )
}

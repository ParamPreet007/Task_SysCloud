



import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Box,
  CircularProgress,
  Divider,
  Drawer,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
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
    }, 2000)

    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current)
      }
    }
  }, [props.open, props.incident, value, lastSavedText, isSaving])

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  return (
    <Drawer
      anchor="right"
      open={props.open}
      onClose={props.onClose}
      PaperProps={{ sx: { width: 460, p: 2 } }}
    >
      {props.incident ? (
        <Stack spacing={2}>
          <Box>
            <Typography variant="h6" fontWeight={800}>
              {props.incident.title}
            </Typography>

            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <SeverityBadge severity={props.incident.severity} />
              <IncidentStatusChip status={props.incident.status} />
            </Stack>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle1" fontWeight={800}>
              {dashboardConfig.incidentsTab.sidePanel.detailsTitle}
            </Typography>

            <Stack spacing={1} sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Service: {props.incident.serviceName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Assignee: {props.incident.assignee}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Created: {formatRelativeMinutes(props.incident.createdAt)}
              </Typography>
            </Stack>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1 }}>
              {dashboardConfig.incidentsTab.sidePanel.notesTitle}
            </Typography>

            <TextField
              multiline
              minRows={8}
              fullWidth
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Type notes... (auto-saves)"
              inputProps={{ 'aria-label': 'Incident notes' }}
            />

            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
              {displayState.kind === 'saved' ? (
                <Typography variant="body2" color="success.main" data-testid="notes-saved">
                  ✓ Saved
                </Typography>
              ) : displayState.kind === 'saving' ? (
                <>
                  <CircularProgress size={14} />
                  <Typography variant="body2" color="text.secondary" data-testid="notes-saving">
                    Saving...
                  </Typography>
                </>
              ) : (
                <Typography variant="body2" color="warning.main" data-testid="notes-unsaved">
                  Unsaved changes
                </Typography>
              )}
            </Stack>
          </Box>
        </Stack>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Select an incident.
        </Typography>
      )}
    </Drawer>
  )
}
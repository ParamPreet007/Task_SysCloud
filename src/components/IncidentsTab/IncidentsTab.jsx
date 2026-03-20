


import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Alert, Box, Snackbar, Stack, TablePagination } from '@mui/material'
import {
  getAllServiceNames,
  mutateIncidentAction,
  queryIncidents,
} from '../../graphql/mockGraphqlClient'
import { dashboardConfig } from '../../config/dashboardConfig'
import { IncidentFiltersPanel } from './IncidentFiltersPanel'
import { IncidentSidePanel } from './IncidentSidePanel'
import { IncidentTable } from './IncidentTable'
import { applyActionToStatus } from '../../utils/incidentActions'

const PAGE_SIZE = dashboardConfig.incidentsTab.pageSize

export function IncidentsTab(props) {
  const [servicesOptions, setServicesOptions] = useState([])

  const [incidents, setIncidents] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)

  const [filters, setFilters] = useState({
    severities: [],
    statuses: [],
    serviceName: null,
  })

  const [loadingInitial, setLoadingInitial] = useState(true)
  const [backgroundUpdating, setBackgroundUpdating] = useState(false)
  const [error, setError] = useState(null)

  const [selectedIncidentId, setSelectedIncidentId] = useState(null)

  const selectedIncident = useMemo(() => {
    return selectedIncidentId
      ? incidents.find((i) => i.id === selectedIncidentId) || null
      : null
  }, [incidents, selectedIncidentId])

  const [snack, setSnack] = useState({ open: false, message: '' })

  const querySeqRef = useRef(0)
  const selectedIncidentIdRef = useRef(null)

  useEffect(() => {
    selectedIncidentIdRef.current = selectedIncidentId
  }, [selectedIncidentId])

  const filtersKey = useMemo(() => {
    return JSON.stringify({
      severities: [...filters.severities].sort(),
      statuses: [...filters.statuses].sort(),
      serviceName: filters.serviceName,
    })
  }, [filters.severities, filters.statuses, filters.serviceName])

  useEffect(() => {
    setServicesOptions(getAllServiceNames())
  }, [])

  const resolvedFiltersConfig = useMemo(() => {
    return {
      severity: dashboardConfig.incidentsTab.filters.severity,
      status: dashboardConfig.incidentsTab.filters.status,
      service: {
        ...dashboardConfig.incidentsTab.filters.service,
        options: servicesOptions.map((s) => ({ value: s, label: s })),
      },
    }
  }, [servicesOptions])

  const resolvedActions = useMemo(() => dashboardConfig.incidentsTab.actions, [])

  const resolvedColumns = useMemo(() => dashboardConfig.incidentsTab.columns, [])

  const fetchIncidents = useCallback(
    async (opts) => {
      const background = Boolean(opts?.background)
      const seq = ++querySeqRef.current

      try {
        if (background) {
          setBackgroundUpdating(true)
        } else {
          setLoadingInitial(true)
        }

        setError(null)

        const res = await queryIncidents(
          {
            page,
            pageSize: PAGE_SIZE,
            filters,
          },
          { background }
        )

        if (seq !== querySeqRef.current) return

        setIncidents(res.items)
        setTotalCount(res.totalCount)

        const currentSelected = selectedIncidentIdRef.current
        if (currentSelected && !res.items.some((i) => i.id === currentSelected)) {
          setSelectedIncidentId(null)
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Failed to load incidents'

        if (background) {
          setSnack({ open: true, message: msg })
        } else {
          setError(msg)
        }
      } finally {
        if (background) setBackgroundUpdating(false)
        else setLoadingInitial(false)
      }
    },
    [filters, page]
  )

  useEffect(() => {
    fetchIncidents({ background: false })
  }, [fetchIncidents, filtersKey])

  useEffect(() => {
    props.onRegisterRefresh(() => {
      fetchIncidents({ background: false })
    })

    return () => props.onRegisterRefresh(null)
  }, [props, fetchIncidents])

  useEffect(() => {
    if (!props.autoRefreshEnabled) return

    const id = window.setInterval(() => {
      fetchIncidents({ background: true })
    }, 30000)

    return () => window.clearInterval(id)
  }, [props.autoRefreshEnabled, fetchIncidents])

  const onFilterChange = (next) => {
    setFilters(next)
    setPage(1)
  }

  const onAction = useCallback(
    async (incidentId, actionId) => {
      const actionConfig = resolvedActions.find((a) => a.id === actionId)
      const optimistic = incidents.find((i) => i.id === incidentId)

      if (!optimistic || !actionConfig) return

      const newStatus = applyActionToStatus(optimistic.status, actionId)

      setIncidents((prev) =>
        prev.map((i) => (i.id === incidentId ? { ...i, status: newStatus } : i))
      )

      setSnack({ open: true, message: `${actionConfig.label} applied` })

      try {
        const updated = await mutateIncidentAction({
          incidentId,
          actionId,
          role: props.role,
        })

        setIncidents((prev) =>
          prev.map((i) => (i.id === incidentId ? updated : i))
        )
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Action failed'
        setSnack({ open: true, message: msg })
      }
    },
    [incidents, props.role, resolvedActions]
  )

  const onIncidentUpdated = (updated) => {
    setIncidents((prev) =>
      prev.map((i) => (i.id === updated.id ? updated : i))
    )
  }

  return (
    <Box>
      {error ? (
        <Alert
          severity="error"
          action={
            <button onClick={() => fetchIncidents({ background: false })}>
              Retry
            </button>
          }
        >
          {error}
        </Alert>
      ) : (
        <Stack spacing={2}>
          <IncidentFiltersPanel
            filtersConfig={resolvedFiltersConfig}
            value={filters}
            onClearAll={() =>
              onFilterChange({ severities: [], statuses: [], serviceName: null })
            }
            onChange={onFilterChange}
          />

          <IncidentTable
            columns={resolvedColumns}
            incidents={incidents}
            role={props.role}
            pageSize={PAGE_SIZE}
            loadingInitial={loadingInitial}
            backgroundUpdating={backgroundUpdating}
            actions={resolvedActions}
            onOpenIncident={(id) => setSelectedIncidentId(id)}
            onAction={onAction}
          />

          <TablePagination
            component="div"
            count={totalCount}
            page={page - 1}
            rowsPerPage={PAGE_SIZE}
            rowsPerPageOptions={[PAGE_SIZE]}
            onPageChange={(_, newPageZeroBased) =>
              setPage(newPageZeroBased + 1)
            }
            nextIconButtonProps={{ disabled: page * PAGE_SIZE >= totalCount }}
            backIconButtonProps={{ disabled: page <= 1 }}
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} of ${count !== -1 ? count : totalCount}`
            }
          />
        </Stack>
      )}

      <IncidentSidePanel
        open={selectedIncidentId != null}
        incident={selectedIncident}
        onClose={() => setSelectedIncidentId(null)}
        onIncidentUpdated={onIncidentUpdated}
      />

      <Snackbar
        open={snack.open}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        autoHideDuration={3500}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info" variant="filled" sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}


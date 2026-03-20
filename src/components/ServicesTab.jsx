


import { useCallback, useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'
import { queryServicesOverview } from '../graphql/mockGraphqlClient'
import { ServiceStatusChip } from './common/StatusIndicators'
import { formatRelativeMinutes } from '../utils/format'

export function ServicesTab(props) {
  const [services, setServices] = useState([])
  const [loadingInitial, setLoadingInitial] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    try {
      if (!loadingInitial) setRefreshing(true)
      setError(null)

      const data = await queryServicesOverview()
      setServices(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load services')
    } finally {
      setLoadingInitial(false)
      setRefreshing(false)
    }
  }, [loadingInitial])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    props.onRegisterRefresh(() => {
      load()
    })

    return () => props.onRegisterRefresh(null)
  }, [props, load])

  return (
    <Box>
      {error ? (
        <Alert
          severity="error"
          action={<button onClick={() => load()}>Retry</button>}
        >
          {error}
        </Alert>
      ) : (
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            {refreshing ? <CircularProgress size={18} /> : null}
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              },
              gap: 2,
            }}
          >
            {loadingInitial
              ? Array.from({ length: 5 }).map((_, i) => (
                  <Box key={i}>
                    <Card>
                      <CardContent>
                        <Skeleton variant="text" width="55%" />
                        <Skeleton variant="rounded" height={28} sx={{ my: 1 }} />
                        <Skeleton variant="text" width="80%" />
                        <Skeleton variant="text" width="60%" />
                        <Skeleton variant="text" width="40%" />
                      </CardContent>
                    </Card>
                  </Box>
                ))
              : services.map((s) => (
                  <Box key={s.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          spacing={1}
                        >
                          <Typography variant="subtitle1" fontWeight={700}>
                            {s.serviceName}
                          </Typography>
                          <ServiceStatusChip status={s.status} />
                        </Stack>

                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Uptime Percentage
                          </Typography>
                          <Typography variant="h6">
                            {s.uptimePercentage.toFixed(2)}%
                          </Typography>
                        </Box>

                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Last Checked
                          </Typography>
                          <Typography variant="body1">
                            {formatRelativeMinutes(s.lastCheckedAt)}
                          </Typography>
                        </Box>

                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Open Incident Count
                          </Typography>
                          <Typography variant="body1">
                            {s.openIncidentCount}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
          </Box>
        </Stack>
      )}
    </Box>
  )
}
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
  Button,
  LinearProgress,
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
    props.onRegisterRefresh(() => load())
    return () => props.onRegisterRefresh(null)
  }, [props, load])

  return (
    <Box>
      {error ? (
        <Alert
          severity="error"
          action={
            <Button variant="outlined" size="small" onClick={load}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      ) : (
        <Stack spacing={2}>
          {/* Top right refresh indicator */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            {refreshing && <CircularProgress size={18} />}
          </Box>

          {/* Grid Layout */}
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
            {/* Loading Skeleton */}
            {loadingInitial
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent>
                      <Skeleton width="50%" />
                      <Skeleton height={30} sx={{ my: 1 }} />
                      <Skeleton width="80%" />
                      <Skeleton width="60%" />
                    </CardContent>
                  </Card>
                ))
              : services.map((s) => (
                  <Card
                    key={s.id}
                    variant="outlined"
                    sx={{
                      borderRadius: 3,
                      transition: '0.3s',
                      '&:hover': {
                        boxShadow: 4,
                        transform: 'translateY(-3px)',
                      },
                    }}
                  >
                    <CardContent>
                      <Stack spacing={1.5}>
                        {/* Header */}
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="subtitle1" fontWeight={700}>
                            {s.serviceName}
                          </Typography>
                          <ServiceStatusChip status={s.status} />
                        </Stack>

                        {/* Uptime */}
                        <Box>
  <Stack direction="row" justifyContent="space-between">
    <Typography variant="body2" color="text.secondary">
      Uptime
    </Typography>
    <Typography variant="body2" fontWeight={600}>
      {s.uptimePercentage.toFixed(2)}%
    </Typography>
  </Stack>

  <LinearProgress
    variant="determinate"
    value={s.uptimePercentage}
    sx={{
      mt: 0.5,
      height: 8,
      borderRadius: 5,
      backgroundColor: '#eee',
      '& .MuiLinearProgress-bar': {
        borderRadius: 5,
        background:
          s.uptimePercentage > 99
            ? 'linear-gradient(90deg, #4caf50, #81c784)'
            : s.uptimePercentage > 95
            ? 'linear-gradient(90deg, #ff9800, #ffb74d)'
            : 'linear-gradient(90deg, #f44336, #e57373)',
      },
    }}
  />
</Box>

                        {/* Last Checked */}
                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            Last Checked
                          </Typography>
                          <Typography variant="body1">
                            {formatRelativeMinutes(s.lastCheckedAt)}
                          </Typography>
                        </Box>

                        {/* Incidents */}
                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            Open Incidents
                          </Typography>
                          <Typography
                            variant="body1"
                            fontWeight={600}
                          >
                            {s.openIncidentCount}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
          </Box>
        </Stack>
      )}
    </Box>
  )
}
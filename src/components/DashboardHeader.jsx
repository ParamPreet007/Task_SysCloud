


import { Box, Button, FormControlLabel, Paper, Stack, Switch, Typography } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import { RoleSwitcher } from './RoleSwitcher'

export function DashboardHeader(props) {
  return (
    <Paper
      elevation={1}
      sx={{
        px: 2,
        py: 1.5,
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        justifyContent: 'space-between',
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Box>
          <Typography variant="h6" sx={{ lineHeight: 1.2 }}>
            {props.appTitle}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {props.activeTabLabel}
          </Typography>
        </Box>
      </Stack>

      <Stack direction="row" spacing={2} alignItems="center">
        <FormControlLabel
          control={
            <Switch
              checked={props.autoRefreshEnabled}
              onChange={(e) => props.onToggleAutoRefresh(e.target.checked)}
              inputProps={{ 'aria-label': 'Auto refresh toggle' }}
            />
          }
          label="Auto-refresh"
        />

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={props.onManualRefresh}
          data-testid="manual-refresh"
        >
          Refresh
        </Button>

        <RoleSwitcher />
      </Stack>
    </Paper>
  )
}
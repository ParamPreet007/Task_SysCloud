import {
  Box,
  Button,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  Typography,
  Divider,
} from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import { RoleSwitcher } from './RoleSwitcher'

export function DashboardHeader(props) {
  return (
    <Paper
      elevation={0}
  sx={{
    px: 3,
    py: 2,
    borderRadius: 3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: (theme) => theme.palette.primary.main,
    color: 'white',
    boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
  }}
    >
      {/* LEFT SECTION */}
      <Stack direction="row" spacing={2} alignItems="center">
        <Box>
          <Typography variant="h5" fontWeight={600} color="inherit">
  {props.appTitle}
</Typography>

<Typography variant="body2" sx={{ opacity: 0.8 }}>
  {props.activeTabLabel}
</Typography>
        </Box>
      </Stack>

      {/* RIGHT SECTION */}
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        divider={<Divider orientation="vertical" flexItem />}
      >
        <FormControlLabel
          control={
            <Switch
              checked={props.autoRefreshEnabled}
              onChange={(e) => props.onToggleAutoRefresh(e.target.checked)}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: 'primary.main',
                },
              }}
            />
          }
          label={
            <Typography variant="body2" fontWeight={500}>
              Auto-refresh
            </Typography>
          }
        />

        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={props.onManualRefresh}
          data-testid="manual-refresh"
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
            px: 2,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            },
          }}
        >
          Refresh
        </Button>

        <RoleSwitcher />
      </Stack>
    </Paper>
  )
}
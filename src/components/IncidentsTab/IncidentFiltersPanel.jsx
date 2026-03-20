


import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'

export function IncidentFiltersPanel(props) {
  const selectedSeverityOptions = props.filtersConfig.severity.options.filter((o) =>
    props.value.severities.includes(o.value)
  )

  const selectedStatusOptions = props.filtersConfig.status.options.filter((o) =>
    props.value.statuses.includes(o.value)
  )

  const selectedServiceOption =
    props.value.serviceName == null
      ? null
      : props.filtersConfig.service.options.find((o) => o.value === props.value.serviceName) ?? null

  return (
    <Stack spacing={2}>
      <Typography variant="subtitle1" fontWeight={700}>
        Filters
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 2 }}>
        
        <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 5' } }}>
          <Autocomplete
            multiple
            disableCloseOnSelect
            options={props.filtersConfig.severity.options}
            value={selectedSeverityOptions}
            getOptionLabel={(o) => o.label}
            onChange={(_, next) =>
              props.onChange({
                ...props.value,
                severities: next.map((x) => x.value),
              })
            }
            renderInput={(params) => (
              <TextField {...params} label="Severity" size="small" />
            )}
          />
        </Box>

        <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 5' } }}>
          <Autocomplete
            multiple
            disableCloseOnSelect
            options={props.filtersConfig.status.options}
            value={selectedStatusOptions}
            getOptionLabel={(o) => o.label}
            onChange={(_, next) =>
              props.onChange({
                ...props.value,
                statuses: next.map((x) => x.value),
              })
            }
            renderInput={(params) => (
              <TextField {...params} label="Status" size="small" />
            )}
          />
        </Box>

        <Box
          sx={{
            gridColumn: { xs: 'span 12', md: 'span 2' },
            display: 'flex',
            alignItems: 'flex-start',
          }}
        >
          <Button
            variant="text"
            onClick={props.onClearAll}
            sx={{ mt: 0.5 }}
            data-testid="clear-all-filters"
          >
            Clear All
          </Button>
        </Box>

        <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 12' } }}>
          <Autocomplete
            options={props.filtersConfig.service.options}
            value={selectedServiceOption}
            getOptionLabel={(o) => o.label}
            onChange={(_, next) =>
              props.onChange({
                ...props.value,
                serviceName: next?.value ?? null,
              })
            }
            renderInput={(params) => (
              <TextField {...params} label="Service" size="small" />
            )}
            clearOnEscape
            isOptionEqualToValue={(a, b) => a.value === b.value}
          />
        </Box>

      </Box>
    </Stack>
  )
}
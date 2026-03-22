import {
  Box,
  Button,
  Popover,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useState } from "react";

export function IncidentFiltersPanel(props) {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const selectedSeverityOptions = props.filtersConfig.severity.options.filter(
    (o) => props.value.severities.includes(o.value),
  );

  const selectedStatusOptions = props.filtersConfig.status.options.filter((o) =>
    props.value.statuses.includes(o.value),
  );

  const selectedServiceOption =
    props.value.serviceName == null
      ? null
      : (props.filtersConfig.service.options.find(
          (o) => o.value === props.value.serviceName,
        ) ?? null);

  return (
    <Stack spacing={1}>
        <Button
          variant="outlined"
          className="relative bottom-0.5"
          startIcon={<FilterListIcon />}
          onClick={handleOpen}
        >
          Filters
        </Button>

      <Box
        sx={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 2 }}
      >
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          PaperProps={{
            sx: {
              p: 2,
              width: 600,
            },
          }}
        >
          <div className="flex gap-2 w-full mb-4">
            <Autocomplete
              className="w-full"
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

            <Autocomplete
              className="w-full"
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
          </div>
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
          {/* <Box
            sx={{
              gridColumn: { xs: "span 12", md: "span 2" },
              display: "flex",
              alignItems: "flex-start",
            }}
          > */}
          <div className="flex justify-end">
            <Button
              variant="text"
              onClick={props.onClearAll}
              sx={{ mt: 0.5 }}
              data-testid="clear-all-filters"
            >
              Clear All
            </Button>
          </div>
            
          {/* </Box> */}

          <Box sx={{ gridColumn: { xs: "span 12", md: "span 12" } }}></Box>
        </Popover>
      </Box>
    </Stack>
  );
}

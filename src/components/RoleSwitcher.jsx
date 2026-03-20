import {
  Box,
  FormControl,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { ROLE_LIST, useRole } from '../auth/RoleProvider'

export function RoleSwitcher() {
  const { role, setRole } = useRole()

  const onChange = (e) => {
    setRole(e.target.value)
  }

  return (
    <Box sx={{ minWidth: 160 }}>
      <FormControl fullWidth size="small">
        <Select
          value={role}
          onChange={onChange}
          displayEmpty
          IconComponent={KeyboardArrowDownIcon}
          sx={{
            borderRadius: 2,
            height: 40,
            backgroundColor: 'rgba(255,255,255,0.15)',
            color: 'inherit',
            fontWeight: 500,
            backdropFilter: 'blur(6px)',

            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },

            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.25)',
            },

            '& .MuiSelect-select': {
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            },
          }}
          renderValue={(selected) => (
            <Typography variant="body2">
              {selected || 'Select Role'}
            </Typography>
          )}
          data-testid="role-switcher"
        >
          {ROLE_LIST.map((r) => (
            <MenuItem key={r} value={r}>
              {r}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}




import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { ROLE_LIST, useRole } from '../auth/RoleProvider'

export function RoleSwitcher() {
  const { role, setRole } = useRole()

  const onChange = (e) => {
    setRole(e.target.value)
  }

  return (
    <Box sx={{ minWidth: 170 }}>
      <FormControl fullWidth size="small">
        <InputLabel id="role-switcher-label">Role</InputLabel>

        <Select
          labelId="role-switcher-label"
          value={role}
          label="Role"
          onChange={onChange}
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
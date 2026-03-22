import { useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material'
import { mutateIncidentCreate } from '../../graphql/mockGraphqlClient'

const SEVERITIES = ['Critical', 'High', 'Medium', 'Low']

export function AddIncidentForm({ open, onClose, servicesOptions, onIncidentAdded }) {
  const [formData, setFormData] = useState({
    title: '',
    severity: '',
    serviceName: '',
    assignee: '',
    notes: '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!formData.title || !formData.severity || !formData.serviceName) return

    setLoading(true)
    try {
      const newIncident = await mutateIncidentCreate(formData)
      onIncidentAdded(newIncident)
      onClose()
      setFormData({
        title: '',
        severity: '',
        serviceName: '',
        assignee: '',
        notes: '',
      })
    } catch (error) {
      console.error('Failed to create incident:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      onClose()
      setFormData({
        title: '',
        severity: '',
        serviceName: '',
        assignee: '',
        notes: '',
      })
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Incident</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={handleChange('title')}
            required
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Severity</InputLabel>
            <Select
              value={formData.severity}
              onChange={handleChange('severity')}
              required
            >
              {SEVERITIES.map((sev) => (
                <MenuItem key={sev} value={sev}>
                  {sev}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Service</InputLabel>
            <Select
              value={formData.serviceName}
              onChange={handleChange('serviceName')}
              required
            >
              {servicesOptions.map((service) => (
                <MenuItem key={service} value={service}>
                  {service}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Assignee"
            fullWidth
            variant="outlined"
            value={formData.assignee}
            onChange={handleChange('assignee')}
          />
          <TextField
            margin="dense"
            label="Notes"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={formData.notes}
            onChange={handleChange('notes')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Creating...' : 'Create Incident'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}



// Roles
export const ROLE_LIST = ['Admin', 'Operator', 'Viewer']

// Severity
export const SEVERITY_LIST = ['Critical', 'High', 'Medium', 'Low']

// Incident Status
export const INCIDENT_STATUS_LIST = ['Open', 'Acknowledged', 'Resolved']

// Actions
export const INCIDENT_ACTIONS = ['acknowledge', 'resolve', 'reopen']

// Example structure (for reference / documentation purpose)
export const ServiceShape = {
  id: '',
  serviceName: '',
  status: 'Healthy', // 'Healthy' | 'Degraded' | 'Down'
  uptimePercentage: 0,
  lastCheckedAt: 0,
  openIncidentCount: 0,
}

export const IncidentShape = {
  id: '',
  title: '',
  severity: 'Low', // from SEVERITY_LIST
  status: 'Open', // from INCIDENT_STATUS_LIST
  serviceName: '',
  assignee: '',
  createdAt: 0,
  notes: '',
}

export const IncidentQueryFiltersShape = {
  severities: [],
  statuses: [],
  serviceName: null,
}

export const IncidentQueryParamsShape = {
  page: 1,
  pageSize: 10,
  filters: IncidentQueryFiltersShape,
}
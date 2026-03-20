



export const dashboardConfig = {
  appTitle: 'Cloud Service Monitor Dashboard',

  tabs: [
    { id: 'services', label: 'Services', roles: ['Admin', 'Operator', 'Viewer'] },
    { id: 'incidents', label: 'Incidents', roles: ['Admin', 'Operator'] },
  ],

  incidentsTab: {
    pageSize: 10,

    columns: [
      { id: 'id', label: 'ID', type: 'text', field: 'id' },
      { id: 'title', label: 'Title', type: 'link', field: 'title' },
      { id: 'severity', label: 'Severity', type: 'badge', field: 'severity' },
      { id: 'status', label: 'Status', type: 'chip', field: 'status', chipKind: 'status' },
      { id: 'service', label: 'Service', type: 'chip', field: 'serviceName', chipKind: 'service' },
      { id: 'assignee', label: 'Assignee', type: 'text', field: 'assignee' },
      { id: 'created', label: 'Created', type: 'relativeTime', field: 'createdAt' },
      { id: 'actions', label: 'Actions', type: 'actions' },
    ],

    filters: {
      severity: {
        key: 'severities',
        multi: true,
        label: 'Severity',
        options: [
          { value: 'Critical', label: 'Critical' },
          { value: 'High', label: 'High' },
          { value: 'Medium', label: 'Medium' },
          { value: 'Low', label: 'Low' },
        ],
      },

      status: {
        key: 'statuses',
        multi: true,
        label: 'Status',
        options: [
          { value: 'Open', label: 'Open' },
          { value: 'Acknowledged', label: 'Acknowledged' },
          { value: 'Resolved', label: 'Resolved' },
        ],
      },

      service: {
        key: 'serviceName',
        multi: false,
        label: 'Service',
        options: [], // will be filled dynamically
      },
    },

    actions: [
      {
        id: 'acknowledge',
        label: 'Acknowledge',
        roles: ['Admin', 'Operator'],
        allowedStatuses: ['Open'],
      },
      {
        id: 'resolve',
        label: 'Resolve',
        roles: ['Admin', 'Operator'],
        allowedStatuses: ['Open', 'Acknowledged'],
      },
      {
        id: 'reopen',
        label: 'Reopen',
        roles: ['Admin'],
        allowedStatuses: ['Resolved'],
      },
    ],

    sidePanel: {
      detailsTitle: 'Incident Detail',
      notesTitle: 'Notes',
    },
  },
}
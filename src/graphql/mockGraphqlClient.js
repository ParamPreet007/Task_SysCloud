


const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// ---- In-memory "backend" (mocked GraphQL responses) ----

const SERVICES_SEED = [
  { id: 'svc-auth', serviceName: 'Auth Service', uptimePercentage: 99.93 },
  { id: 'svc-billing', serviceName: 'Billing Service', uptimePercentage: 99.71 },
  { id: 'svc-notify', serviceName: 'Notification Service', uptimePercentage: 99.88 },
  { id: 'svc-search', serviceName: 'Search Service', uptimePercentage: 99.62 },
  { id: 'svc-stream', serviceName: 'Stream Processor', uptimePercentage: 99.55 },
]

const SEVERITIES = ['Critical', 'High', 'Medium', 'Low']
const STATUSES = ['Open', 'Acknowledged', 'Resolved']

const now = Date.now()
const minutesAgo = (m) => now - m * 60000

let incidents = [
  {
    id: 'INC-1001',
    title: 'Login latency regression',
    severity: 'High',
    status: 'Open',
    serviceName: 'Auth Service',
    assignee: 'A. Johnson',
    createdAt: minutesAgo(14),
    notes: 'Investigating recent deploy impact.',
  },
  {
    id: 'INC-1002',
    title: 'Payment webhook timeouts',
    severity: 'Critical',
    status: 'Acknowledged',
    serviceName: 'Billing Service',
    assignee: 'M. Chen',
    createdAt: minutesAgo(28),
    notes: 'Failing requests observed in us-east-1.',
  },

  // ... (keep your existing static data as is)

  ...Array.from({ length: 22 }).map((_, i) => {
    const idx = i + 16
    const service = SERVICES_SEED[idx % SERVICES_SEED.length].serviceName
    const severity = SEVERITIES[idx % SEVERITIES.length]
    const status = STATUSES[(idx + 1) % STATUSES.length]
    const createdAt = minutesAgo(10 + idx * 9)

    return {
      id: `INC-${1020 + i}`,
      title: `Auto-generated incident ${idx}`,
      severity,
      status,
      serviceName: service,
      assignee: ['A. Johnson', 'M. Chen', 'S. Patel', 'R. Kim', 'T. Nguyen'][idx % 5],
      createdAt,
      notes: i % 3 === 0 ? 'Auto note placeholder.' : '',
    }
  }),
]

let fetchCount = 0

const allowedStatusAfterAction = {
  acknowledge: (s) => (s === 'Open' ? 'Acknowledged' : s),
  resolve: (s) => (s === 'Open' || s === 'Acknowledged' ? 'Resolved' : s),
  reopen: (s) => (s === 'Resolved' ? 'Open' : s),
}

export async function queryServicesOverview() {
  await sleep(450)

  const openByService = new Map()

  for (const inc of incidents) {
    if (inc.status !== 'Resolved') {
      openByService.set(
        inc.serviceName,
        (openByService.get(inc.serviceName) || 0) + 1
      )
    }
  }

  const t = Date.now()

  return SERVICES_SEED.map((svc) => {
    const openIncidentCount = openByService.get(svc.serviceName) || 0

    const status =
      openIncidentCount >= 5
        ? 'Down'
        : openIncidentCount >= 2
        ? 'Degraded'
        : 'Healthy'

    const uptimePercentage = Math.max(
      95,
      Math.min(100, svc.uptimePercentage - openIncidentCount * 0.03)
    )

    return {
      id: svc.id,
      serviceName: svc.serviceName,
      status,
      uptimePercentage: Number(uptimePercentage.toFixed(2)),
      lastCheckedAt: t,
      openIncidentCount,
    }
  })
}

export async function queryIncidents(params, opts) {
  fetchCount += 1

  const delay = opts?.background ? 250 : 650
  await sleep(delay)

  const { page, pageSize, filters } = params

  const filtered = incidents
    .filter((i) =>
      filters.severities.length
        ? filters.severities.includes(i.severity)
        : true
    )
    .filter((i) =>
      filters.statuses.length
        ? filters.statuses.includes(i.status)
        : true
    )
    .filter((i) =>
      filters.serviceName
        ? i.serviceName === filters.serviceName
        : true
    )

  filtered.sort((a, b) => b.createdAt - a.createdAt)

  if (opts?.background && fetchCount % 4 === 0) {
    const candidate = incidents.find((x) => x.status === 'Open')
    if (candidate) {
      candidate.status =
        allowedStatusAfterAction.acknowledge(candidate.status)
    }
  }

  const totalCount = filtered.length
  const startIndex = (page - 1) * pageSize
  const items = filtered.slice(startIndex, startIndex + pageSize)

  return { items: [...items], totalCount }
}

export async function mutateIncidentNotes(input) {
  await sleep(350)

  const inc = incidents.find((i) => i.id === input.incidentId)
  if (!inc) throw new Error('Incident not found')

  inc.notes = input.notes
  return { ...inc }
}

export async function mutateIncidentAction(input) {
  await sleep(300)

  const inc = incidents.find((i) => i.id === input.incidentId)
  if (!inc) throw new Error('Incident not found')

  inc.status = allowedStatusAfterAction[input.actionId](inc.status)
  return { ...inc }
}

export function getAllServiceNames() {
  return SERVICES_SEED.map((s) => s.serviceName)
}
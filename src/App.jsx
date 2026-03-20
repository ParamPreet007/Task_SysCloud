

import { useEffect, useMemo, useState } from 'react'
import { Alert, Box, Container, ThemeProvider, createTheme } from '@mui/material'
import { RoleProvider, ROLE_LIST, useRole } from './auth/RoleProvider'
import { dashboardConfig } from './config/dashboardConfig'
import { TabsBar } from './components/TabsBar'
import { DashboardHeader } from './components/DashboardHeader'
import { ServicesTab } from './components/ServicesTab'
import { IncidentsTab } from './components/IncidentsTab/IncidentsTab'

const theme = createTheme({
  palette: {
    mode: 'light',
  },
})

function AppInner() {
  const { role } = useRole()

  const tabsForRole = useMemo(() => {
    return dashboardConfig.tabs.filter((t) => t.roles.includes(role))
  }, [role])

  const [activeTabId, setActiveTabId] = useState(() => {
    const defaultTab = tabsForRole[0]?.id ?? 'services'
    return defaultTab
  })

  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(false)

  // Manual refresh handler is registered by the currently mounted tab.
  const [manualRefreshFn, setManualRefreshFn] = useState(null)

  useEffect(() => {
    const visible = dashboardConfig.tabs.filter((t) =>
      t.roles.includes(role)
    )

    if (!visible.some((t) => t.id === activeTabId)) {
      setActiveTabId(visible[0]?.id ?? 'services')
    }
  }, [role, activeTabId])

  const activeTabLabel =
    dashboardConfig.tabs.find((t) => t.id === activeTabId)?.label || ''

  const tabContent = useMemo(() => {
    return {
      services: <ServicesTab onRegisterRefresh={setManualRefreshFn} />,
      incidents: (
        <IncidentsTab
          role={role}
          autoRefreshEnabled={autoRefreshEnabled}
          onRegisterRefresh={setManualRefreshFn}
        />
      ),
    }
  }, [role, autoRefreshEnabled])

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <DashboardHeader
          appTitle={dashboardConfig.appTitle}
          activeTabLabel={activeTabLabel}
          autoRefreshEnabled={autoRefreshEnabled}
          onToggleAutoRefresh={(v) => setAutoRefreshEnabled(v)}
          onManualRefresh={() => manualRefreshFn && manualRefreshFn()}
        />

        <TabsBar
          tabs={dashboardConfig.tabs}
          role={role}
          activeTabId={activeTabId}
          onTabChange={(id) => setActiveTabId(id)}
        />

        {tabContent[activeTabId] || null}
      </Box>
    </Container>
  )
}

export default function App() {
  const validRoles = ROLE_LIST

  if (!validRoles.includes('Admin')) {
    return <Alert severity="error">Role configuration error.</Alert>
  }

  return (
    <ThemeProvider theme={theme}>
      <RoleProvider>
        <AppInner />
      </RoleProvider>
    </ThemeProvider>
  )
}
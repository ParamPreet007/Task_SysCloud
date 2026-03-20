



import { Box, Tab, Tabs } from '@mui/material'

export function TabsBar(props) {
  const visibleTabs = props.tabs.filter((t) =>
    t.roles.includes(props.role)
  )

  const active = visibleTabs.some((t) => t.id === props.activeTabId)
    ? props.activeTabId
    : visibleTabs[0]?.id ?? props.tabs[0]?.id

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs
        value={active}
        onChange={(_, v) => props.onTabChange(v)}
      >
        {visibleTabs.map((t) => (
          <Tab
            key={t.id}
            value={t.id}
            label={t.label}
            data-testid={`tab-${t.id}`}
          />
        ))}
      </Tabs>
    </Box>
  )
}


import { createContext, useContext, useMemo, useState } from 'react'

const RoleContext = createContext()

export const ROLE_LIST = ['Admin', 'Operator', 'Viewer']

export function RoleProvider(props) {
  const [role, setRole] = useState('Admin')

  const value = useMemo(() => ({ role, setRole }), [role])

  return (
    <RoleContext.Provider value={value}>
      {props.children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const ctx = useContext(RoleContext)

  if (!ctx) {
    throw new Error('useRole must be used within RoleProvider')
  }

  return ctx
}
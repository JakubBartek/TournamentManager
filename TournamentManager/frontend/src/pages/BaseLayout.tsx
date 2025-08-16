import { NavbarSimple } from '@/components/Navbar/Navbar.tsx'
import { Outlet } from 'react-router-dom'

export function BaseLayout() {
  return (
    <>
      <NavbarSimple />
      <Outlet />
    </>
  )
}

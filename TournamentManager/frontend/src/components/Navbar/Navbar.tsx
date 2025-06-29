import React from 'react'
import { Navbar, IconButton } from '@material-tailwind/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

function NavList({ collapsed }: { collapsed: boolean }) {
  const user = true

  const links = [
    { to: '/', label: 'Home' },
    { to: '/map', label: 'Map' },
    { to: '/schedule', label: 'Schedule' },
    { to: '/teams', label: 'Teams' },
  ]

  return (
    <ul className=' flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6'>
      {user &&
        links.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className='flex items-center hover:text-blue-500 transition-colors'
          >
            {/* Show text only if NOT collapsed or on desktop */}
            <span className={`${collapsed ? 'hidden' : 'inline'} lg:inline`}>
              {label}
            </span>
          </Link>
        ))}
    </ul>
  )
}

export function NavbarSimple() {
  const [openNav, setOpenNav] = React.useState(false)

  const handleWindowResize = () => window.innerWidth >= 960 && setOpenNav(false)

  React.useEffect(() => {
    window.addEventListener('resize', handleWindowResize)
    return () => window.removeEventListener('resize', handleWindowResize)
  }, [])

  return (
    <Navbar
      className='fixed top-2 left-2 right-2 z-50 bg-white shadow-md px-6 py-3 w-auto'
      placeholder={undefined}
      onResize={undefined}
      onResizeCapture={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
    >
      <div className='flex items-center justify-between text-blue-gray-900'>
        <Link to='/' className='text-2xl mr-4 cursor-pointer'>
          Turnajuj
        </Link>

        {/* Desktop Nav List (always visible) */}
        <div className='hidden lg:block'>
          <NavList collapsed={false} />
        </div>

        {/* Mobile IconButton (hidden on desktop) */}
        <div className='lg:hidden'>
          <IconButton
            variant='text'
            className='flex items-center justify-center h-8 w-8 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent'
            ripple={false}
            onClick={() => setOpenNav(!openNav)}
            placeholder={undefined}
            onResize={undefined}
            onResizeCapture={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            {openNav ? (
              <XMarkIcon className='h-6 w-6' strokeWidth={2} />
            ) : (
              <Bars3Icon className='h-6 w-6' strokeWidth={2} />
            )}
          </IconButton>
        </div>
      </div>

      {/* Mobile nav menu (only visible on small screens) */}
      <div className='lg:hidden'>
        <AnimatePresence initial={false}>
          {openNav && (
            <motion.div
              key='mobile-nav'
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className='overflow-hidden'
            >
              <NavList collapsed={false} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Navbar>
  )
}

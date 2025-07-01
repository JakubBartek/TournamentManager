import React from 'react'
import { Navbar } from '@material-tailwind/react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBars,
  faCalendarDays,
  faCircleInfo,
  faHouse,
  faMapLocationDot,
} from '@fortawesome/free-solid-svg-icons'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export function NavbarSimple() {
  const handleWindowResize = () => window.innerWidth >= 960

  React.useEffect(() => {
    window.addEventListener('resize', handleWindowResize)
    return () => window.removeEventListener('resize', handleWindowResize)
  }, [])

  return (
    <Navbar
      className='fixed bottom-0 left-0 right-0 z-50 bg-white shadow-md px-6 py-3 w-auto rounded-b-none border-gray-400'
      placeholder={undefined}
      onResize={undefined}
      onResizeCapture={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
    >
      <div className='flex items-center justify-between text-blue-gray-900'>
        {/* Desktop Nav List (always visible) */}
        <div className='hidden lg:block'>
          <Link to='/' className='text-2xl mr-4 cursor-pointer'>
            Turnajuj
          </Link>
        </div>

        {/* Mobile IconButton (hidden on desktop) */}
        <div className='lg:hidden flex justify-between w-full px-2 gap-12 py-2 grow z-51 text-3xl'>
          <Link to='/teams' className='flex-1 flex justify-center'>
            <FontAwesomeIcon icon={faCircleInfo} />
          </Link>
          <Link to='/map' className='flex-1 flex justify-center'>
            <FontAwesomeIcon icon={faMapLocationDot} />
          </Link>
          <Link to='/' className='flex-1 flex justify-center'></Link>
          <Link to='/schedule' className='flex-1 flex justify-center'>
            <FontAwesomeIcon icon={faCalendarDays} />
          </Link>
          <div className='flex-1 flex justify-center'>
            <Sheet>
              <SheetTrigger asChild>
                <FontAwesomeIcon
                  icon={faBars}
                  className='flex-1 flex justify-center text-[#646cff]'
                />
              </SheetTrigger>
              <SheetContent>
                <div className='flex flex-col gap-4 p-4'>
                  <Link to='/teams' className='text-lg'>
                    Tímy
                  </Link>
                  <Link to='/map' className='text-lg'>
                    Mapa
                  </Link>
                  <Link to='/schedule' className='text-lg'>
                    Rozpis
                  </Link>
                </div>
                {/* Môžeš sem doplniť obsah podľa potreby */}
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <div className='lg:hidden fixed bottom-4 left-0 right-0 flex justify-center'>
          <Link to='/'>
            <span
              className='flex items-center justify-center w-18 h-18 rounded-full'
              style={{ backgroundColor: '#646cff' }}
            >
              <FontAwesomeIcon icon={faHouse} className='text-2xl text-white' />
            </span>
          </Link>
        </div>
      </div>
    </Navbar>
  )
}

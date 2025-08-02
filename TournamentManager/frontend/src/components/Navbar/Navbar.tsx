import React from 'react'
import { Navbar } from '@material-tailwind/react'
import { Link, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalendarDays,
  faHouse,
  faListOl,
  faInfoCircle,
  faAnglesLeft,
} from '@fortawesome/free-solid-svg-icons'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export function NavbarSimple() {
  const handleWindowResize = () => window.innerWidth >= 960
  const { tournamentId } = useParams<{ tournamentId: string }>()
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    window.addEventListener('resize', handleWindowResize)
    return () => window.removeEventListener('resize', handleWindowResize)
  }, [])

  const handleLinkClickInSheet = () => setOpen(false)

  return (
    // @ts-expect-error Suppress missing props warning
    <Navbar
      className='fixed bottom-0 left-0 right-0 z-50 bg-white shadow-md px-6 py-3 w-auto rounded-b-none border-gray-400'
      placeholder={undefined}
      onResize={undefined}
      onResizeCapture={undefined}
    >
      <div className='flex items-center justify-between text-blue-gray-900'>
        <div className='flex justify-between items-center w-full px-2 py-2 gap-8 text-3xl z-51'>
          <Link
            to={`/${tournamentId}/info`}
            className='flex-1 flex justify-center'
          >
            <FontAwesomeIcon icon={faInfoCircle} />
          </Link>
          <Link
            to={`/${tournamentId}/schedule`}
            className='flex-1 flex justify-center'
          >
            <FontAwesomeIcon icon={faCalendarDays} />
          </Link>
          <Link
            to={`/${tournamentId}`}
            className='flex-1 flex justify-center'
          ></Link>
          <Link
            to={`/${tournamentId}/standings`}
            className='flex-1 flex justify-center'
          >
            <FontAwesomeIcon icon={faListOl} />
          </Link>
          <div className='flex-1 flex justify-center'>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <FontAwesomeIcon
                  icon={faAnglesLeft}
                  className='flex-1 flex justify-center text-[#646cff]'
                />
              </SheetTrigger>
              <SheetContent>
                <div className='flex flex-col gap-4 p-4'>
                  <Link
                    to='/select'
                    className='text-lg'
                    onClick={handleLinkClickInSheet}
                  >
                    Choose a Tournament
                  </Link>
                  <Link
                    to={`/${tournamentId}/edit`}
                    className='text-lg'
                    onClick={handleLinkClickInSheet}
                  >
                    Edit Tournament
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <div className='fixed bottom-4 left-1/2 transform -translate-x-1/2 z-60'>
          <Link to={`/${tournamentId}`} className='block'>
            <span className='w-18 h-18 bg-[#646cff] rounded-full flex items-center justify-center shadow-lg'>
              <FontAwesomeIcon icon={faHouse} className='text-white text-3xl' />
            </span>
          </Link>
        </div>
      </div>
    </Navbar>
  )
}

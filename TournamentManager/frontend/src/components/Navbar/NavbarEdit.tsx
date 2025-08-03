import React from 'react'
import { Navbar } from '@material-tailwind/react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { Button } from '@/components/ui/button'

export function NavbarEdit() {
  const handleWindowResize = () => window.innerWidth >= 960
  const navigate = useNavigate()
  const location = useLocation()
  const parentPath = location.pathname.split('/').slice(0, -1).join('/') || '/'

  React.useEffect(() => {
    window.addEventListener('resize', handleWindowResize)
    return () => window.removeEventListener('resize', handleWindowResize)
  }, [])

  return (
    <div className='fixed top-4 md:top-100 left-0 z-50'>
      {/* @ts-expect-error Suppress missing props warning */}
      <Navbar
        className='bg-white shadow-md px-6 py-3 w-auto rounded-l-none border-gray-400'
        placeholder={undefined}
        onResize={undefined}
        onResizeCapture={undefined}
        onClick={() => navigate(parentPath)}
      >
        <div className='flex justify-between items-center w-full px-2 py-2 gap-8 text-3xl'>
          <Button variant='white' size='full'>
            <FontAwesomeIcon icon={faArrowLeft} />
          </Button>
        </div>
      </Navbar>
    </div>
  )
}

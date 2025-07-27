import Home from './pages/Home'
import Schedule from './pages/Schedule'
import Map from './pages/Map'
import Teams from './pages/Teams'
import { BaseLayout } from './pages/BaseLayout'
import './App.css'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import SelectTournament from './pages/SelectTournament'
import Info from './pages/Info'
import Standings from './pages/Standings'
import TournamentCreate from './pages/TournamentCreate'
import EditTournament from './pages/EditTournament'

const router = createBrowserRouter([
  {
    path: '/select',
    Component: SelectTournament,
  },
  {
    path: '/:tournamentId',
    Component: BaseLayout,
    children: [
      {
        path: 'home',
        Component: Home,
      },
      {
        path: 'schedule',
        Component: Schedule,
      },
      {
        path: 'map',
        Component: Map,
      },
      {
        path: 'teams',
        Component: Teams,
      },
      {
        path: 'info',
        Component: Info,
      },
      {
        path: 'standings',
        Component: Standings,
      },
      {
        path: 'editTournament',
        Component: EditTournament,
      },
    ],
  },
  {
    path: '/tournament/create',
    Component: TournamentCreate,
  },
  {
    path: '/',
    element: <Navigate to='/select' />,
  },
  {
    path: '*',
    element: <div>404 Not Found</div>,
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App

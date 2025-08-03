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
import EditTeams from './pages/EditTeams'
import EditTeam from './pages/EditTeam'
import EditTournamentOptions from './pages/EditTournamentOptions'
import EditSchedule from './pages/EditSchedule'
import EditRinks from './pages/EditRinks'

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
        path: '',
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
        path: 'edit',
        Component: EditTournament,
      },
      {
        path: 'edit/teams',
        Component: EditTeams,
      },
      {
        path: 'edit/teams/:teamId',
        Component: EditTeam,
      },
      {
        path: 'edit/tournament',
        Component: EditTournamentOptions,
      },
      {
        path: 'edit/schedule',
        Component: EditSchedule,
      },
      {
        path: 'edit/rinks',
        Component: EditRinks,
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

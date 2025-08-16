import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/components/Auth/AuthContext'
import { Toaster } from '@/components/ui/sonner.tsx'
import './i18n.ts'
import { TournamentAuthProvider } from './components/Auth/TournamentAuthContext.tsx'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TournamentAuthProvider>
          <App />
          <Toaster />
        </TournamentAuthProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)

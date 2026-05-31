import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import './index.css'

import Header    from './components/layout/Header'
import Footer    from './components/layout/Footer'
import { ProtectedRoute, AdminRoute } from './components/ui/ProtectedRoute'

import Home          from './pages/Home'
import ListingDetail from './pages/ListingDetail'
import Login         from './pages/Login'
import Register      from './pages/Register'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <div className="flex-1">
            <Routes>
              {/* Public */}
              <Route path="/"            element={<Home />} />
              <Route path="/listings/:id" element={<ListingDetail />} />
              <Route path="/login"       element={<Login />} />
              <Route path="/register"    element={<Register />} />

              {/* Sẽ thêm sau */}
              {/* <Route path="/listings/create" element={
                <ProtectedRoute><ListingCreate /></ProtectedRoute>
              } /> */}
              {/* <Route path="/admin/*" element={
                <AdminRoute><AdminDashboard /></AdminRoute>
              } /> */}
            </Routes>
          </div>
          <Footer />
        </div>
        <Toaster position="top-right" />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
)
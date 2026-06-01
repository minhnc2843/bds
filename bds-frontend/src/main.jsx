import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import './index.css'
import ListingCreate from './pages/ListingCreate'
import Header    from './components/layout/Header'
import Footer    from './components/layout/Footer'
import { ProtectedRoute, AdminRoute } from './components/ui/ProtectedRoute'
import MyListings  from './pages/MyListings'
import ListingEdit from './pages/ListingEdit'
import Home          from './pages/Home'
import ListingDetail from './pages/ListingDetail'
import Login         from './pages/Login'
import Register      from './pages/Register'
import AdminLayout    from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminListings  from './pages/admin/AdminListings'
import AdminUsers     from './pages/admin/AdminUsers'
import Profile from './pages/Profile'
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
              <Route path="/my-listings" element={
                <ProtectedRoute><MyListings /></ProtectedRoute>
              } />

              <Route path="/listings/:id/edit" element={
                <ProtectedRoute><ListingEdit /></ProtectedRoute>
              } />
            <Route path="/admin" element={
              <AdminRoute><AdminLayout /></AdminRoute>
            }>
              <Route index        element={<AdminDashboard />} />
              <Route path="listings" element={<AdminListings />} />
              <Route path="users"    element={<AdminUsers />} />
            </Route>

            <Route path="/profile" element={
              <ProtectedRoute><Profile /></ProtectedRoute>
            } />
              {/* Sẽ thêm sau */}
              <Route path="/listings/create" element={
                <ProtectedRoute><ListingCreate /></ProtectedRoute>} />
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
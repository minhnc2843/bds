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
import SearchPage from './pages/SearchPage'
import Blog        from './pages/Blog'
import BlogDetail  from './pages/BlogDetail'
import StaticPage  from './pages/StaticPage'
import Contact     from './pages/Contact'
import AdminSettings   from './pages/admin/cms/AdminSettings'
import AdminBanners    from './pages/admin/cms/AdminBanners'
import AdminPromotions from './pages/admin/cms/AdminPromotions'
import AdminPosts      from './pages/admin/cms/AdminPosts'
import AdminContacts   from './pages/admin/cms/AdminContacts'
import { useRealtimeNotifications, useRealtimeAdmin } from './hooks/useRealtime'
const queryClient = new QueryClient()
function AppWithRealtime({ children }) {
  useRealtimeNotifications()
  useRealtimeAdmin()
  return children
}
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
  <BrowserRouter>
    <AppWithRealtime>
      <div className="min-h-screen bg-dark-900 flex flex-col">
        <Header />
        <div className="flex-1 pt-20"> {/* pt-20 vì header fixed */}
          <Routes>
            <Route path="/"              element={<Home />} />
            <Route path="/search"        element={<SearchPage />} />
            <Route path="/listings/:id"  element={<ListingDetail />} />
            <Route path="/login"         element={<Login />} />
            <Route path="/register"      element={<Register />} />
            <Route path="/notifications" element={
              <ProtectedRoute><Notifications /></ProtectedRoute>
            } />
            <Route path="/listings/create" element={
              <ProtectedRoute><ListingCreate /></ProtectedRoute>
            } />
            <Route path="/listings/:id/edit" element={
              <ProtectedRoute><ListingEdit /></ProtectedRoute>
            } />
            <Route path="/my-listings" element={
              <ProtectedRoute><MyListings /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><Profile /></ProtectedRoute>
            } />
            <Route path="/admin" element={
              <AdminRoute><AdminLayout /></AdminRoute>
            }>
              <Route index           element={<AdminDashboard />} />
              <Route path="listings" element={<AdminListings />} />
              <Route path="users"    element={<AdminUsers />} />
             
<Route path="/blog"        element={<Blog />} />
<Route path="/blog/:slug"  element={<BlogDetail />} />
<Route path="/pages/:slug" element={<StaticPage />} />
<Route path="/contact"     element={<Contact />} />
<Route path="settings"   element={<AdminSettings />} />
<Route path="banners"    element={<AdminBanners />} />
<Route path="promotions" element={<AdminPromotions />} />
<Route path="posts"      element={<AdminPosts />} />
<Route path="contacts"   element={<AdminContacts />} />
            </Route>
          </Routes>
        </div>
        <Footer />
      </div>
    </AppWithRealtime>
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: 'transparent',
          boxShadow: 'none',
          padding: 0,
        },
      }}
    />
  </BrowserRouter>
</QueryClientProvider>
  </StrictMode>
)
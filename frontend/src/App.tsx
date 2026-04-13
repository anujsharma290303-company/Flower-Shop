import { Routes, Route } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import BestSellersPage from '@/pages/BestSellersPage'
import ShopPage from '@/pages/ShopPage'
import ProductDetailPage from '@/pages/ProductDetailPage'
import HowItWorksPage from '@/pages/HowItWorksPage'
import AboutPage from '@/pages/AboutPage'
import FaqPage from '@/pages/FaqPage'
import ReviewsPage from '@/pages/ReviewsPage'
import SignInPage from './pages/SignInPage'
import CreateAccountPage from '@/pages/CreateAccountPage'
import MyProfilePage from '@/pages/MyProfilePage'
import MyOrdersPage from '@/pages/MyOrdersPage'
import MyOrderDetailPage from '@/pages/MyOrderDetailPage'
import BlogPage from '@/pages/BlogPage'
import BlogDetailPage from '@/pages/BlogDetailPage'
import FlowerMeProfilePage from '@/pages/FlowerMeProfilePage'
import FlowerMePublicProfilePage from '@/pages/FlowerMePublicProfilePage'
import CheckoutPage from '@/pages/CheckoutPage'
import TrackOrderPage from '@/pages/TrackOrderPage'
import RecipientChoicePage from '@/pages/RecipientChoicePage'
import CustomerProtectedRoute from '@/components/auth/CustomerProtectedRoute'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'
import NotFoundPage from '@/pages/NotFoundPage'
import AdminLoginPage from '@/pages/admin/AdminLoginPage'
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage'

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/shop/:slug" element={<ShopPage />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/faq" element={<FaqPage />} />
      <Route path="/reviews" element={<ReviewsPage />} />
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/create-account" element={<CreateAccountPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogDetailPage />} />
      <Route
        path="/checkout/:itemCode"
        element={(
          <CustomerProtectedRoute>
            <CheckoutPage />
          </CustomerProtectedRoute>
        )}
      />
      <Route
        path="/checkout"
        element={(
          <CustomerProtectedRoute>
            <CheckoutPage />
          </CustomerProtectedRoute>
        )}
      />
      <Route path="/track-order" element={<TrackOrderPage />} />
      <Route path="/recipient/:token" element={<RecipientChoicePage />} />
      <Route path="/flowerme/profile/:slug" element={<FlowerMePublicProfilePage />} />
      <Route
        path="/flowerme/profile"
        element={(
          <CustomerProtectedRoute>
            <FlowerMeProfilePage />
          </CustomerProtectedRoute>
        )}
      />
      <Route
        path="/my-profile"
        element={(
          <CustomerProtectedRoute>
            <MyProfilePage />
          </CustomerProtectedRoute>
        )}
      />
      <Route
        path="/my-orders"
        element={(
          <CustomerProtectedRoute>
            <MyOrdersPage />
          </CustomerProtectedRoute>
        )}
      />
      <Route
        path="/my-orders/:id"
        element={(
          <CustomerProtectedRoute>
            <MyOrderDetailPage />
          </CustomerProtectedRoute>
        )}
      />
      <Route path="/best-sellers" element={<BestSellersPage />} />
      <Route path="/item/:itemCode/:slug" element={<ProductDetailPage />} />
      <Route path="/item/:itemCode" element={<ProductDetailPage />} />

      {/* Admin routes */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin/dashboard"
        element={(
          <AdminProtectedRoute>
            <AdminDashboardPage />
          </AdminProtectedRoute>
        )}
      />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
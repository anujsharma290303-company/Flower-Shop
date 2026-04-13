import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import BestSellersPage from '@/pages/BestSellersPage'
import ShopPage from '@/pages/ShopPage'
import ProductDetailPage from '@/pages/ProductDetailPage'
import HowItWorksPage from '@/pages/HowItWorksPage'
import AboutPage from '@/pages/AboutPage'
import FaqPage from '@/pages/FaqPage'
import ReviewsPage from '@/pages/ReviewsPage'
import ContactPage from '@/pages/ContactPage'
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
import CartPage from '@/pages/CartPage'
import TrackOrderPage from '@/pages/TrackOrderPage'
import RecipientChoicePage from '@/pages/RecipientChoicePage'
import CustomBouquetBuilderPage from '@/pages/CustomBouquetBuilderPage'
import StaticContentPage from '@/components/static/StaticContentPage'
import CustomerProtectedRoute from '@/components/auth/CustomerProtectedRoute'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'
import NotFoundPage from '@/pages/NotFoundPage'
import AdminLoginPage from '@/pages/admin/AdminLoginPage'
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage'

const staticPageRoutes = [
  { path: '/privacy', pageId: 'privacy' },
  { path: '/customer-service', pageId: 'customer-service' },
  { path: '/local-florist-delivery', pageId: 'local-florist-delivery' },
  { path: '/terms', pageId: 'terms' },
  { path: '/date', pageId: 'date' },
  { path: '/date/', pageId: 'date' },
  { path: '/social-media', pageId: 'social-media' },
  { path: '/social-media/', pageId: 'social-media' },
  { path: '/social-media/facebook', pageId: 'social-media-facebook' },
  { path: '/social-media/instagram', pageId: 'social-media-instagram' },
  { path: '/social-media/onlyfans', pageId: 'social-media-onlyfans' },
  { path: '/wishlist', pageId: 'wishlist' },
  { path: '/wishlist/', pageId: 'wishlist' },
  { path: '/work', pageId: 'work' },
  { path: '/work/', pageId: 'work' },
  { path: '/hospital', pageId: 'hospital' },
  { path: '/hospital/', pageId: 'hospital' },
  { path: '/funeral-home', pageId: 'funeral-home' },
  { path: '/funeral-home/', pageId: 'funeral-home' },
  { path: '/hotel', pageId: 'hotel' },
  { path: '/hotel/', pageId: 'hotel' },
  { path: '/sorry', pageId: 'sorry' },
  { path: '/sorry/', pageId: 'sorry' },
  { path: '/companion', pageId: 'companion' },
  { path: '/companion/', pageId: 'companion' },
  { path: '/overseas', pageId: 'overseas' },
  { path: '/overseas/', pageId: 'overseas' },
  { path: '/crypto', pageId: 'crypto' },
  { path: '/crypto/', pageId: 'crypto' },
  { path: '/anonymously', pageId: 'anonymously' },
  { path: '/anonymously/', pageId: 'anonymously' },
  { path: '/romance-flowers', pageId: 'romance' },
  { path: '/roses', pageId: 'roses' },
  { path: '/high-end-flowers', pageId: 'high-end' },
  { path: '/everyday-flowers', pageId: 'everyday' },
  { path: '/get-well-flowers', pageId: 'get-well' },
  { path: '/birthday-flowers', pageId: 'birthday' },
  { path: '/new-baby-flowers', pageId: 'new-baby' },
  { path: '/thank-you-flowers', pageId: 'thank-you' },
  { path: '/sorry-flowers', pageId: 'sorry-flowers' },
  { path: '/sympathy-flowers', pageId: 'sympathy' },
  { path: '/plants', pageId: 'plants' },
]

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
      <Route path="/contact" element={<ContactPage />} />
      {staticPageRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={<StaticContentPage pageId={route.pageId} />}
        />
      ))}
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
      <Route
        path="/cart"
        element={(
          <CustomerProtectedRoute>
            <CartPage />
          </CustomerProtectedRoute>
        )}
      />
      <Route path="/track-order" element={<TrackOrderPage />} />
      <Route path="/recipient/:token" element={<RecipientChoicePage />} />
      <Route path="/create-a-bouquet" element={<CustomBouquetBuilderPage />} />
      <Route path="/let-recipient-choose-flowers" element={<Navigate to="/create-a-bouquet?type=recipient" replace />} />
      <Route path="/recipient-choice-bouquet" element={<Navigate to="/create-a-bouquet?type=recipient" replace />} />
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
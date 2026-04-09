# 🏠 Social Flowers Homepage - Detailed Build Plan

**Status:** Pre-Development  
**Target:** Replica of https://www.socialflowers.com/  
**Timeline:** 2-3 days  
**Tech Stack:** React 18 + TypeScript + Tailwind CSS + Vite

---

## 📐 HOMEPAGE STRUCTURE BREAKDOWN

### Visual Sections (Top to Bottom)

```
1. NAVIGATION BAR (Global Header)
   ├── Logo + Home Link
   ├── Search Bar
   ├── Category Dropdown Menu
   ├── User Menu / Auth Links
   └── Shopping Cart Icon (with badge)

2. HERO SECTION
   ├── Headline Text
   ├── Subheading
   ├── CTA Buttons ("Shop Now", "Learn More")
   ├── Hero Image (Transparent flower)
   └── Background gradient overlay

3. FEATURED PRODUCTS CAROUSEL
   ├── Section Title
   ├── 6-8 Product Cards (horizontal scroll)
   │  ├── Product Image
   │  ├── Product Name
   │  ├── Price ($XX.00)
   │  ├── Star Rating
   │  ├── Quick View Button
   │  └── Add to Cart Button
   └── Previous/Next Carousel Buttons

4. HOW IT WORKS SECTION
   ├── Section Title
   ├── 7-Step Visual Flow
   │  ├── Step Icons
   │  ├── Step Numbers
   │  ├── Short Description per step
   │  └── Connecting arrows/lines
   └── CTA to detailed page

5. BENEFITS SECTION (3 Columns)
   ├── Column 1: "For Everyone"
   │  ├── Icon (SVG)
   │  ├── Heading
   │  └── 4 Bullet points
   ├── Column 2: "For Senders"
   │  ├── Icon (SVG)
   │  ├── Heading
   │  └── 4 Bullet points
   └── Column 3: "For Recipients"
      ├── Icon (SVG)
      ├── Heading
      └── 4 Bullet points

6. CUSTOM BOUQUET SECTION
   ├── Section Title
   ├── Two-Column Cards
   │  ├── Card 1: "Sender's Choice"
   │  │  ├── Image
   │  │  ├── Title
   │  │  ├── Description
   │  │  └── CTA Button
   │  └── Card 2: "Recipient's Choice"
   │     ├── Image
   │     ├── Title
   │     ├── Description
   │     └── CTA Button
   └── Supporting text

7. NEWSLETTER SIGNUP (Optional - Footer-adjacent)
   ├── Headline
   ├── Email Input
   ├── Subscribe Button
   └── Privacy notice

8. FOOTER
   ├── Logo
   ├── 4 Link Columns (Shop, Company, Uses, Follow)
   ├── Social Media Icons
   └── Copyright + Legal Links

```

---

## 🗂️ FOLDER STRUCTURE

```
frontend/src/
├── pages/
│   └── HomePage.tsx              ← Main page component
│
├── components/
│   ├── layout/
│   │   ├── Navigation.tsx         ← Header nav bar
│   │   ├── Footer.tsx             ← Footer
│   │   └── Layout.tsx             ← Wrapper for pages
│   │
│   ├── home/                      ← Homepage-specific components
│   │   ├── HeroSection.tsx
│   │   ├── FeaturedCarousel.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── BenefitsSection.tsx
│   │   ├── CustomBouquetSection.tsx
│   │   ├── NewsletterSignup.tsx
│   │   └── index.ts               ← Export all home components
│   │
│   ├── ui/
│   │   ├── ProductCard.tsx        ← Reusable product card
│   │   ├── Button.tsx             ← Reusable button component
│   │   ├── Input.tsx              ← Input field
│   │   ├── Modal.tsx              ← Modal/Dialog
│   │   ├── Carousel.tsx           ← Generic carousel
│   │   ├── Badge.tsx              ← Rating badge
│   │   └── index.ts               ← Export all UI components
│   │
│   └── common/
│       ├── CartIcon.tsx           ← Shopping cart with count
│       ├── UserMenu.tsx           ← User dropdown menu
│       ├── SearchBar.tsx          ← Search input
│       └── index.ts
│
├── hooks/
│   ├── useCart.ts                 ← Cart state management
│   ├── useAuth.ts                 ← Auth state
│   ├── useProducts.ts             ← Fetch products
│   └── useLocalStorage.ts         ← Persist data
│
├── api/
│   ├── axios.ts                   ← Axios config (already exists)
│   ├── products.ts                ← Product API calls
│   ├── categories.ts              ← Category API calls
│   ├── site-config.ts             ← Site configuration API
│   └── types.ts                   ← API response types
│
├── store/
│   ├── context/
│   │   ├── CartContext.tsx        ← Cart state context
│   │   ├── AuthContext.tsx        ← Auth state context
│   │   └── index.ts
│   └── hooks.ts                   ← Context hooks
│
├── types/
│   ├── index.ts                   ← (extends existing)
│   ├── product.ts
│   ├── category.ts
│   ├── cart.ts
│   ├── user.ts
│   └── api.ts
│
├── utils/
│   ├── formatPrice.ts             ← (already exists)
│   ├── cn.ts                      ← Class name merger (classnames)
│   ├── constants.ts               ← App constants (nav links, etc.)
│   └── validators.ts
│
└── styles/
    ├── index.css                  ← (already has @import "tailwindcss")
    ├── home.css                   ← Homepage-specific styles
    └── animations.css             ← Reusable animations
```

---

## 🎯 COMPONENT BUILD ORDER

### **STEP 1: Setup & Dependencies**
Install required packages:
```bash
npm install classnames clsx
npm install swiper              # For carousel
npm install react-icons         # For icons (HeartIcon, StarIcon, etc.)
npm install axios               # Already likely installed
```

### **STEP 2: Create Types & Constants**
**Files to create:**
- `src/types/product.ts` - Product type definitions
- `src/types/index.ts` - Export all types
- `src/utils/constants.ts` - Navigation links, category names
- `src/utils/cn.ts` - Class name utility
- `src/api/types.ts` - API response shapes

### **STEP 3: Setup API Layer**
**Files to create:**
- `src/api/products.ts` - Product API functions
- `src/api/categories.ts` - Category API functions
- `src/api/site-config.ts` - Config API functions

### **STEP 4: Global Components (Top Priority)**
**Files to create (in order):**
1. `src/components/ui/Button.tsx` - Base button component
2. `src/components/ui/Input.tsx` - Input field
3. `src/components/ui/Badge.tsx` - Rating/status badge
4. `src/components/common/CartIcon.tsx` - Shopping cart
5. `src/components/layout/Navigation.tsx` - Header navbar

### **STEP 5: Reusable Components**
**Files to create:**
1. `src/components/ui/ProductCard.tsx` - Product card for grid/carousel
2. `src/components/ui/Carousel.tsx` - Swiper carousel wrapper
3. `src/components/common/SearchBar.tsx` - Search input
4. `src/components/common/UserMenu.tsx` - Account dropdown

### **STEP 6: Homepage-Specific Sections**
**Files to create (in order):**
1. `src/components/home/HeroSection.tsx`
2. `src/components/home/FeaturedCarousel.tsx`
3. `src/components/home/HowItWorks.tsx`
4. `src/components/home/BenefitsSection.tsx`
5. `src/components/home/CustomBouquetSection.tsx`
6. `src/components/home/NewsletterSignup.tsx`

### **STEP 7: Layout Components**
**Files to create:**
1. `src/components/layout/Footer.tsx`
2. `src/components/layout/Layout.tsx` - Wrapper with Nav + Footer

### **STEP 8: State Management**
**Files to create:**
1. `src/store/context/CartContext.tsx`
2. `src/store/context/AuthContext.tsx`
3. `src/store/hooks.ts`

### **STEP 9: Main Page**
**Files to create:**
1. `src/pages/HomePage.tsx` - Combines all sections
2. Update `src/App.tsx` - Route to HomePage

### **STEP 10: Styling & Polish**
- Create `src/styles/home.css` for custom styles
- Create `src/styles/animations.css` for hover, scroll effects
- Responsive design tweaks
- Performance optimization

---

## 📊 DATA FLOW DIAGRAM

```
HomePage.tsx
├── Navigation (global)
│   └── useAuth() → Auth context
│
├── HeroSection (static)
│
├── FeaturedCarousel
│   ├── useProducts() hook
│   │   └── GET /api/products → Featured products
│   └── ProductCard component (multiple)
│       └── addToCart() fn
│
├── HowItWorks (static SVGs + text)
│
├── BenefitsSection (static)
│
├── CustomBouquetSection (static with CTAs)
│
├── NewsletterSignup (optional)
│   └── POST /api/newsletter/subscribe
│
└── Footer (global)
```

---

## 🔌 API ENDPOINTS REQUIRED

### **For Homepage**
```javascript
// Get featured/all products
GET /api/products
  Query params: 
    - limit=8 (for carousel)
    - featured=true (optional)
  Response: { items: Product[], total: number }

// Get all categories (for footer/nav)
GET /api/categories
  Response: { items: Category[], total: number }

// Get site configuration (texts, settings)
GET /api/site-config
  Response: { heroText, navLinks, footerLinks, ... }

// Create order / add to cart (handled later, but setup the function now)
POST /api/orders
  Body: { items: CartItem[], ... }
  Response: { orderId, ... }

// Newsletter signup (optional)
POST /api/newsletter/subscribe
  Body: { email }
  Response: { success: boolean }
```

---

## 🎨 STYLING APPROACH

### **Tailwind CSS Classes Used:**

**Color Palette (infer from website):**
- Primary: Red/Pink tones → `text-red-600`, `bg-red-50`
- Accent: Green/nature → `text-green-600`
- Neutral: Grays → `text-gray-700`, `bg-gray-100`
- Text: Dark gray/black → `text-gray-900`, `text-gray-700`

**Typography:**
- Headers: `font-serif` or `font-bold text-3xl`
- Body: `font-sans text-base leading-relaxed`

**Spacing (Tailwind scale):**
- Sections: `py-16 px-4 md:px-8 lg:px-12`
- Cards: `p-6 gap-4`

**Responsive Breakpoints:**
- Mobile: `block md:hidden`
- Tablet: `hidden md:grid md:grid-cols-2`
- Desktop: `hidden lg:grid lg:grid-cols-3`

**Components with Tailwind:**
- Button: `bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg`
- Card: `bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition`
- Input: `border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-red-600`

---

## 🚀 IMPLEMENTATION STEPS (DETAILED)

### **STEP 1: Dependencies** (5 minutes)
```bash
cd frontend
npm install classnames swiper react-icons
```

### **STEP 2: Types & Constants** (15 minutes)
Create type definitions and app constants

### **STEP 3: API Layer** (20 minutes)
Create API service functions for products, categories

### **STEP 4: Build Global Components** (1-2 hours)
- Button.tsx
- Navigation.tsx
- ProductCard.tsx

### **STEP 5: Build Home Sections** (3-4 hours)
- HeroSection
- FeaturedCarousel
- HowItWorks
- BenefitsSection
- CustomBouquetSection

### **STEP 6: Build Layout** (30 minutes)
- Footer.tsx
- Layout.tsx wrapper

### **STEP 7: State Management** (1 hour)
- CartContext
- useCart hook
- AuthContext

### **STEP 8: Assembly** (30 minutes)
- HomePage.tsx combines all sections
- Update App.tsx with routing

### **STEP 9: Styling & Responsive** (1-2 hours)
- Fine-tune Tailwind classes
- Mobile responsive optimizations
- CSS animations/transitions

### **STEP 10: Testing & Polish** (1 hour)
- Test API integration
- Test responsive design
- Fix layout issues
- Performance check

---

## 📋 DETAILED COMPONENT CHECKLIST

### **Navigation.tsx**
- [ ] Logo clickable (links home)
- [ ] Search bar with icon
- [ ] Category dropdown
- [ ] User avatar/menu (if auth)
- [ ] Cart icon with count badge
- [ ] Mobile hamburger menu
- [ ] Sticky on scroll
- [ ] Responsive collapse

### **HeroSection.tsx**
- [ ] Background image/gradient
- [ ] Main headline (centered)
- [ ] Subheading
- [ ] Two CTA buttons (Shop Now, Learn More)
- [ ] Hero image (flower image right side)
- [ ] Responsive text sizing
- [ ] Parallax effect (optional)

### **FeaturedCarousel.tsx**
- [ ] Heading + subtitle
- [ ] Carousel with Swiper
- [ ] 8 ProductCards inside
- [ ] Previous/Next buttons
- [ ] Dot indicators
- [ ] Auto-scroll (optional)
- [ ] Mobile responsive (1 column)
- [ ] Tablet (2 columns)
- [ ] Desktop (4 columns)

### **ProductCard.tsx**
- [ ] Product image (rounded corners)
- [ ] Product name/title
- [ ] Price formatted ($XX.00)
- [ ] Star rating display
- [ ] Review count
- [ ] Add to cart button
- [ ] Quick view link
- [ ] Hover effects (shadow, scale)
- [ ] "New" or "Best Seller" badge

### **HowItWorks.tsx**
- [ ] Section heading
- [ ] 7 steps displayed vertically (mobile) / horizontally (desktop)
- [ ] Step icon (SVG or react-icons)
- [ ] Step number circle
- [ ] Short title per step
- [ ] Brief description
- [ ] Connecting lines between steps
- [ ] CTA button to detailed page

### **BenefitsSection.tsx**
- [ ] 3 columns (mobile: 1, tablet: 1.5, desktop: 3)
- [ ] For each column:
  - [ ] Icon (SVG)
  - [ ] Heading
  - [ ] 4 bullet points with icons/text
  - [ ] Link to detailed page

### **CustomBouquetSection.tsx**
- [ ] Section heading
- [ ] 2 cards side-by-side (stack on mobile)
- [ ] Card 1: "Sender's Choice"
  - [ ] Image
  - [ ] Title
  - [ ] Description
  - [ ] CTA button
- [ ] Card 2: "Recipient's Choice"
  - [ ] Image
  - [ ] Title
  - [ ] Description
  - [ ] CTA button
- [ ] Supporting text below

### **Footer.tsx**
- [ ] Logo
- [ ] 4 Link columns:
  - SHOP (6-8 links)
  - COMPANY (6-7 links)
  - USES (8-10 links)
  - FOLLOW (social media icons)
- [ ] Social media links (working href)
- [ ] Copyright text
- [ ] Legal links (Privacy, Terms)
- [ ] Responsive (stack on mobile)

---

## 🛠️ KEY FEATURES TO BUILD IN

### **Cart System**
- Add to cart from product cards
- Cart count badge updates
- Persist cart to localStorage
- Cart context for global state

### **Navigation Links**
- Home (/)
- Categories (dynamic routes)
- Login / Sign up
- Account (if logged in)
- Cart page

### **Search (Basic)**
- Search icon in nav
- Modal or page for search results (Phase 2)

### **Responsive Design**
- Mobile-first approach
- Breakpoints: 640px, 768px, 1024px
- Touch-friendly buttons (48px+ minimum)
- Readable text on all devices

### **Performance**
- Lazy load images
- Optimize images (next/image or native lazy load)
- Code splitting for sections
- Memoize ProductCard components

---

## 📱 RESPONSIVE BREAKPOINTS

```
Mobile First (320px-639px)
├── Single column layouts
├── Stacked sections
├── Hamburger menu (Navigation)
└── Touch-optimized buttons

Tablet (640px-1023px)
├── 2-column grids
├── Carousel: 2 items visible
├── Side-by-side benefit cards
└── Full navigation bar

Desktop (1024px+)
├── 3-4 column grids
├── Carousel: 4 items visible
├── Full layout with sidebar space
└── Perfect typography
```

---

## 🎬 ANIMATIONS & INTERACTIONS

### **Hover Effects**
- Cards: `hover:shadow-lg hover:scale-105 transition`
- Buttons: `hover:bg-darker-red transition`
- Links: `hover:text-red-600 transition`

### **Scroll Animations** (optional, use AOS library)
- Sections fade in on scroll
- Cards slide in staggered
- Icons animate on view

### **Loading States**
- Skeleton loaders for products
- Loading spinner while fetching
- Error states with retry button

### **Transitions**
- Page transitions (React Router)
- Modal open/close
- Dropdown menus

---

## ✅ TESTING CHECKLIST

- [ ] All API calls work correctly
- [ ] Products load and display
- [ ] Add to cart works
- [ ] Cart count updates
- [ ] Responsive on mobile (iPhone 12)
- [ ] Responsive on tablet (iPad)
- [ ] Responsive on desktop (1920px)
- [ ] Navigation links work
- [ ] Search bar focuses/types
- [ ] Error handling for API failures
- [ ] Loading states appear correctly
- [ ] Images load and display properly
- [ ] Prices format correctly
- [ ] Ratings display correctly
- [ ] CTA buttons navigate correctly

---

## 🎯 SUCCESS CRITERIA

✅ **Homepage should:**
1. Visually match https://www.socialflowers.com/
2. Load and display real products from backend
3. Add items to cart (cart count updates)
4. Navigate to other pages (How It Works, About, etc.)
5. Be fully responsive (mobile, tablet, desktop)
6. Have proper loading states
7. Handle API errors gracefully
8. Have smooth animations/transitions
9. Load in < 3 seconds (including API calls)
10. Pass accessibility checks (color contrast, alt text)

---

## 📝 NOTES

- Start with **static content** (Hero, Benefits, How It Works)
- Then integrate **dynamic content** (Featured Products)
- Finally add **interactions** (Cart, Auth)
- Always test responsive design as you build
- Keep components small and focused
- Reuse components (ProductCard, Button, etc.)
- Use Tailwind for all styling (no custom CSS initially)

---

**Ready to start executing? Let me know which step you want to begin with!**

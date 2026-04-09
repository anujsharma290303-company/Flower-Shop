# Social Flowers - Frontend to Backend Mapping

**Status Date:** April 9, 2026  
**Cloning from:** https://www.socialflowers.com/

---

## 📋 Executive Summary

This document maps all Social Flowers frontend pages to their required backend endpoints. Your backend infrastructure is **90% complete** with routes for products, orders, users, payments, and more. The primary focus is building the frontend UI components in React/TypeScript.

---

## 🏠 HOMEPAGE STRUCTURE

### Page: `/` (Homepage)
**Location:** `frontend/src/pages/HomePage.tsx`

**Components & Sections:**
```
├── Navigation Bar (global)
│   ├── Logo + Home link
│   ├── Search bar
│   ├── Category navigation
│   ├── Sign In / Account dropdown
│   └── Cart icon (count badge)
├── Hero Section
│   ├── Main headline + tagline
│   ├── CTA buttons ("Shop Now", "Learn More")
│   └── Hero image
├── Featured Products Carousel
│   ├── 6-8 featured bouquets
│   ├── Product cards (image, name, price)
│   └── "Add to Cart" buttons
├── "How It Works" Section
│   ├── 7-step visual guide
│   ├── Icons + descriptions
│   └── CTA to detailed page
├── Benefits Section
│   ├── Cards: For Everyone, For Senders, For Recipients
│   ├── Icons, headings, descriptions
│   └── Links to detailed pages
├── Custom Bouquet CTAs
│   ├── "Sender's Choice" card
│   ├── "Recipient's Choice" card
│   └── Links to builders
├── Footer
│   ├── Links (Shop categories, Company, Uses)
│   ├── Social media icons
│   ├── Newsletter signup
│   └── Copyright
```

**Backend Endpoints Required:**
```
GET /api/products
  → Returns: [featured products with images, prices, descriptions]
  
GET /api/categories
  → Returns: [all product categories with images]
  
GET /api/site-config
  → Returns: {branding, hero_text, site_settings}
```

---

## 🛍️ PRODUCT PAGES

### Page: `/best-sellers/`, `/romance-flowers/`, `/roses/`, etc.
**Location:** `frontend/src/pages/ProductCategoryPage.tsx` (dynamic)

**Component Structure:**
```
├── Category Header
│   ├── Category image/banner
│   ├── Category title & description
│   └── Breadcrumb navigation
├── Filters Sidebar
│   ├── Price range slider
│   ├── Flower type checkbox list
│   ├── Occasion filter
│   └── Sort dropdown (price, rating, newest)
├── Product Grid
│   ├── Product cards (4 columns)
│   │   ├── Product image
│   │   ├── Product name
│   │   ├── Price
│   │   ├── Rating/review count
│   │   ├── Quick view button
│   │   └── Add to cart button
│   └── Pagination
└── Sidebar
    ├── Featured bouquets
    ├── Best sellers this week
    └── Related content
```

**Backend Endpoints Required:**
```
GET /api/products?category={slug}&page=1&limit=12
  → Returns: {items: [...], total, pages, currentPage}
  
GET /api/products?category={slug}&minPrice=50&maxPrice=200
  → Returns: [filtered products]
  
GET /api/products?search={query}
  → Returns: [matching products]
  
GET /api/categories
  → Returns: [all categories with slugs]
  
GET /api/products/{id}/reviews?limit=5
  → Returns: [review stats, recent reviews]
```

---

## 🌹 PRODUCT DETAIL PAGE

### Page: `/item/{itemCode}/{product-name}`
**Location:** `frontend/src/pages/ProductDetailPage.tsx`

**Component Structure:**
```
├── Breadcrumb Navigation
├── Main Content (2 columns)
│   ├── Left Column: Image Gallery
│   │   ├── Large main image
│   │   ├── Thumbnail strip (5-6 images)
│   │   └── Image zoom on hover
│   └── Right Column: Product Info
│       ├── Product title
│       ├── Price display ($XX.00)
│       ├── Rating stars + review count
│       ├── Product description (long form)
│       ├── Flower composition list
│       │   └── e.g., "Includes: 12 Red Roses, 5 White Lilies..."
│       ├── Occasion tags
│       ├── Stock status
│       ├── "Add to Cart" button (large, prominent)
│       ├── "Save to Wishlist" button/icon
│       └── Share buttons (social media)
├── Reviews Section
│   ├── Average rating + count
│   ├── Rating distribution bar
│   ├── "Write a Review" button
│   ├── Review list filter/sort
│   └── Individual review cards
│       ├── Reviewer name/avatar
│       ├── Rating stars
│       ├── Review title & text
│       ├── Review date
│       ├── "Helpful?" vote buttons
│       └── Photo from review (if available)
├── Related Products Section
│   ├── 4-6 related product cards
│   └── Carousel/grid layout
└── "Frequently Bought Together" Section
    ├── Bundle recommendation
    └── Quick add options
```

**Backend Endpoints Required:**
```
GET /api/products/{itemCode}
  → Returns: {id, name, price, description, images, composition, 
              occasion, inStock, rating, reviewCount}
  
GET /api/products/{id}/reviews?limit=10&sort=helpful
  → Returns: [{id, rating, title, text, author, date, photo, helpful}]
  
GET /api/products/{id}/related
  → Returns: [5-6 similar products]
  
POST /api/wishlists/add/{productId}
  → Requires: Authentication (optional)
  
GET /api/reviews/{id}
  → Returns: single review with images
```

---

## 🎁 CUSTOM BOUQUET BUILDER PAGES

### Page 1: `/create-a-bouquet/` (Sender's Choice)
**Location:** `frontend/src/pages/CustomBouquetBuilderPage.tsx`

**Component Structure:**
```
├── Header Section
│   ├── Step indicator (1, 2, 3)
│   └── "Save as you go" indicator
├── Step 1: Choose Flowers
│   ├── Flower type multi-select
│   │   ├── Roses, Lilies, Sunflowers, Carnations, etc.
│   │   └── Each with image + description
│   ├── Color selection (visual palette)
│   │   ├── Red, Pink, White, Yellow, Orange, Purple
│   │   └── Mix & match
│   ├── Quantity slider for each flower
│   └── Price updates in real-time
├── Step 2: Arrangement Details
│   ├── Vase type selection
│   ├── Arrangement size (small, medium, large)
│   ├── Greenery & fillers options
│   ├── Add personalization text/tags
│   └── Preview updates
├── Step 3: Set Price & Add to Cart
│   ├── Suggested price range
│   ├── Custom price input
│   ├── Price summary breakdown
│   ├── "Add to Cart" button
│   └── "Save Bouquet" option (for later)
└── Live Preview Panel
    ├── Real-time bouquet preview image
    ├── Selected flowers list
    └── Total price display
```

**Backend Endpoints Required:**
```
GET /api/custom-bouquets/config
  → Returns: {flowers: [...], colors: [...], vases: [...]}
  
GET /api/custom-bouquets/calculate-price
  → POST body: {flowers: [{type, qty, color}], vaseType, size}
  → Returns: {basePrice, suggestedPrice, totalPrice}
  
POST /api/custom-bouquets
  → Creates custom bouquet in database
  → Returns: {id, bouquetData, previewImage}
  
POST /api/cart/add
  → Adds custom bouquet to cart
  → Returns: {cartId, itemCount, subtotal}
```

### Page 2: `/let-recipient-choose-flowers/` (Recipient's Choice)
**Similar structure but with:**
- Price range slider (sender sets budget)
- Notes field for sender to recipient
- No specific flower selection
- Recipient will choose flowers later
- Link generation to share with recipient

**Backend Endpoints Required:**
```
POST /api/custom-bouquets/recipient-choice
  → Creates recipient-choice bouquet template
  → Returns: {id, recipientChoiceToken, budgetRange}
```

---

## 🛒 SHOPPING CART PAGE

### Page: `/cart/` (implicit)
**Location:** `frontend/src/pages/CartPage.tsx`

**Component Structure:**
```
├── Cart Header
│   ├── "Shopping Cart" title
│   ├── Item count
│   └── "Continue Shopping" button
├── Cart Items List
│   ├── For each item:
│   │   ├── Product image (thumbnail)
│   │   ├── Product name + details
│   │   ├── Price per unit
│   │   ├── Quantity selector (increment/decrement)
│   │   ├── Line total
│   │   ├── "Save for Later" button
│   │   └── Remove button (X icon)
│   └── Empty cart state
├── Suggested Products Sidebar
│   ├── "Frequently bought together"
│   ├── Product cards
│   └── Quick add buttons
├── Order Summary
│   ├── Subtotal
│   ├── Tax (if applicable)
│   ├── Shipping (info)
│   ├── Total price (prominent)
│   └── "Proceed to Checkout" button
└── Footer
    ├── Continue shopping link
    ├── Apply promo code (if available)
    └── Guarantee badge
```

**Backend Endpoints Required:**
```
GET /api/cart
  → Returns: {items: [...], subtotal, tax, total}
  
PUT /api/cart/{itemId}
  → body: {quantity}
  → Returns: updated cart
  
DELETE /api/cart/{itemId}
  → Returns: updated cart
  
POST /api/cart/validate
  → Validates all items before checkout
  → Returns: {valid: boolean, errors: [...]}
```

---

## 💳 CHECKOUT FLOW

### Page: `/checkout/` (Multi-step form)
**Location:** `frontend/src/pages/CheckoutPage.tsx`

**Step 1: Recipient Information**
```
├── How do they want to send flowers?
│   ├── ☐ Email address
│   ├── ☐ Phone number
│   ├── ☐ Social media handle
│   └── ☐ I have their address (skip to Step 3)
├── Recipient Email Input (if selected)
│   └── Validate format
├── Recipient Phone Input (if selected)
│   └── US phone format validation
├── Recipient Social Handle Input (if selected)
│   ├── Social platform selector
│   ├── Handle/username input
│   └── Important note: "Can contact them via DM"
├── Recipient Name (optional)
├── Optional Gift Message
│   └── Text area (max 500 characters)
└── Next button
```

**Step 2: Delivery Options**
```
├── How should flowers be delivered?
│   ├── ☐ Recipient chooses (they get address prompt)
│   ├── ☐ I'll provide the address
│   └── ☐ Send to hospital/workplace/special location
├── If "Recipient chooses":
│   ├── "Recipient will receive a link..."
│   └── Next button
├── If "I'll provide address":
│   ├── Address input form
│   │   ├── Street address
│   │   ├── City
│   │   ├── State
│   │   ├── ZIP code
│   │   └── Validate address with maps API
│   ├── Delivery date picker
│   │   └── Calendar widget (unavailable dates greyed out)
│   ├── Delivery instructions (optional)
│   └── Next button
├── Address validation error messages
└── Map preview of delivery area
```

**Step 3: Billing Information**
```
├── Billing address (same as delivery / different)
├── Full name
├── Email address
├── Phone number
├── Payment method selection
│   ├── ☐ Credit/Debit Card
│   └── ☐ Cryptocurrency (if enabled)
├── If Credit Card:
│   ├── Card number (PCI compliance)
│   ├── Expiration date
│   ├── CVV
│   └── Cardholder name
├── If Cryptocurrency:
│   ├── Select cryptocurrency (BTC, ETH, etc.)
│   ├── Amount display
│   ├── Wallet address
│   └── QR code for payment
├── Promo/coupon code field (optional)
│   └── Apply button
└── Next button
```

**Step 4: Review & Confirm**
```
├── Order Summary
│   ├── Items recap
│   ├── Prices breakdown
│   ├── Recipient info recap
│   ├── Delivery info recap
│   └── Total amount (prominent)
├── Edit buttons for each section
├── Terms & conditions checkbox
│   └── "I agree to..."
├── "Place Order" button (large, prominent)
└── Estimated processing message
```

**Backend Endpoints Required:**
```
POST /api/orders
  → Creates order with recipient info
  → body: {cartItems, recipientInfo, deliveryInfo, billingInfo}
  → Returns: {orderId, recipientToken, "youveGotFlowersLink"}
  
POST /api/payments
  → Processes Stripe/card payment
  → body: {orderId, paymentMethod, amount}
  → Returns: {success, transactionId, receiptUrl}
  
POST /api/payments/crypto
  → Initiates crypto payment
  → body: {orderId, cryptoType, amount}
  → Returns: {walletAddress, qrCode, amount}
  
GET /api/delivery/available-dates
  → Returns: {availableDates: [...], blackoutDates: [...]}
  
POST /api/notifications/send-acceptance-link
  → Sends email/SMS with "You've Got Flowers" link
  → body: {recipientInfo, message, flowersLink}
  → Returns: {sent: boolean, method: 'email'|'sms'|'both'}
  
POST /api/orders/{id}/validate
  → Validates entire order before payment
  → Returns: {valid: boolean, errors: [...]}
```

---

## 📬 RECIPIENT ACCEPTANCE PAGE

### Page: `/flowers/:recipientToken/` (Dynamic, public link)
**Location:** `frontend/src/pages/RecipientAcceptancePage.tsx`

**Component Structure:**
```
├── Header
│   ├── "You've Got Flowers!" headline
│   ├── Sender name (or "Anonymous" / "Secret Admirer")
│   └── Emotional subheading
├── Bouquet Preview
│   ├── Large bouquet image
│   ├── Bouquet title
│   ├── Price display (optional)
│   └── Detailed composition list
├── Message from Sender (if provided)
│   ├── Quoted/highlighted message text
│   └── Sender name credit
├── Acceptance Form
│   ├── Section 1: Choose Delivery Address
│   │   ├── Option A: "Provide my address"
│   │   │   ├── Address input form
│   │   │   ├── Map preview
│   │   │   └── Address validation
│   │   ├── Option B: "Deliver to my work"
│   │   │   └── Work address input
│   │   └── Option C: "Other location"
│   │       └── Special delivery options
│   ├── Section 2: Choose Delivery Date
│   │   ├── Calendar widget
│   │   ├── Unavailable dates greyed out
│   │   ├── Special delivery instructions
│   │   └── Time window (if available)
│   ├── Section 3: Optional Message Back
│   │   ├── Text area
│   │   └── "Will be shared with sender"
│   ├── Privacy Notice
│   │   └── "Your address will only be used for delivery"
│   └── Buttons
│       ├── "Accept Flowers" button (primary, large)
│       ├── "Decline Flowers" link
│       └── Questions? Link to FAQ
├── Decline Confirmation (modal)
│   ├── "Are you sure?"
│   ├── Impact message
│   ├── Reason dropdown (optional)
│   └── Confirm / Cancel buttons
└── Success State
    ├── "Thank you!"
    ├── Confirmation details
    ├── Next steps
    └── Share flowers link
```

**Backend Endpoints Required:**
```
GET /api/recipients/:token
  → Returns: {orderId, bouquetInfo, sender, message, expiresAt}
  
POST /api/recipients/:token/accept
  → body: {deliveryAddress, deliveryDate, message}
  → Returns: {success: true, confirmationId, estimatedDeliveryDate}
  
POST /api/recipients/:token/decline
  → Returns: {success: true, refund info if applicable}
  
GET /api/delivery/available-dates
  → Returns: {availableDates, blackoutDates}
  
POST /api/addresses/validate
  → body: {street, city, state, zip}
  → Returns: {valid: boolean, suggestedAddress}
```

---

## 📸 SHARE PHOTOS/VIDEOS PAGE

### Page: `/flowers/:orderId/share/` (After delivery)
**Location:** `frontend/src/pages/ShareFlowersPage.tsx`

**Component Structure:**
```
├── Header
│   ├── "Share Your Flowers!" headline
│   ├── Credit amount display (e.g., "Earn up to $50")
│   └── Explanation text
├── Upload Section
│   ├── Drag & drop zone (photos/videos)
│   │   └── Or "Browse files" button
│   ├── Preview of uploaded media
│   ├── Media editing options
│   │   ├── Crop tool
│   │   ├── Filter options
│   │   └── Add stickers/text
│   └── Caption input field
├── Sharing Options (tabs)
│   ├── Tab 1: "Share to Social Media"
│   │   ├── Platform selector
│   │   │   ├── ☐ Instagram
│   │   │   ├── ☐ Facebook
│   │   │   ├── ☐ TikTok
│   │   │   ├── ☐ Twitter
│   │   │   └── ☐ OnlyFans (if applicable)
│   │   ├── Tag instruction
│   │   │   └── "Include #SocialFlowers to earn credits"
│   │   ├── Share button
│   │   └── Copy hashtag button
│   └── Tab 2: "Share With Sender"
│       ├── Share type selector
│       │   ├── ☐ Photo/Video of flowers ($10-30)
│       │   ├── ☐ Photo/Video with you ($40-50)
│       │   └── ☐ Use for promotion ($20)
│       ├── Preview of credit amounts
│       ├── Share button
│       └── Link copy button
├── Credit Information
│   ├── Credit breakdown table
│   │   ├── "Just flowers photo" → $30
│   │   ├── "Flowers + you photo" → $40
│   │   ├── "Flowers + you video" → $50
│   │   └── "With sender + promo" → $20
│   ├── "How credits work" link
│   └── Credit application timeline
├── Helpful Tips
│   ├── Photography tips
│   ├── Lighting suggestions
│   └── Sample photos gallery
└── Skip / Done buttons
```

**Backend Endpoints Required:**
```
POST /api/orders/{id}/media/upload
  → body: FormData with media file
  → Returns: {mediaId, url, uploadedAt}
  
POST /api/orders/{id}/media/share
  → body: {mediaId, platforms: [...], withSender: boolean, forPromo: boolean}
  → Returns: {shareLinks: {...}, creditsAwarded: amount}
  
GET /api/credits/calculate
  → body: {contentType, shareMethod, platforms}
  → Returns: {credits: amount, breakdown}
  
POST /api/credits/award
  → Awards credits to both sender and recipient
  → body: {orderId, senderId, recipientId, amount}
  → Returns: {success, newBalances}
  
GET /api/orders/{id}/sharing-options
  → Returns: {availablePlatforms, creditAmounts}
```

---

## 👤 USER ACCOUNT PAGES

### Page 1: `/sign-up/`
**Location:** `frontend/src/pages/SignUpPage.tsx`

```
├── Header
│   ├── "Create Your Account"
│   └── "Already have an account? Sign in"
├── Form
│   ├── First name input
│   ├── Last name input
│   ├── Email input
│   │   └── Validation & uniqueness check
│   ├── Password input
│   │   └── Strength indicator
│   ├── Confirm password input
│   ├── Phone number input (optional)
│   ├── Newsletter checkbox
│   ├── Terms & conditions checkbox
│   ├── Sign up button
│   └── Social sign-up options (Google, Facebook)
├── Email verification (if needed)
│   └── Verification code input
└── Success redirect to dashboard
```

**Backend Endpoints Required:**
```
POST /api/auth/signup
  → body: {email, password, firstName, lastName, phone}
  → Returns: {userId, token, refreshToken}
  
POST /api/auth/verify-email
  → body: {email, verificationCode}
  → Returns: {success: boolean}
  
GET /api/auth/check-email
  → query: {email}
  → Returns: {exists: boolean}
```

### Page 2: `/sign-in/`
**Location:** `frontend/src/pages/SignInPage.tsx`

```
├── Header
│   ├── "Sign In"
│   └── "New here? Create account"
├── Form
│   ├── Email input
│   ├── Password input
│   ├── "Remember me" checkbox
│   ├── "Forgot password?" link
│   ├── Sign in button
│   └── Social sign-in options
├── Validation errors display
└── Success redirect to dashboard
```

**Backend Endpoints Required:**
```
POST /api/auth/login
  → body: {email, password}
  → Returns: {userId, token, refreshToken, user}
  
POST /api/auth/refresh-token
  → body: {refreshToken}
  → Returns: {token}
```

### Page 3: `/account/` (Dashboard)
**Location:** `frontend/src/pages/AccountDashboard.tsx`

**Tabs/Sections:**
```
├── Profile Tab
│   ├── User info display/edit
│   │   ├── Name
│   │   ├── Email
│   │   ├── Phone
│   │   ├── Profile picture
│   │   └── Save changes button
│   ├── Password change form
│   │   ├── Current password
│   │   ├── New password
│   │   ├── Confirm password
│   │   └── Update button
│   └── Notification preferences
│       ├── Email notifications checkboxes
│       ├── SMS notifications
│       └── Save preferences
├── Order History Tab
│   ├── Sent Orders
│   │   └── Table/cards with:
│   │       ├── Bouquet name
│   │       ├── Recipient info (masked)
│   │       ├── Order date
│   │       ├── Status
│   │       ├── Amount
│   │       └── View details / Track / Share link buttons
│   └── Received Orders (if applicable)
│       └── Similar structure
├── Credits Tab
│   ├── Current credit balance (prominent display)
│   ├── Credit history table
│   │   ├── Date
│   │   ├── Type (earned/spent)
│   │   ├── Amount
│   │   ├── Related order/action
│   │   └── Expiration date
│   ├── How to earn credits info
│   └── Apply credits to order link
├── Wishlist Tab
│   ├── Saved bouquets grid
│   ├── "Create new wishlist" button
│   ├── Wishlist cards with:
│   │   ├── Wishlist name
│   │   ├── Item count
│   │   ├── Share button (public link)
│   │   ├── Edit button
│   │   └── Delete button
│   └── Wishlist details modal
│       ├── Items in wishlist
│       ├── Share link copy
│       ├── Add to cart
│       └── Remove items
├── Address Book Tab
│   ├── Saved addresses list
│   ├── "Add new address" button
│   ├── Edit/delete buttons per address
│   └── "Default delivery" selector
└── Account Settings Tab
    ├── Two-factor authentication toggle
    ├── Privacy settings
    ├── Download my data link
    ├── Delete account button (destructive)
    └── Logout button
```

**Backend Endpoints Required:**
```
GET /api/users/me
  → Returns: {id, name, email, phone, avatar, createdAt}
  → Requires: Authentication
  
PUT /api/users/me
  → body: {firstName, lastName, phone, profilePicture}
  → Returns: updated user object
  → Requires: Authentication
  
POST /api/auth/change-password
  → body: {currentPassword, newPassword}
  → Returns: {success}
  → Requires: Authentication
  
GET /api/orders?userId={id}
  → Returns: {items: [...], total, pagination}
  → Requires: Authentication
  
GET /api/credits/balance
  → Returns: {balance, history: [...]}
  → Requires: Authentication
  
GET /api/wishlists
  → Returns: [all user wishlists]
  → Requires: Authentication
  
PUT /api/wishlists/{id}
  → body: {name, description, isPublic}
  → Returns: updated wishlist
  
GET /api/addresses
  → Returns: [saved addresses]
  → Requires: Authentication
  
POST /api/addresses
  → Creates new saved address
  → Returns: {id, address}
  
PUT /api/addresses/{id}
  → Updates address
  
DELETE /api/addresses/{id}
  → Deletes address
```

---

## ℹ️ INFORMATIONAL PAGES

### Pages: `/how-it-works/`, `/about/`, `/faq/`, `/blog/`
**Location:** 
- `frontend/src/pages/HowItWorksPage.tsx`
- `frontend/src/pages/AboutPage.tsx`
- `frontend/src/pages/FAQPage.tsx`
- `frontend/src/pages/BlogPage.tsx`

**These are mostly static content pages with:**
- Hero section
- Content sections
- CTAs to shop/sign up
- Footer navigation

**Backend Endpoints Required:**
```
GET /api/site-config
  → Returns: {howItWorks, about, companyInfo, policies}
  
GET /api/faqs
  → Returns: [all FAQs grouped by category]
  
GET /api/blog/posts
  → Returns: {items: [...], total, pagination}
  
GET /api/blog/posts/{slug}
  → Returns: detailed blog post
  
GET /api/blog/posts?category={slug}
  → Returns: [posts in category]
```

### Page: `/contact/`
**Location:** `frontend/src/pages/ContactPage.tsx`

```
├── Header
│   ├── "Contact Us"
│   └── Contact options info
├── Contact Form
│   ├── Name input
│   ├── Email input
│   ├── Subject selector
│   │   ├── General inquiry
│   │   ├── Order issue
│   │   ├── Bug report
│   │   └── Partnership
│   ├── Message textarea
│   ├── Attachment upload (optional)
│   └── Submit button
├── Success message
└── Contact Info Section
    ├── Email address
    ├── Phone number
    ├── Social media links
    ├── Address (if applicable)
    └── Business hours
```

**Backend Endpoints Required:**
```
POST /api/contact/submit
  → body: {name, email, subject, message, attachment}
  → Returns: {success, confirmationId}
  
POST /api/contact/submit-attachment
  → Multipart form with file
  → Returns: {fileUrl}
```

---

## 🎁 WISHLIST PAGES

### Page 1: `/wishlist/` (My Wishlists)
**Location:** `frontend/src/pages/WishlistsPage.tsx`

```
├── Header
│   ├── "My Wishlists"
│   └── "Create new wishlist" button
├── Wishlists Grid
│   ├── Wishlist cards
│   │   ├── Wishlist cover image (from first item)
│   │   ├── Name
│   │   ├── Item count
│   │   ├── Created date
│   │   ├── Share button
│   │   ├── Edit button
│   │   └── Delete button
│   └── Empty state
└── Create Modal
    ├── Name input
    ├── Description textarea
    ├── Privacy toggle (public/private)
    └── Create button
```

### Page 2: `/wishlist/{id}/public` (Share View)
**Location:** `frontend/src/pages/PublicWishlistPage.tsx`

```
├── Header
│   ├── Creator name
│   ├── Wishlist title
│   ├── Description
│   ├── Share buttons
│   └── Item count
├── Items Grid
│   ├── Product cards
│   │   ├── Image
│   │   ├── Name
│   │   ├── Price
│   │   └── "Send These Flowers" button
│   └── Pagination
└── Creator info (if public profile)
    ├── Avatar
    ├── Name
    ├── Bio
    └── Other wishlists link
```

**Backend Endpoints Required:**
```
GET /api/wishlists
  → Returns: [user's wishlists]
  → Requires: Authentication
  
POST /api/wishlists
  → Creates new wishlist
  → Returns: {id, ...wishlist}
  
GET /api/wishlists/{id}
  → Returns: {id, name, items, isPublic, owner}
  
GET /api/wishlists/{id}/public
  → Returns: public wishlist data
  → Does NOT require auth
  
PUT /api/wishlists/{id}
  → Updates wishlist
  
DELETE /api/wishlists/{id}
  → Deletes wishlist
  
POST /api/wishlists/{id}/items
  → Adds product to wishlist
  → Returns: updated wishlist
  
DELETE /api/wishlists/{id}/items/{itemId}
  → Removes product from wishlist
  
POST /api/wishlists/{id}/share
  → Generates share link
  → Returns: {shareUrl, shareCode}
```

---

## 🌐 SPECIALIZED USE-CASE PAGES

### Pages (Static with CTAs to shop):
- `/dating/` - For romantic gestures
- `/hospital/` - Send to hospitals
- `/funeral-home/` - Sympathy flowers
- `/workplace/` - Office/coworker flowers
- `/social-media/` - Content creator wishlists
- `/crypto/` - Cryptocurrency payment info
- `/anonymously/` - Anonymous delivery info

**These pages mostly contain:**
- Use case explanation
- Visual examples
- FAQs for that use case
- CTAs ("Shop Now")

**Backend Endpoints Required:**
```
GET /api/site-config
  → For all use-case specific content
```

---

## 📊 ADMIN PAGES (Secondary - Not Required for MVP)

**Note:** Your backend has admin routes prepared. For MVP, focus on customer-facing pages above.

Admin pages available:
- `/admin/dashboard/` - Overview
- `/admin/orders/` - Order management
- `/admin/products/` - Product management
- `/admin/users/` - User management
- `/admin/payments/` - Payment tracking
- `/admin/reports/` - Analytics

---

## 🚀 Development Priority

### **PHASE 1 - CORE SHOPPING (Weeks 1-2)**
1. ✅ Homepage with featured products
2. ✅ Product listing pages (with filters)
3. ✅ Product detail pages
4. ✅ Shopping cart
5. ✅ Checkout flow (basic with address)
6. ✅ Sign up / Sign in

### **PHASE 2 - RECIPIENT FLOW (Weeks 3-4)**
7. ✅ Recipient acceptance page
8. ✅ Delivery date selection
9. ✅ Share photos/videos
10. ✅ Credits system display

### **PHASE 3 - USER PROFILES (Week 5)**
11. ✅ User account dashboard
12. ✅ Order history
13. ✅ Wishlists
14. ✅ Settings

### **PHASE 4 - CUSTOM FEATURES (Week 6+)**
15. ✅ Custom bouquet builder
16. ✅ Advanced payment (crypto)
17. ✅ Detailed blog/FAQ
18. ✅ Admin pages (if needed)

---

## 📝 Component Checklist

**Global Components:**
- [ ] Navigation Bar (with auth state, cart)
- [ ] Footer (links, social, newsletter)
- [ ] Search Bar
- [ ] User Menu / Dropdown
- [ ] Cart Sidebar / Icon
- [ ] Modal / Dialog container
- [ ] Toast notifications
- [ ] Loading spinner
- [ ] Error boundary

**Reusable Components:**
- [ ] Product Card (grid/list view variants)
- [ ] Review Card
- [ ] Rating Stars / Selector
- [ ] Button variants (primary, secondary, outlined, danger)
- [ ] Input variants (text, email, password, with validation)
- [ ] Form group (label + input + error)
- [ ] Image Gallery / Carousel
- [ ] Pagination
- [ ] Filter Sidebar
- [ ] Date Picker
- [ ] Map Component (for address)
- [ ] File Upload / Drag & drop
- [ ] Breadcrumb
- [ ] Price Display / Formatter
- [ ] Badge (status, tag, etc.)

---

## 🔗 API Base URL

Set in `frontend/src/api/axios.ts`:
```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

---

## 🔐 Authentication Flow

1. User signs up/logs in → Get `token` & `refreshToken`
2. Store tokens in localStorage (or context)
3. Add token to all requests via axios interceptor
4. Refresh token when expired
5. Redirect to login on 401

---

## 📱 Responsive Design

Build for:
- Mobile: 320px+ (iPhone SE)
- Tablet: 768px+ (iPad)
- Desktop: 1024px+ (standard desktop)

Use Tailwind CSS (already imported in your index.css)

---

## 🎨 Design System to Reference

- **Colors:** Reds, pinks, greens (natural/floral theme)
- **Typography:** Clean, elegant (serif for headings, sans-serif for body)
- **Icons:** Hero icons, Font Awesome, or custom SVGs
- **Spacing:** Consistent padding/margins (Tailwind scale)
- **Components:** Shadcn/UI or custom Tailwind components

---

**Next Steps:**
1. Create folder structure in `frontend/src/pages/`
2. Build global components (Nav, Footer, etc.)
3. Build reusable components
4. Start with Phase 1 pages
5. Connect to backend endpoints one by one
6. Test each page thoroughly

Would you like me to start building specific pages or components?

# API QA Checklist

Base URL: `http://localhost:5000`

## Setup Tokens

1. Admin token
- `POST /api/admin/auth/login`
- Body:
```json
{
  "email": "admin@flower-shop.com",
  "password": "admin123"
}
```
- Save `data.token` as `ADMIN_TOKEN`

2. Customer token
- `POST /api/auth/register` (new email each run), then `POST /api/auth/login`
- Save `data.token` as `CUSTOMER_TOKEN`

## Auth

- `POST /api/auth/register`
  - Success: `201`
  - Common validation fail: `422`
- `POST /api/auth/login`
  - Success: `200`
  - Invalid credentials: `401`
- `GET /api/auth/me` (Bearer `CUSTOMER_TOKEN`)
  - Success: `200`
  - Missing token: `401`

- `POST /api/admin/auth/login`
  - Success: `200`
  - Invalid credentials: `401`
- `GET /api/admin/auth/me` (Bearer `ADMIN_TOKEN`)
  - Success: `200`
  - Invalid token type: `403`

## Public Catalog and Content

- `GET /api/health` -> `200`
- `GET /api/products` -> `200`
- `GET /api/products/:id` -> `200|404`
- `GET /api/products/slug/:slug` -> `200|404`
- `GET /api/products/item/:itemCode` -> `200|404`

- `GET /api/categories` -> `200`
- `GET /api/categories/with-subs` -> `200`
- `GET /api/categories/:id` -> `200|404`
- `GET /api/categories/slug/:slug` -> `200|404`

- `GET /api/faqs` -> `200`
- `GET /api/faqs/:id` -> `200|404`

- `GET /api/siteconfig` -> `200`

- `GET /api/reviews` -> `200`
- `POST /api/reviews`
  - Success: `201`
  - Duplicate order review: `409`
  - Validation fail: `422`

- `GET /api/blogs` -> `200`
- `GET /api/blogs/slug/:slug` -> `200|404`

- `POST /api/contact` -> `200|201`
- `POST /api/contact/send` -> `200|201`

## Orders and Recipient Flow

- `POST /api/orders` (optional Bearer `CUSTOMER_TOKEN`)
  - Success: `201`
  - Validation fail: `422`
  - Country/currency mismatch: `400|422`

Required order payload shape:
```json
{
  "customerName": "Test Customer",
  "customerEmail": "test@example.com",
  "customerPhone": "1234567890",
  "recipientName": "Recipient Name",
  "recipientEmail": "recipient@example.com",
  "recipientPhone": "1234567891",
  "deliveryAddress": "123 Street",
  "country": "US",
  "currency": "USD",
  "deliveryMode": "recipient-provides",
  "isRecipientChoice": true,
  "items": [{ "productId": 1, "quantity": 1 }]
}
```

- `GET /api/recipient/:token` -> `200|400|404`
- `POST /api/recipient/accept`
  - Success: `200`
  - Missing fields / invalid date: `400`
  - Invalid token: `404`
- `POST /api/recipient/reject`
  - Success: `200`
  - Invalid token/state: `400|404`

Accept payload:
```json
{
  "token": "<RECIPIENT_TOKEN>",
  "chosenProductId": 1,
  "deliveryAddress": "456 Recipient Ave",
  "deliveryDate": "2026-12-15"
}
```

## Two-Phase Payments

- `POST /api/payments/authorize`
  - Success: `201`
  - Already authorized/paid: `400`

Payload:
```json
{
  "orderId": 1,
  "method": "mock-card",
  "processingDelayMs": 0
}
```

- `POST /api/payments/:id/capture`
  - Success: `200`
  - Not in authorized state: `400`
- `POST /api/payments/:id/void`
  - Success: `200`
  - Not in authorized state: `400`

Legacy endpoint (still present):
- `POST /api/payments/pay` -> `201|400|404`

## Credits

Customer:
- `POST /api/credits/earn` (Bearer `CUSTOMER_TOKEN`) -> `201|400|401`
- `GET /api/credits/history` (Bearer `CUSTOMER_TOKEN`) -> `200|401`

Admin:
- `GET /api/admin/credits` (Bearer `ADMIN_TOKEN`) -> `200`

## Delivery APIs

- `GET /api/delivery/available-dates?zipCode=10001&state=NY` -> `200|400`
- `GET /api/delivery/check?zipCode=10001&country=US` -> `200|400`

## Wishlist

- `POST /api/wishlist` (Bearer `CUSTOMER_TOKEN`) -> `201|401`
- `GET /api/wishlist/:token` -> `200|404`

## Order Media

Customer/recipient upload:
- `POST /api/orders/:id/media` (multipart form-data)
  - Success: `201`
  - Not delivered / invalid file / auth mismatch: `400|403|500`

Form fields:
- `media` (file)
- `mediaType` = `photo|video`
- `sharedWith` = `sender|public`

Admin:
- `GET /api/admin/media` (Bearer `ADMIN_TOKEN`) -> `200`
- `PATCH /api/admin/media/:id/approve` (Bearer `ADMIN_TOKEN`) -> `200|400|404`

## Admin Shared Endpoints

- `GET /api/admin/dashboard/stats` -> `200`
- `GET /api/admin/users` -> `200`
- `GET /api/admin/users/:id` -> `200|404`
- `PATCH /api/admin/users/:id/toggle` -> `200|404`
- `GET /api/admin/notifications` -> `200`
- `GET /api/admin/notifications/stats` -> `200`
- `GET /api/admin/notifications/:id` -> `200|404`

## Admin Domain Endpoints

Orders:
- `GET /api/admin/orders` -> `200`
- `GET /api/admin/orders/:id` -> `200|404`
- `GET /api/admin/orders/:id/recipient-link` -> `200|400|404`
- `GET /api/admin/orders/:id/timeline` -> `200|404`
- `PATCH /api/admin/orders/:id/status` -> `200|400|404`
- `PATCH /api/admin/orders/:id/payment` -> `200|400|404`

Products:
- `GET /api/admin/products` is not defined (expect `404`)
- `POST /api/admin/products` -> `201|422`
- `PUT /api/admin/products/:id` -> `200|404|422`
- `DELETE /api/admin/products/:id` -> `200|404`
- `PATCH /api/admin/products/:id/toggle` -> `200|400|404`

Categories:
- `GET /api/admin/categories` is not defined (expect `404`)
- `POST /api/admin/categories` -> `201|422`
- `PUT /api/admin/categories/:id` -> `200|404|422`
- `DELETE /api/admin/categories/:id` -> `200|404`
- `PATCH /api/admin/categories/:id/toggle` -> `200|404`

FAQs:
- `GET /api/admin/faqs` is not defined (expect `404`)
- `POST /api/admin/faqs` -> `201|422`
- `PUT /api/admin/faqs/:id` -> `200|404|422`
- `DELETE /api/admin/faqs/:id` -> `200|404`
- `PATCH /api/admin/faqs/:id/toggle` -> `200|404`

Site config:
- `GET /api/admin/siteconfig` is not defined (expect `404`)
- `PUT /api/admin/siteconfig` -> `200|422`

Reviews:
- `GET /api/admin/reviews` -> `200`
- `PATCH /api/admin/reviews/:id/approve` -> `200|404`
- `PATCH /api/admin/reviews/:id/reject` -> `200|404`
- `DELETE /api/admin/reviews/:id` -> `200|404`

Blogs:
- `GET /api/admin/blogs` -> `200`
- `POST /api/admin/blogs` -> `201|422`
- `PUT /api/admin/blogs/:id` -> `200|404|422`
- `PATCH /api/admin/blogs/:id/publish` -> `200|404`
- `DELETE /api/admin/blogs/:id` -> `200|404`

Custom bouquets:
- `GET /api/admin/bouquets` -> `200`
- `GET /api/admin/bouquets/:id` -> `200|404`
- `DELETE /api/admin/bouquets/:id` -> `200|404`

## Notes

- Global rate limiter is active on `/api/*`. For large batch tests, run in smaller chunks or restart server between batches to avoid `429`.
- Some admin GET list endpoints are intentionally not implemented for certain modules (products/categories/faqs/siteconfig), so `404` there is expected with current code.

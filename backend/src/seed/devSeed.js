require('dotenv').config()
const { v4: uuidv4 } = require('uuid')
const { sequelize, Order, OrderItem, RecipentAccessToken, Review, Product } = require('../models')

const seedOrders = async (products) => {
  const getProduct = (itemCode) => products.find(p => p.itemCode === itemCode)

  const orders = [
    // ── ORDER 1 — delivered, paid, normal sender-choice ──────────────────────
    {
      order: {
        customerName:    'Emily Carter',
        customerEmail:   'emily.carter@gmail.com',
        customerPhone:   '+1 (312) 555-0191',
        recipientName:   'Sarah Johnson',
        recipientPhone:  '+1 (312) 555-0182',
        deliveryAddress: '742 Evergreen Terrace, Chicago, IL 60601',
        message:         'Happy Birthday! Wishing you all the best today 🌸',
        totalPrice:      120.00,
        status:          'delivered',
        paymentStatus:   'paid',
        isRecipientChoice: false,
        isSubscription:  false,
      },
      items: [
        { itemCode: 'C15-4800', quantity: 1 },
      ],
    },

    // ── ORDER 2 — delivered, paid, two items ─────────────────────────────────
    {
      order: {
        customerName:    'James Miller',
        customerEmail:   'j.miller@outlook.com',
        customerPhone:   '+1 (415) 555-0143',
        recipientName:   'Linda Miller',
        recipientPhone:  '+1 (415) 555-0174',
        deliveryAddress: '88 Ocean Drive, San Francisco, CA 94102',
        message:         'Happy Anniversary my love ❤️',
        totalPrice:      240.00,
        status:          'delivered',
        paymentStatus:   'paid',
        isRecipientChoice: false,
        isSubscription:  false,
      },
      items: [
        { itemCode: 'C15-4810', quantity: 1 },
        { itemCode: 'C15-4811', quantity: 1 },
      ],
    },

    // ── ORDER 3 — confirmed, paid, recipient choice ──────────────────────────
    {
      order: {
        customerName:    'David Chen',
        customerEmail:   'david.chen@gmail.com',
        customerPhone:   '+1 (646) 555-0199',
        recipientName:   'Mei Chen',
        recipientPhone:  '+1 (646) 555-0201',
        deliveryAddress: '310 West 55th Street, New York, NY 10019',
        message:         'Thinking of you, choose what you love! 💐',
        totalPrice:      120.00,
        status:          'confirmed',
        paymentStatus:   'paid',
        isRecipientChoice: true,
        isSubscription:  false,
      },
      items: [
        { itemCode: 'C15-4790', quantity: 1 },
      ],
    },

    // ── ORDER 4 — pending, unpaid, recipient choice (token still active) ─────
    {
      order: {
        customerName:    'Priya Sharma',
        customerEmail:   'priya.sharma@yahoo.com',
        customerPhone:   '+1 (832) 555-0167',
        recipientName:   'Ananya Sharma',
        recipientPhone:  '+1 (832) 555-0188',
        deliveryAddress: '',
        message:         'Just because you deserve beautiful things 🌺',
        totalPrice:      115.00,
        status:          'pending',
        paymentStatus:   'unpaid',
        isRecipientChoice: true,
        isSubscription:  false,
      },
      items: [
        { itemCode: 'C15-4792', quantity: 1 },
      ],
    },

    // ── ORDER 5 — out for delivery, paid ────────────────────────────────────
    {
      order: {
        customerName:    'Robert Kim',
        customerEmail:   'rob.kim@gmail.com',
        customerPhone:   '+1 (213) 555-0155',
        recipientName:   'Grace Kim',
        recipientPhone:  '+1 (213) 555-0122',
        deliveryAddress: '400 South Grand Ave, Los Angeles, CA 90071',
        message:         'Get well soon! We miss you! 🌼',
        totalPrice:      105.00,
        status:          'out for delivery',
        paymentStatus:   'paid',
        isRecipientChoice: false,
        isSubscription:  false,
      },
      items: [
        { itemCode: 'C15-4860', quantity: 1 },
      ],
    },

    // ── ORDER 6 — cancelled, refunded ────────────────────────────────────────
    {
      order: {
        customerName:    'Olivia Brown',
        customerEmail:   'olivia.brown@gmail.com',
        customerPhone:   '+1 (617) 555-0134',
        recipientName:   'Thomas Brown',
        recipientPhone:  '+1 (617) 555-0145',
        deliveryAddress: '1 Main Street, Boston, MA 02101',
        message:         'Sorry I had to cancel 😢',
        totalPrice:      125.00,
        status:          'cancelled',
        paymentStatus:   'refunded',
        isRecipientChoice: false,
        isSubscription:  false,
      },
      items: [
        { itemCode: 'C15-4891', quantity: 1 },
      ],
    },

    // ── ORDER 7 — delivered, paid, high end ──────────────────────────────────
    {
      order: {
        customerName:    'Michael Torres',
        customerEmail:   'm.torres@icloud.com',
        customerPhone:   '+1 (305) 555-0177',
        recipientName:   'Isabella Torres',
        recipientPhone:  '+1 (305) 555-0188',
        deliveryAddress: '900 Brickell Ave, Miami, FL 33131',
        message:         'You deserve only the finest 💎',
        totalPrice:      255.00,
        status:          'delivered',
        paymentStatus:   'paid',
        isRecipientChoice: false,
        isSubscription:  false,
      },
      items: [
        { itemCode: 'C15-4827', quantity: 1 },
      ],
    },

    // ── ORDER 8 — confirmed, paid, subscription ──────────────────────────────
    {
      order: {
        customerName:    'Sophie Laurent',
        customerEmail:   'sophie.laurent@gmail.com',
        customerPhone:   '+1 (503) 555-0111',
        recipientName:   'Sophie Laurent',
        recipientPhone:  '+1 (503) 555-0111',
        deliveryAddress: '1234 NW Lovejoy St, Portland, OR 97209',
        message:         'Weekly flowers for myself — I deserve it!',
        totalPrice:      120.00,
        status:          'confirmed',
        paymentStatus:   'paid',
        isRecipientChoice: false,
        isSubscription:  true,
        subscriptionFrequency: 'weekly',
      },
      items: [
        { itemCode: 'C15-4940', quantity: 1 },
      ],
    },
  ]

  for (const { order, items } of orders) {
    const created = await Order.create(order)

    const resolvedItems = items.map(({ itemCode, quantity }) => {
      const product = getProduct(itemCode)
      if (!product) throw new Error(`Product not found for devSeed: ${itemCode}`)
      return {
        orderId:          created.id,
        productId:        product.id,
        productName:      product.name,
        productImage:     product.image?.[0] || null,
        quantity,
        priceAtPurchase:  product.price,
      }
    })

    await OrderItem.bulkCreate(resolvedItems)

    // create recipient token for recipient-choice orders that are still pending
    if (order.isRecipientChoice && order.status === 'pending') {
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 48)

      const token = uuidv4()

      await RecipentAccessToken.create({
        orderId:       created.id,
        token,
        expiresAt,
        status:        'pending',
        recipentName:  order.recipientName,
        recipentEmail: order.recipientPhone,
      })

      console.log(`  🔑 Recipient token for order #${created.id}: ${token}`)
    }

    console.log(`✅ Order #${created.id} — ${order.customerName} → ${order.status}`)
  }
}

const seedReviews = async () => {
  const orders = await Order.findAll({
    attributes: ['id', 'customerName', 'deliveryAddress'],
    order: [['id', 'ASC']],
  })

  if (orders.length === 0) {
    throw new Error('No orders found. Run order seeding before review seeding.')
  }

  const templates = [
    {
      message: 'I was blown away by how easy this was! Great service and beautiful flowers.',
      rating: 5,
      isApproved: true,
    },
    {
      message: 'Sent anniversary flowers and the bouquet arrived fresh and gorgeous.',
      rating: 5,
      isApproved: true,
    },
    {
      message: 'Genuinely brilliant concept. It made the whole gifting process effortless.',
      rating: 5,
      isApproved: true,
    },
    {
      message: 'My friend loved the flowers and the ordering experience was very smooth.',
      rating: 5,
      isApproved: false,
    },
    {
      message: 'Sent get well flowers to a colleague and the arrangement was beautiful.',
      rating: 5,
      isApproved: true,
    },
    {
      message: 'Even though my order was delayed, support was helpful and responsive.',
      rating: 4,
      isApproved: false,
    },
    {
      message: 'Ordered the high-end bouquet and the presentation was immaculate.',
      rating: 5,
      isApproved: true,
    },
    {
      message: 'The subscription option is the best thing I have signed up for.',
      rating: 5,
      isApproved: true,
    },
  ]

  const reviewsWithOrderIds = orders.slice(0, templates.length).map((order, index) => {
    const template = templates[index]
    const location = (() => {
      if (!order.deliveryAddress) return 'Unknown'

      const parts = order.deliveryAddress.split(',').map((part) => part.trim()).filter(Boolean)
      if (parts.length >= 2) {
        return parts.slice(-2).join(', ')
      }

      return parts[0] || 'Unknown'
    })()

    return {
      name: order.customerName,
      location,
      message: template.message,
      rating: template.rating,
      isApproved: template.isApproved,
      orderId: order.id,
    }
  })

  await Review.bulkCreate(reviewsWithOrderIds, { ignoreDuplicates: true })
  console.log(`✅ ${reviewsWithOrderIds.length} reviews seeded (${reviewsWithOrderIds.filter((r) => r.isApproved).length} approved, ${reviewsWithOrderIds.filter((r) => !r.isApproved).length} pending)`)
}

// ── MAIN ──────────────────────────────────────────────────────────────────────

const runDevSeed = async () => {
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ devSeed must never run in production')
    process.exit(1)
  }

  try {
    await sequelize.authenticate()
    console.log('✅ DB connected')

    const orderCount = await Order.count()
    if (orderCount > 0) {
      console.log(`⚠️  ${orderCount} orders already exist. Skipping orders.`)
    } else {
      const products = await Product.findAll()
      if (products.length === 0) {
        console.error('❌ No products found. Run npm run seed first.')
        process.exit(1)
      }
      await seedOrders(products)
    }

    const reviewCount = await Review.count()
    if (reviewCount > 0) {
      console.log(`⚠️  ${reviewCount} reviews already exist. Skipping reviews.`)
    } else {
      await seedReviews()
    }

    console.log('')
    console.log('🌸 Dev seed complete!')
    console.log('')
    console.log('Test these endpoints:')
    console.log('  GET  /api/reviews                    → approved reviews')
    console.log('  GET  /api/reviews/admin              → all seeded reviews')
    console.log('  GET  /api/admin/orders               → 8 orders, mixed statuses')
    console.log('  GET  /api/recipient/:token           → use the token printed above')
    process.exit(0)

  } catch (err) {
    console.error('❌ Dev seed failed:', err.message)
    console.error(err)
    process.exit(1)
  }
}

runDevSeed()
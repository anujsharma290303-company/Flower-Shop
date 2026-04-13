import React, { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import { useBouquetStore } from '../store/bouquetStore'

const CartPage: React.FC = () => {
  const navigate = useNavigate()
  const { cartItems, updateCartItemQuantity, removeFromCart } = useBouquetStore()

  const total = useMemo(
    () => cartItems.reduce((sum, item) => sum + (item.type === 'bouquet' ? item.price : item.price * item.quantity), 0),
    [cartItems]
  )

  return (
    <Layout>
      <section className="border-t border-gray-200 bg-[#f5f5f5] px-4 py-10 md:py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-center font-serif text-[42px] text-[#262b33]">Your Cart</h1>

          {cartItems.length === 0 ? (
            <div className="rounded border border-gray-200 bg-white p-8 text-center">
              <p className="text-[16px] text-[#586274]">Your cart is empty.</p>
              <Link
                to="/shop"
                className="mt-4 inline-flex h-11 items-center justify-center bg-[#c82a2f] px-6 text-white transition hover:bg-[#a81f24]"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="rounded border border-gray-200 bg-white p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[20px] font-semibold text-[#2f3743]">{item.name}</p>
                        <p className="text-[13px] uppercase tracking-[0.08em] text-gray-500">
                          {item.type === 'product' ? 'Product' : 'Custom Bouquet'}
                        </p>
                        <p className="mt-2 text-[15px] text-[#586274]">Unit price: ${item.price.toFixed(2)}</p>
                        {item.type === 'bouquet' && item.bouquetData ? (
                          <p className="mt-1 text-[14px] text-[#586274]">
                            {item.bouquetData.type === 'sender' ? "Sender's Choice" : "Recipient's Choice"} bouquet
                          </p>
                        ) : null}
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-[14px] text-[#c82a2f] hover:underline"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      {item.type === 'product' ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                            className="h-9 w-9 border border-gray-300 text-[#2f3743] hover:bg-gray-50"
                          >
                            -
                          </button>
                          <span className="min-w-10 text-center text-[16px] text-[#2f3743]">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                            className="h-9 w-9 border border-gray-300 text-[#2f3743] hover:bg-gray-50"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <p className="text-[14px] text-[#586274]">Quantity: 1</p>
                      )}

                      <p className="text-[18px] font-semibold text-[#2f3743]">
                        ${(item.type === 'bouquet' ? item.price : item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded border border-gray-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="text-[18px] font-semibold text-[#2f3743]">Cart Total</p>
                  <p className="text-[24px] font-semibold text-[#2f3743]">${total.toFixed(2)}</p>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    to="/shop"
                    className="inline-flex h-11 items-center justify-center border border-gray-300 bg-white px-6 text-[#2f3743] transition hover:bg-gray-50"
                  >
                    Continue Shopping
                  </Link>

                  <button
                    type="button"
                    onClick={() => navigate('/checkout')}
                    className="inline-flex h-11 items-center justify-center bg-[#c82a2f] px-6 text-white transition hover:bg-[#a81f24] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  )
}

CartPage.displayName = 'CartPage'

export default CartPage

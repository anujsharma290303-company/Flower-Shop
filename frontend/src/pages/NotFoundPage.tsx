import React from 'react'
import { Link } from 'react-router-dom'
import Layout from '@/components/layout/Layout'

const NotFoundPage: React.FC = () => {
  return (
    <Layout>
      <section className="border-t border-gray-200 bg-white px-4 py-16 md:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#c82a2f]">404</p>
          <h1 className="mt-3 font-serif text-[44px] font-semibold tracking-[-0.02em] text-[#252a31] md:text-[52px]">
            Page not found
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[18px] leading-[1.65] text-[#586274]">
            The page you requested does not exist or has moved. Use one of the links below to get back to the main flows.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/" className="inline-flex items-center justify-center bg-[#c82a2f] px-6 py-3 text-white transition hover:bg-[#a81f24]">
              Back to Home
            </Link>
            <Link to="/shop" className="inline-flex items-center justify-center border border-[#c82a2f] px-6 py-3 text-[#c82a2f] transition hover:bg-[#c82a2f] hover:text-white">
              Shop Flowers
            </Link>
            <Link to="/contact" className="inline-flex items-center justify-center border border-gray-300 px-6 py-3 text-[#2f3743] transition hover:border-[#c82a2f] hover:text-[#c82a2f]">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default NotFoundPage
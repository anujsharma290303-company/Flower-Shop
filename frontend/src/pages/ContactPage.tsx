import React, { useState } from 'react'
import Layout from '@/components/layout/Layout'
import { useSiteConfig } from '@/hooks/useSiteConfig'

const ContactPage: React.FC = () => {
  const { siteConfig } = useSiteConfig()
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const email = siteConfig?.contactEmail || 'contact@flowerstore.com'
  const phone = siteConfig?.contactPhone || '+1 (555) 123-4567'
  const phoneLink = phone.replace(/[^\d+]/g, '')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const subject = encodeURIComponent(`Social Flowers Contact: ${form.name || 'Website visitor'}`)
    const body = encodeURIComponent(`${form.message}\n\nReply to: ${form.email || email}`)
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
  }

  return (
    <Layout>
      <section className="border-t border-gray-200 bg-[#f4efef] px-4 py-10 md:px-8 md:py-12">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-center font-serif text-[42px] font-semibold tracking-[-0.02em] text-[#252a31] md:text-[48px]">Contact Us</h1>
          <p className="mx-auto mt-4 max-w-3xl text-center text-[18px] leading-[1.65] text-[#586274]">
            Questions about an order, delivery window, or the recipient flow? Reach the team below and we'll help you get moving.
          </p>

          <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-5 rounded border border-gray-200 bg-white p-6 shadow-[0_4px_16px_rgba(17,24,39,0.05)]">
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#c82a2f]">Phone</p>
                <a href={`tel:${phoneLink}`} className="mt-2 block text-[20px] font-semibold text-[#2f3743] hover:text-[#c82a2f]">
                  {phone}
                </a>
              </div>

              <div>
                <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#c82a2f]">Text</p>
                <a href={`sms:${phoneLink}`} className="mt-2 block text-[20px] font-semibold text-[#2f3743] hover:text-[#c82a2f]">
                  {phone}
                </a>
              </div>

              <div>
                <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#c82a2f]">Email</p>
                <a href={`mailto:${email}`} className="mt-2 block text-[20px] font-semibold text-[#2f3743] hover:text-[#c82a2f]">
                  {email}
                </a>
              </div>

              <div>
                <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#c82a2f]">Hours</p>
                <p className="mt-2 text-[18px] leading-[1.6] text-[#586274]">
                  Monday - Friday: 8am - 6pm ET
                  <br />
                  Saturday: 9am - 3pm ET
                  <br />
                  Sunday: Closed
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="rounded border border-gray-200 bg-white p-6 shadow-[0_4px_16px_rgba(17,24,39,0.05)]">
              <h2 className="text-[28px] font-semibold tracking-[-0.02em] text-[#2f3743]">Send a Message</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-gray-600">Name</span>
                  <input
                    value={form.name}
                    onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                    className="h-11 border border-gray-300 px-3 text-[16px] outline-none focus:border-[#c82a2f]"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-gray-600">Email</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                    className="h-11 border border-gray-300 px-3 text-[16px] outline-none focus:border-[#c82a2f]"
                  />
                </label>
              </div>

              <label className="mt-4 flex flex-col gap-2">
                <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-gray-600">Message</span>
                <textarea
                  value={form.message}
                  onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                  rows={7}
                  className="border border-gray-300 px-3 py-3 text-[16px] outline-none focus:border-[#c82a2f]"
                  placeholder="Tell us what you need help with"
                />
              </label>

              <button type="submit" className="mt-5 inline-flex h-11 items-center justify-center bg-[#c82a2f] px-6 text-white transition hover:bg-[#a81f24]">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  )
}

ContactPage.displayName = 'ContactPage'

export default ContactPage
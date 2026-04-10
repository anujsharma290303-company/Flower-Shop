import React from 'react'
import { Link } from 'react-router-dom'
import Layout from '@/components/layout/Layout'

const AboutPage: React.FC = () => {
  return (
    <Layout>
      <section className="bg-[#f2ecec] border-t border-gray-200 py-7 md:py-8 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-center font-semibold text-[40px] md:text-[42px] text-[#2b2f35]">About</h1>

          <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-[1fr_250px] gap-8 md:gap-10 items-start">
            <div className="text-[#4b5563] text-[20px] leading-[1.45] space-y-4">
              <h2 className="text-[#2f3743] font-semibold text-[40px] md:text-[42px] leading-tight">
                Modern Flower Delivery: No Address? No Problem!
              </h2>
              <p>
                We&apos;re not just another flower company. We&apos;re reinventing flower delivery by{' '}
                <Link to="/how-it-works" className="text-[#d2242a] hover:underline">solving the delivery address problem</Link>.
              </p>
              <p>
                Most people don&apos;t have an address book or addresses in their contact list. We let you send real flowers to anyone with an{' '}
                <Link to="/how-it-works#email-text" className="text-[#d2242a] hover:underline">email address</Link>,{' '}
                <Link to="/how-it-works#email-text" className="text-[#d2242a] hover:underline">mobile number</Link>, or{' '}
                <Link to="/how-it-works#social-media" className="text-[#d2242a] hover:underline">social media</Link> connection.
              </p>
              <p>
                How does it work? They receive a link to choose where and when to receive their flowers. Every step of the way, privacy is our biggest priority.
              </p>
              <p>We partner with the best local florists nationwide to deliver fresh, beautiful flowers.</p>
              <p>But this is not just about flowers, it&apos;s about helping you make meaningful connections.</p>
              <p>Your moments, your connections - made effortless with Social Flowers.</p>
            </div>

            <div className="w-full md:pt-4">
              <img
                src="https://cdn.socialflowers.com/fit-in/600x600/filters:no_upscale()/blog/images/woman-receiving-flowers.jpg"
                alt="Woman receiving flowers"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>

          <div className="mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-[1fr_250px] gap-8 md:gap-10 items-end">
            <div className="text-[#4b5563] text-[20px] leading-[1.45] space-y-4">
              <h2 className="text-[#2f3743] font-semibold text-[40px] md:text-[42px] leading-tight">The Social Flowers Solution</h2>
              <p>Everyone wants to be thoughtful, but contact information can be a barrier.</p>
              <p>
                Picture this: A valued team member is faced with the loss of a loved one. You want to send your condolences, but don&apos;t know the details.
              </p>
              <p>
                Or maybe your friend is having surgery. You want to show support, but you don&apos;t know if they prefer flowers at the hospital or their home.
              </p>
              <p>
                How about a long-distance friend celebrating a milestone birthday, but you lack their address to congratulate them.
              </p>
              <p>
                Social Flowers lets you <Link to="/#benefits" className="text-[#d2242a] hover:underline">effortlessly connect</Link> and show kindness in these important moments.
              </p>
            </div>

            <div className="w-full md:pb-2">
              <img
                src="https://cdn.socialflowers.com/fit-in/600x600/filters:no_upscale()/blog/images/Man%20receiving%20flowers%20in%20hospital3.jpg"
                alt="Hospital flower delivery"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>

          <div className="mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-[1fr_250px] gap-8 md:gap-10 items-start">
            <div className="text-[#4b5563] text-[20px] leading-[1.45] space-y-4">
              <h2 className="text-[#2f3743] font-semibold text-[40px] md:text-[42px] leading-tight">Our Quality - The Proof Is In Your Pictures</h2>
              <p>When your flower delivery arrives, we do something different - we ask you to take a photo.</p>
              <p>
                Why? Because a smiling face with beautiful flowers is the best way for the sender to see that their mission was accomplished and a meaningful connection was made.
              </p>
              <p>This also helps us choose the best florists to partner with.</p>
              <p>
                So make sure to send us a snap! And as a thank you - both the sender and recipient{' '}
                <Link to="/how-it-works#share" className="text-[#d2242a] hover:underline">up to $50 in credits</Link> towards a future order.
              </p>
              <p>It&apos;s not just about delivering flowers, it&apos;s about connection - one snapshot at a time!</p>
            </div>

            <div className="w-full md:pt-2">
              <img
                src="https://cdn.socialflowers.com/fit-in/600x600/filters:no_upscale()/blog/images/taking-picture-of-flowers.jpg"
                alt="Taking picture of flowers"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>

          <div className="mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8 md:gap-10 items-start">
            <div className="w-full md:pt-2">
              <img
                src="https://cdn.socialflowers.com/fit-in/600x600/filters:no_upscale()/blog/images/florist-at-shop.jpg"
                alt="Florist at shop"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
              <Link to="/romance-flowers" className="mt-2 inline-block text-[#d2242a] text-[29px] hover:underline">
                Make a connection!
              </Link>
            </div>

            <div className="text-[#4b5563] text-[20px] leading-[1.45] space-y-4">
              <h2 className="text-[#2f3743] font-semibold text-[40px] md:text-[42px] leading-tight">Decades of Experience</h2>
              <p>Our journey started in 1959 with a family-owned florist business on Long Island, New York.</p>
              <p>
                Forty years later, in 1999, we went online with{' '}
                <a href="https://www.floristone.com/" target="_blank" rel="noreferrer" className="text-[#d2242a] hover:underline">Florist One</a>, offering nationwide delivery by partnering with the{' '}
                <Link to="/local-florist-delivery" className="text-[#d2242a] hover:underline">best local florists</Link>.
              </p>
              <p>
                In 2007, we launched Social Flowers when we saw an opportunity to reinvent the flower industry by letting people connect even more easily through the gift of flowers.
              </p>
              <p>Since 1999, our collective flower businesses have been trusted to deliver more than 1.5 million bouquets nationwide.</p>
              <p>
                But every order is more than just a transaction to us, every order represents a heartfelt connection that we&apos;re proud of. We care about the flowers we deliver and the lives we touch.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

AboutPage.displayName = 'AboutPage'
export default AboutPage
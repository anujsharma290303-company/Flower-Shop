import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import { flowerMeService } from '@/api/flowerme'
import type { FlowerMePublicProfile } from '@/types'

const FlowerMePublicProfilePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const [profile, setProfile] = useState<FlowerMePublicProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    if (!slug) {
      setErrorMessage('Invalid FlowerMe profile slug.')
      setIsLoading(false)
      return
    }

    const loadProfile = async () => {
      try {
        const data = await flowerMeService.getBySlug(slug)
        if (isMounted) {
          setProfile(data)
        }
      } catch (error: unknown) {
        const status =
          typeof error === 'object' &&
          error !== null &&
          'response' in error &&
          typeof (error as { response?: { status?: number } }).response?.status === 'number'
            ? (error as { response: { status: number } }).response.status
            : null

        if (isMounted) {
          setErrorMessage(status === 404 ? 'FlowerMe profile not found.' : 'Unable to load FlowerMe profile.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadProfile()

    return () => {
      isMounted = false
    }
  }, [slug])

  return (
    <Layout>
      <section className="border-t border-gray-200 bg-[#f5f5f5] px-4 py-10 md:py-12">
        <div className="mx-auto max-w-180">
          {isLoading ? <p className="py-10 text-center text-[18px] text-[#586274]">Loading FlowerMe profile...</p> : null}
          {!isLoading && errorMessage ? <p className="py-10 text-center text-[16px] text-[#c82a2f]">{errorMessage}</p> : null}

          {!isLoading && !errorMessage && profile ? (
            <article className="overflow-hidden border border-gray-200 bg-white">
              <div className="bg-[#1f2937] px-6 py-8 text-white">
                <p className="text-[13px] uppercase tracking-[0.08em] text-gray-200">FlowerMe {profile.tier}</p>
                <h1 className="mt-2 text-[42px] font-semibold leading-tight">{profile.displayName}</h1>
                {profile.tagline ? <p className="mt-3 text-[20px] text-gray-100">{profile.tagline}</p> : null}
              </div>

              <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-[220px_1fr]">
                <div>
                  {profile.photoUrl ? (
                    <img src={profile.photoUrl} alt={profile.displayName} className="h-55 w-55 max-w-full object-cover" />
                  ) : (
                    <div className="flex h-55 w-55 max-w-full items-center justify-center bg-gray-100 text-sm text-gray-500">No profile photo</div>
                  )}
                </div>

                <div>
                  <p className="text-[13px] uppercase tracking-[0.08em] text-gray-500">Followers</p>
                  <p className="text-[30px] font-semibold text-[#2f3743]">{profile.followersCount}</p>

                  {profile.wishlistNotes ? (
                    <>
                      <p className="mt-4 text-[13px] uppercase tracking-[0.08em] text-gray-500">Wishlist Notes</p>
                      <p className="mt-2 whitespace-pre-wrap text-[17px] leading-[1.7] text-[#2f3743]">{profile.wishlistNotes}</p>
                    </>
                  ) : null}

                  {profile.socialLink ? (
                    <a
                      href={profile.socialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-block text-[16px] font-semibold text-[#c82a2f] hover:underline"
                    >
                      Visit Social Link
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          ) : null}

          <div className="mt-7 text-center">
            <Link to="/flowerme/profile" className="text-[18px] text-[#c82a2f] hover:underline">Manage My FlowerMe Profile</Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}

FlowerMePublicProfilePage.displayName = 'FlowerMePublicProfilePage'
export default FlowerMePublicProfilePage

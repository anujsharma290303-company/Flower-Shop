import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import { flowerMeService } from '@/api/flowerme'
import type { FlowerMeProfile, FlowerMeTier } from '@/types'

const FlowerMeProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<FlowerMeProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const [displayName, setDisplayName] = useState('')
  const [slug, setSlug] = useState('')
  const [tagline, setTagline] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [socialLink, setSocialLink] = useState('')
  const [followersCount, setFollowersCount] = useState(0)
  const [tier, setTier] = useState<FlowerMeTier>('society')
  const [wishlistNotes, setWishlistNotes] = useState('')
  const [isActive, setIsActive] = useState(true)

  const hydrateForm = (nextProfile: FlowerMeProfile) => {
    setDisplayName(nextProfile.displayName)
    setSlug(nextProfile.slug)
    setTagline(nextProfile.tagline ?? '')
    setPhotoUrl(nextProfile.photoUrl ?? '')
    setSocialLink(nextProfile.socialLink ?? '')
    setFollowersCount(nextProfile.followersCount)
    setTier(nextProfile.tier)
    setWishlistNotes(nextProfile.wishlistNotes ?? '')
    setIsActive(nextProfile.isActive)
  }

  useEffect(() => {
    let isMounted = true

    const loadMine = async () => {
      try {
        const mine = await flowerMeService.getMine()
        if (!isMounted) return
        setProfile(mine)
        hydrateForm(mine)
      } catch (error: unknown) {
        if (!isMounted) return

        const status =
          typeof error === 'object' &&
          error !== null &&
          'response' in error &&
          typeof (error as { response?: { status?: number } }).response?.status === 'number'
            ? (error as { response: { status: number } }).response.status
            : null

        if (status === 404) {
          setProfile(null)
          setErrorMessage('No FlowerMe profile yet. Complete the form to create one.')
        } else if (status === 401) {
          navigate('/sign-in')
        } else {
          const message =
            typeof error === 'object' &&
            error !== null &&
            'response' in error &&
            typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
              ? (error as { response: { data: { message: string } } }).response.data.message
              : 'Unable to load your FlowerMe profile.'
          setErrorMessage(message)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadMine()

    return () => {
      isMounted = false
    }
  }, [navigate])

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (displayName.trim().length < 2) {
      setErrorMessage('Display name must be at least 2 characters long.')
      return
    }

    if (followersCount < 0) {
      setErrorMessage('Followers count cannot be negative.')
      return
    }

    try {
      setIsSaving(true)
      const saved = await flowerMeService.upsertMine({
        displayName: displayName.trim(),
        slug: slug.trim() || undefined,
        tagline: tagline.trim() || null,
        photoUrl: photoUrl.trim() || null,
        socialLink: socialLink.trim() || null,
        followersCount,
        tier,
        wishlistNotes: wishlistNotes.trim() || null,
        isActive,
      })
      setProfile(saved)
      hydrateForm(saved)
      setSuccessMessage('FlowerMe profile saved successfully.')
    } catch (error: unknown) {
      const message =
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
          ? (error as { response: { data: { message: string } } }).response.data.message
          : 'Unable to save your FlowerMe profile.'
      setErrorMessage(message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Layout>
      <section className="border-t border-gray-200 bg-[#f5f5f5] px-4 py-10 md:py-12">
        <div className="mx-auto max-w-180">
          <h1 className="mb-2 text-center font-serif text-[44px] text-[#262b33]">My FlowerMe Profile</h1>
          <p className="mb-8 text-center text-[18px] text-[#586274]">Create or update your public FlowerMe page.</p>

          {isLoading ? <p className="py-10 text-center text-[18px] text-[#586274]">Loading profile...</p> : null}

          {!isLoading ? (
            <form onSubmit={onSubmit} className="rounded border border-gray-200 bg-white p-5 md:p-6">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="flowerme-display-name" className="mb-2 block text-[16px] font-medium text-[#2f3743]">Display Name</label>
                  <input
                    id="flowerme-display-name"
                    type="text"
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    className="h-11 w-full border border-gray-300 px-3 outline-none focus:border-[#c82a2f]"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="flowerme-slug" className="mb-2 block text-[16px] font-medium text-[#2f3743]">Slug</label>
                  <input
                    id="flowerme-slug"
                    type="text"
                    value={slug}
                    onChange={(event) => setSlug(event.target.value)}
                    className="h-11 w-full border border-gray-300 px-3 outline-none focus:border-[#c82a2f]"
                    placeholder="optional-custom-slug"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="flowerme-tagline" className="mb-2 block text-[16px] font-medium text-[#2f3743]">Tagline</label>
                  <input
                    id="flowerme-tagline"
                    type="text"
                    value={tagline}
                    onChange={(event) => setTagline(event.target.value)}
                    className="h-11 w-full border border-gray-300 px-3 outline-none focus:border-[#c82a2f]"
                  />
                </div>

                <div>
                  <label htmlFor="flowerme-photo-url" className="mb-2 block text-[16px] font-medium text-[#2f3743]">Photo URL</label>
                  <input
                    id="flowerme-photo-url"
                    type="url"
                    value={photoUrl}
                    onChange={(event) => setPhotoUrl(event.target.value)}
                    className="h-11 w-full border border-gray-300 px-3 outline-none focus:border-[#c82a2f]"
                  />
                </div>

                <div>
                  <label htmlFor="flowerme-social-link" className="mb-2 block text-[16px] font-medium text-[#2f3743]">Social Link</label>
                  <input
                    id="flowerme-social-link"
                    type="url"
                    value={socialLink}
                    onChange={(event) => setSocialLink(event.target.value)}
                    className="h-11 w-full border border-gray-300 px-3 outline-none focus:border-[#c82a2f]"
                  />
                </div>

                <div>
                  <label htmlFor="flowerme-followers" className="mb-2 block text-[16px] font-medium text-[#2f3743]">Followers</label>
                  <input
                    id="flowerme-followers"
                    type="number"
                    min={0}
                    value={followersCount}
                    onChange={(event) => setFollowersCount(Number(event.target.value) || 0)}
                    className="h-11 w-full border border-gray-300 px-3 outline-none focus:border-[#c82a2f]"
                  />
                </div>

                <div>
                  <label htmlFor="flowerme-tier" className="mb-2 block text-[16px] font-medium text-[#2f3743]">Tier</label>
                  <select
                    id="flowerme-tier"
                    value={tier}
                    onChange={(event) => setTier(event.target.value as FlowerMeTier)}
                    className="h-11 w-full border border-gray-300 px-3 outline-none focus:border-[#c82a2f]"
                  >
                    <option value="society">Society</option>
                    <option value="socialite">Socialite</option>
                    <option value="royale">Royale</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="flowerme-notes" className="mb-2 block text-[16px] font-medium text-[#2f3743]">Wishlist Notes</label>
                  <textarea
                    id="flowerme-notes"
                    value={wishlistNotes}
                    onChange={(event) => setWishlistNotes(event.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 px-3 py-2 outline-none focus:border-[#c82a2f]"
                  />
                </div>

                <label className="md:col-span-2 flex items-center gap-2 text-[16px] text-[#2f3743]">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(event) => setIsActive(event.target.checked)}
                  />
                  Keep profile active and public
                </label>
              </div>

              {errorMessage ? <p className="mt-4 text-[14px] text-[#c82a2f]">{errorMessage}</p> : null}
              {successMessage ? <p className="mt-4 text-[14px] text-green-700">{successMessage}</p> : null}

              <button
                type="submit"
                disabled={isSaving}
                className="mt-5 h-11 w-full bg-[#cf0000] text-[18px] font-semibold text-white hover:bg-[#b70000] disabled:bg-gray-400"
              >
                {isSaving ? 'Saving...' : profile ? 'Update FlowerMe Profile' : 'Create FlowerMe Profile'}
              </button>
            </form>
          ) : null}
        </div>
      </section>
    </Layout>
  )
}

FlowerMeProfilePage.displayName = 'FlowerMeProfilePage'
export default FlowerMeProfilePage

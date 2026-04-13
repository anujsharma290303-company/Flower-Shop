import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import { authService } from '@/api/auth'
import { useCustomerAuth } from '@/hooks/useCustomerAuth'

const MyProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const { profile, isLoading, refreshProfile } = useCustomerAuth()
  const accountMenuItems = [
    { label: 'Account Info', href: '/my-profile', isActive: true },
    { label: 'FlowerMe Profile', href: '/flowerme/profile' },
    { label: 'Payment Methods', href: '/my-profile' },
    { label: 'Orders Placed', href: '/my-orders' },
    { label: 'Orders Received', href: '/my-orders' },
    { label: 'My Subscriptions', href: '/my-orders' },
    { label: 'My Credits', href: '/my-profile' },
  ]

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [profileMessage, setProfileMessage] = useState<string | null>(null)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  useEffect(() => {
    if (!isLoading && !profile) {
      navigate('/sign-in')
    }
  }, [isLoading, navigate, profile])

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName)
      setLastName(profile.lastName)
    }
  }, [profile])

  const onProfileSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setProfileMessage(null)
    setProfileError(null)

    if (firstName.trim().length < 2 || lastName.trim().length < 2) {
      setProfileError('First name and last name must be at least 2 characters long.')
      return
    }

    try {
      setIsUpdatingProfile(true)
      await authService.updateMe({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      })
      await refreshProfile()
      setProfileMessage('Profile updated successfully.')
    } catch (error: unknown) {
      const message =
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
          ? (error as { response: { data: { message: string } } }).response.data.message
          : 'Unable to update profile. Please try again.'
      setProfileError(message)
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const onPasswordSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPasswordMessage(null)
    setPasswordError(null)

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.')
      return
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError('New password and confirm password do not match.')
      return
    }

    try {
      setIsUpdatingPassword(true)
      await authService.changePassword({ oldPassword, newPassword })
      setOldPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
      setPasswordMessage('Password changed successfully.')
    } catch (error: unknown) {
      const message =
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
          ? (error as { response: { data: { message: string } } }).response.data.message
          : 'Unable to change password. Please try again.'
      setPasswordError(message)
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  const onSignOut = () => {
    authService.clearSession()
    navigate('/sign-in')
  }

  if (isLoading) {
    return (
      <Layout>
        <section className="border-t border-gray-200 bg-[#f5f5f5] px-4 py-12 text-center text-[18px] text-[#586274]">
          Loading profile...
        </section>
      </Layout>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <Layout>
      <section className="border-t border-gray-200 bg-[#f4f4f4] px-4 py-10 md:px-6 md:py-12">
        <div className="mx-auto max-w-230">
          <div className="grid grid-cols-1 gap-7 lg:grid-cols-[280px_1fr] lg:gap-10">
            <aside className="bg-transparent">
              <nav className="border border-gray-200 bg-white">
                {accountMenuItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={`flex items-center justify-between border-b border-gray-200 px-5 py-3.5 text-[19px] font-normal last:border-b-0 ${
                      item.isActive ? 'text-[#1f2328]' : 'text-[#6b7280] hover:text-[#1f2328]'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="text-[20px] text-gray-500">›</span>
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={onSignOut}
                  className="flex w-full items-center justify-between border-t border-gray-200 px-5 py-3.5 text-left text-[19px] font-normal text-[#6b7280] hover:text-[#1f2328]"
                >
                  <span>Sign Out</span>
                  <span className="text-[20px] text-gray-500">›</span>
                </button>
              </nav>
            </aside>

            <div className="pb-2">
              <h1 className="mb-6 text-center text-[44px] font-semibold tracking-[-0.02em] text-[#2b2f36] md:text-[52px]">My Account</h1>

              <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="border border-gray-200 bg-white px-5 py-4">
                  <p className="text-[12px] uppercase tracking-[0.08em] text-gray-500">Email</p>
                  <p className="mt-1 text-[16px] text-[#2f3743] wrap-break-word">{profile.email}</p>
                </div>
                <div className="border border-gray-200 bg-white px-5 py-4">
                  <p className="text-[12px] uppercase tracking-[0.08em] text-gray-500">Credits</p>
                  <p className="mt-1 text-[16px] text-[#2f3743]">{profile.credits}</p>
                </div>
                <div className="border border-gray-200 bg-white px-5 py-4">
                  <p className="text-[12px] uppercase tracking-[0.08em] text-gray-500">Status</p>
                  <p className="mt-1 text-[16px] text-[#2f3743]">{profile.isActive ? 'Active' : 'Inactive'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <form onSubmit={onProfileSubmit} className="border border-gray-200 bg-white px-5 py-5 md:px-6">
                  <h2 className="mb-4 text-[30px] font-semibold text-[#2f3743]">Account Info</h2>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor="profile-first-name" className="mb-2 block text-[16px] font-medium text-[#2f3743]">First Name</label>
                      <input
                        id="profile-first-name"
                        type="text"
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
                        className="h-11 w-full border border-gray-300 px-3 outline-none focus:border-[#c82a2f]"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="profile-last-name" className="mb-2 block text-[16px] font-medium text-[#2f3743]">Last Name</label>
                      <input
                        id="profile-last-name"
                        type="text"
                        value={lastName}
                        onChange={(event) => setLastName(event.target.value)}
                        className="h-11 w-full border border-gray-300 px-3 outline-none focus:border-[#c82a2f]"
                        required
                      />
                    </div>
                  </div>

                  {profileError ? <p className="mt-4 text-[14px] text-[#c82a2f]">{profileError}</p> : null}
                  {profileMessage ? <p className="mt-4 text-[14px] text-green-700">{profileMessage}</p> : null}

                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="mt-5 h-11 w-full md:w-56 bg-[#cf0000] text-[18px] font-semibold text-white hover:bg-[#b70000] disabled:bg-gray-400"
                  >
                    {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>

                <form onSubmit={onPasswordSubmit} className="border border-gray-200 bg-white px-5 py-5 md:px-6">
                  <h2 className="mb-4 text-[30px] font-semibold text-[#2f3743]">Change Password</h2>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <label htmlFor="old-password" className="mb-2 block text-[16px] font-medium text-[#2f3743]">Current Password</label>
                      <input
                        id="old-password"
                        type="password"
                        value={oldPassword}
                        onChange={(event) => setOldPassword(event.target.value)}
                        className="h-11 w-full border border-gray-300 px-3 outline-none focus:border-[#c82a2f]"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="new-password" className="mb-2 block text-[16px] font-medium text-[#2f3743]">New Password</label>
                      <input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        className="h-11 w-full border border-gray-300 px-3 outline-none focus:border-[#c82a2f]"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="confirm-new-password" className="mb-2 block text-[16px] font-medium text-[#2f3743]">Confirm New Password</label>
                      <input
                        id="confirm-new-password"
                        type="password"
                        value={confirmNewPassword}
                        onChange={(event) => setConfirmNewPassword(event.target.value)}
                        className="h-11 w-full border border-gray-300 px-3 outline-none focus:border-[#c82a2f]"
                        required
                      />
                    </div>
                  </div>

                  {passwordError ? <p className="mt-4 text-[14px] text-[#c82a2f]">{passwordError}</p> : null}
                  {passwordMessage ? <p className="mt-4 text-[14px] text-green-700">{passwordMessage}</p> : null}

                  <button
                    type="submit"
                    disabled={isUpdatingPassword}
                    className="mt-5 h-11 w-full md:w-64 bg-[#cf0000] text-[18px] font-semibold text-white hover:bg-[#b70000] disabled:bg-gray-400"
                  >
                    {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

MyProfilePage.displayName = 'MyProfilePage'
export default MyProfilePage

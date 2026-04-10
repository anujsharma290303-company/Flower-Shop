import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import { authService } from '@/api/auth'
import { useCustomerAuth } from '@/hooks/useCustomerAuth'

const MyProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const { profile, isLoading, refreshProfile } = useCustomerAuth()

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
      <section className="border-t border-gray-200 bg-[#f5f5f5] px-4 py-10 md:py-12">
        <div className="mx-auto max-w-180">
          <h1 className="mb-8 text-center font-serif text-[44px] text-[#262b33]">My Profile</h1>

          <div className="mb-8 grid grid-cols-1 gap-4 rounded border border-gray-200 bg-white p-5 md:grid-cols-3">
            <div>
              <p className="text-[13px] uppercase tracking-[0.08em] text-gray-500">Email</p>
              <p className="text-[18px] text-[#2f3743]">{profile.email}</p>
            </div>
            <div>
              <p className="text-[13px] uppercase tracking-[0.08em] text-gray-500">Credits</p>
              <p className="text-[18px] text-[#2f3743]">{profile.credits}</p>
            </div>
            <div>
              <p className="text-[13px] uppercase tracking-[0.08em] text-gray-500">Status</p>
              <p className="text-[18px] text-[#2f3743]">{profile.isActive ? 'Active' : 'Inactive'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <form onSubmit={onProfileSubmit} className="rounded border border-gray-200 bg-white p-5">
              <h2 className="mb-4 text-[28px] font-semibold text-[#2f3743]">Update Profile</h2>

              <div className="space-y-4">
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
                className="mt-5 h-11 w-full bg-[#cf0000] text-[18px] font-semibold text-white hover:bg-[#b70000] disabled:bg-gray-400"
              >
                {isUpdatingProfile ? 'Saving...' : 'Save Profile'}
              </button>
            </form>

            <form onSubmit={onPasswordSubmit} className="rounded border border-gray-200 bg-white p-5">
              <h2 className="mb-4 text-[28px] font-semibold text-[#2f3743]">Change Password</h2>

              <div className="space-y-4">
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
                className="mt-5 h-11 w-full bg-[#cf0000] text-[18px] font-semibold text-white hover:bg-[#b70000] disabled:bg-gray-400"
              >
                {isUpdatingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/my-orders" className="text-[18px] text-[#c82a2f] hover:underline">View My Orders</Link>
            <button type="button" onClick={onSignOut} className="text-[18px] text-[#c82a2f] hover:underline">
              Sign Out
            </button>
          </div>
        </div>
      </section>
    </Layout>
  )
}

MyProfilePage.displayName = 'MyProfilePage'
export default MyProfilePage

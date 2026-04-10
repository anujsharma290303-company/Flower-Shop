import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ADMIN_ENDPOINT_CATALOG, adminService } from '@/api/admin'
import type { Admin, AdminDashboardStats } from '@/types'

const parseCatalogEntry = (entry: string) => {
  const [method, ...pathParts] = entry.split(' ')
  return {
    method: method as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    path: pathParts.join(' '),
  }
}

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [stats, setStats] = useState<AdminDashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [selectedEndpoint, setSelectedEndpoint] = useState<string>(ADMIN_ENDPOINT_CATALOG[0])
  const [requestPath, setRequestPath] = useState('/admin/dashboard/stats')
  const [requestMethod, setRequestMethod] = useState<'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'>('GET')
  const [requestBody, setRequestBody] = useState('{}')
  const [requestQuery, setRequestQuery] = useState('{}')
  const [responseStatus, setResponseStatus] = useState<string | null>(null)
  const [responsePayload, setResponsePayload] = useState<string>('')
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    const parsed = parseCatalogEntry(selectedEndpoint)
    setRequestMethod(parsed.method)
    setRequestPath(parsed.path)
  }, [selectedEndpoint])

  useEffect(() => {
    let isMounted = true

    const init = async () => {
      try {
        const [currentAdmin, dashboardStats] = await Promise.all([
          adminService.me(),
          adminService.getDashboardStats().catch(() => null),
        ])

        if (!isMounted) return
        setAdmin(currentAdmin)
        setStats(dashboardStats)
      } catch {
        if (!isMounted) return
        adminService.clearSession()
        navigate('/admin/login')
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    init()

    return () => {
      isMounted = false
    }
  }, [navigate])

  const parsedBody = useMemo(() => {
    try {
      return requestBody.trim() ? JSON.parse(requestBody) : undefined
    } catch {
      return null
    }
  }, [requestBody])

  const parsedQuery = useMemo(() => {
    try {
      return requestQuery.trim() ? JSON.parse(requestQuery) : undefined
    } catch {
      return null
    }
  }, [requestQuery])

  const sendRequest = async () => {
    setErrorMessage(null)
    setResponseStatus(null)

    if (parsedBody === null) {
      setErrorMessage('Request body must be valid JSON.')
      return
    }

    if (parsedQuery === null) {
      setErrorMessage('Query params must be valid JSON.')
      return
    }

    try {
      setIsSending(true)
      const result = await adminService.request({
        method: requestMethod,
        path: requestPath,
        body: parsedBody,
        query: parsedQuery as Record<string, unknown> | undefined,
      })
      setResponseStatus('Success')
      setResponsePayload(JSON.stringify(result, null, 2))
    } catch (error: unknown) {
      const status =
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as { response?: { status?: number } }).response?.status === 'number'
          ? (error as { response: { status: number } }).response.status
          : null

      const payload =
        typeof error === 'object' &&
        error !== null &&
        'response' in error
          ? (error as { response?: { data?: unknown } }).response?.data
          : null

      setResponseStatus(status ? `Error ${status}` : 'Error')
      setResponsePayload(JSON.stringify(payload ?? { message: 'Request failed' }, null, 2))
    } finally {
      setIsSending(false)
    }
  }

  const signOut = () => {
    adminService.clearSession()
    navigate('/admin/login')
  }

  if (loading) {
    return <div className="p-8 text-center text-[18px] text-[#586274]">Loading admin dashboard...</div>
  }

  return (
    <main className="min-h-screen bg-[#0f172a] p-4 md:p-8 text-white" data-testid="admin-dashboard">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-[34px] font-semibold">Admin Dashboard</h1>
            <p className="text-[14px] text-slate-300">
              Signed in as {admin?.email} ({admin?.role})
            </p>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="h-10 rounded bg-slate-200 px-4 text-[14px] font-semibold text-slate-900 hover:bg-white"
          >
            Sign Out
          </button>
        </div>

        {stats ? (
          <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-5">
            <div className="rounded bg-[#1e293b] p-3"><p className="text-xs text-slate-300">Users</p><p className="text-xl font-semibold">{stats.totalUsers}</p></div>
            <div className="rounded bg-[#1e293b] p-3"><p className="text-xs text-slate-300">Active</p><p className="text-xl font-semibold">{stats.activeUsers}</p></div>
            <div className="rounded bg-[#1e293b] p-3"><p className="text-xs text-slate-300">Orders</p><p className="text-xl font-semibold">{stats.totalOrders}</p></div>
            <div className="rounded bg-[#1e293b] p-3"><p className="text-xs text-slate-300">Pending</p><p className="text-xl font-semibold">{stats.pendingOrders}</p></div>
            <div className="rounded bg-[#1e293b] p-3"><p className="text-xs text-slate-300">Revenue</p><p className="text-xl font-semibold">{stats.totalRevenue}</p></div>
          </div>
        ) : null}

        <section className="rounded bg-[#111827] p-4 md:p-6">
          <h2 className="mb-4 text-[24px] font-semibold">Admin Endpoint Runner</h2>
          <p className="mb-4 text-[14px] text-slate-300">Run any /admin endpoint with full method + JSON payload control.</p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="endpoint-catalog" className="mb-2 block text-sm text-slate-300">Choose Endpoint Template</label>
              <select
                id="endpoint-catalog"
                value={selectedEndpoint}
                onChange={(event) => setSelectedEndpoint(event.target.value)}
                className="h-10 w-full rounded border border-slate-600 bg-[#1f2937] px-3 text-sm"
              >
                {ADMIN_ENDPOINT_CATALOG.map((endpoint) => (
                  <option key={endpoint} value={endpoint}>{endpoint}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="request-method" className="mb-2 block text-sm text-slate-300">Method</label>
              <select
                id="request-method"
                value={requestMethod}
                onChange={(event) => setRequestMethod(event.target.value as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE')}
                className="h-10 w-full rounded border border-slate-600 bg-[#1f2937] px-3 text-sm"
              >
                {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((method) => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="request-path" className="mb-2 block text-sm text-slate-300">Path</label>
              <input
                id="request-path"
                value={requestPath}
                onChange={(event) => setRequestPath(event.target.value)}
                className="h-10 w-full rounded border border-slate-600 bg-[#1f2937] px-3 text-sm"
              />
            </div>

            <div>
              <label htmlFor="request-query" className="mb-2 block text-sm text-slate-300">Query JSON</label>
              <textarea
                id="request-query"
                rows={6}
                value={requestQuery}
                onChange={(event) => setRequestQuery(event.target.value)}
                className="w-full rounded border border-slate-600 bg-[#1f2937] px-3 py-2 font-mono text-xs"
              />
            </div>

            <div>
              <label htmlFor="request-body" className="mb-2 block text-sm text-slate-300">Body JSON</label>
              <textarea
                id="request-body"
                rows={6}
                value={requestBody}
                onChange={(event) => setRequestBody(event.target.value)}
                className="w-full rounded border border-slate-600 bg-[#1f2937] px-3 py-2 font-mono text-xs"
              />
            </div>
          </div>

          {errorMessage ? <p className="mt-4 text-sm text-red-400">{errorMessage}</p> : null}

          <button
            type="button"
            onClick={sendRequest}
            disabled={isSending}
            className="mt-4 h-10 rounded bg-cyan-400 px-4 text-[14px] font-semibold text-slate-900 hover:bg-cyan-300 disabled:bg-slate-500"
          >
            {isSending ? 'Sending...' : 'Send Request'}
          </button>

          <div className="mt-5 rounded bg-black/40 p-3">
            <p className="mb-2 text-xs uppercase tracking-[0.08em] text-slate-300">Response {responseStatus ? `- ${responseStatus}` : ''}</p>
            <pre className="max-h-130 overflow-auto whitespace-pre-wrap font-mono text-xs text-slate-100">{responsePayload || 'No response yet.'}</pre>
          </div>
        </section>
      </div>
    </main>
  )
}

AdminDashboardPage.displayName = 'AdminDashboardPage'
export default AdminDashboardPage

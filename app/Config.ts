import axios from 'axios'

export const Config = {
    apiUrl: '/api',
    tokenKey: 'token_erp'
}

// Attach the JWT to every axios request automatically.
// The backend denies all endpoints (except signin) without a token,
// and most pages don't set the Authorization header themselves.
// Registered once per bundle; guarded against HMR double-registration.
declare global {
    // eslint-disable-next-line no-var
    var __erpAxiosAuthInstalled: boolean | undefined
}

if (typeof window !== 'undefined' && !globalThis.__erpAxiosAuthInstalled) {
    globalThis.__erpAxiosAuthInstalled = true
    axios.interceptors.request.use((request) => {
        if (!request.headers.Authorization) {
            const token = localStorage.getItem(Config.tokenKey)
            if (token) {
                request.headers.Authorization = `Bearer ${token}`
            }
        }
        return request
    })
}

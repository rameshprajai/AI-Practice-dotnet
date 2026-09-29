export type AuthUser = {
  id: string
  fullName: string
  email: string
}

const AUTH_STORAGE_KEY = 'securebank-auth'

export function getStoredSession(): AuthUser | null {
  if (typeof window === 'undefined') {
    return null
  }

  const value = sessionStorage.getItem(AUTH_STORAGE_KEY)
  if (!value) {
    return null
  }

  try {
    const parsed = JSON.parse(value) as Partial<AuthUser>
    if (!parsed?.email || !parsed?.fullName) {
      return null
    }

    return {
      id: parsed.id ?? 'mock-user',
      fullName: parsed.fullName,
      email: parsed.email,
    }
  } catch {
    return null
  }
}

export function setStoredSession(user: AuthUser) {
  if (typeof window === 'undefined') {
    return
  }

  sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
  window.dispatchEvent(new Event('securebank-route-change'))
}

export function clearStoredSession() {
  if (typeof window === 'undefined') {
    return
  }

  sessionStorage.removeItem(AUTH_STORAGE_KEY)
  window.dispatchEvent(new Event('securebank-route-change'))
}

export function navigateTo(path: string) {
  if (typeof window === 'undefined') {
    return
  }

  window.history.pushState({}, '', path)
  window.dispatchEvent(new Event('securebank-route-change'))
}

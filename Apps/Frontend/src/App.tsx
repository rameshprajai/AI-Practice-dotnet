import { useEffect, useState } from 'react'

import './App.css'

import Dashboard from './features/dashboard/Dashboard'
import SigninForm from './features/auth/SigninForm'
import SignupForm from './features/auth/SignupForm'
import { clearStoredSession, getStoredSession, navigateTo } from './features/auth/session'
import TransferMoneyPage from './features/transfer/TransferMoneyPage'

function SignInView() {
  return (
    <main className="auth-page">
      <section className="auth-card" aria-label="Sign in form">
        <div className="brand-block" aria-hidden="true">
          <div className="brand-mark">S</div>
        </div>

        <div className="content-block">
          <p className="eyebrow">SecureBank</p>
          <h1>Sign in</h1>
          <p className="subtitle">Welcome back</p>

          <SigninForm />

          <p className="login-link">
            Need an account? <a href="/">Create account</a>
          </p>
        </div>
      </section>
    </main>
  )
}

function CreateAccountView() {
  return (
    <main className="auth-page">
      <section className="auth-card" aria-label="Create account form">
        <div className="brand-block" aria-hidden="true">
          <div className="brand-mark">S</div>
        </div>

        <div className="content-block">
          <p className="eyebrow">SecureBank</p>
          <h1>Create Account</h1>
          <p className="subtitle">Sign up for a new SecureBank account</p>

          <SignupForm />

          <p className="login-link">
            Already have an account? <a href="/signin">Sign in</a>
          </p>
        </div>
      </section>
    </main>
  )
}

function App() {
  const [route, setRoute] = useState(typeof window !== 'undefined' ? window.location.pathname : '/')

  useEffect(() => {
    const syncRoute = () => setRoute(window.location.pathname)

    window.addEventListener('popstate', syncRoute)
    window.addEventListener('securebank-route-change', syncRoute)

    return () => {
      window.removeEventListener('popstate', syncRoute)
      window.removeEventListener('securebank-route-change', syncRoute)
    }
  }, [])

  const isSignedIn = Boolean(getStoredSession())

  if (route === '/dashboard' && !isSignedIn) {
    navigateTo('/signin')
    return <SignInView />
  }

  if (route === '/dashboard') {
    return <Dashboard onSignOut={() => clearStoredSession()} onNavigate={navigateTo} />
  }

  if (route === '/transfer') {
    if (!isSignedIn) {
      navigateTo('/signin')
      return <SignInView />
    }

    return <TransferMoneyPage />
  }

  if (route === '/signin') {
    return <SignInView />
  }

  return <CreateAccountView />
}

export default App

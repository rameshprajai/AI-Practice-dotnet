import { getStoredSession, navigateTo } from '../auth/session'

const navItems = [
  { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
  { label: 'Transfer Money', icon: 'transfer', route: '/transfer' },
  { label: 'Pay Bills', icon: 'bills', route: '/bills' },
]

const summaryCards = [
  {
    label: 'Total Balance',
    value: '$24,587.50',
    helper: '+2.5% from last month',
    trend: 'positive',
    icon: 'currency',
  },
  {
    label: 'Monthly Income',
    value: '$8,450.00',
    helper: 'April 2026',
    trend: 'positive',
    icon: 'income',
  },
  {
    label: 'Monthly Expenses',
    value: '$3,210.75',
    helper: 'April 2026',
    trend: 'negative',
    icon: 'expenses',
  },
]

const transactions = [
  { id: 'txn-001', label: 'Salary Deposit', amount: '+$8,450.00', type: 'credit', date: '2026-04-28', icon: 'income' },
  { id: 'txn-002', label: 'Grocery Store', amount: '$125.50', type: 'debit', date: '2026-04-27', icon: 'expenses' },
  { id: 'txn-003', label: 'Electric Bill', amount: '$89.20', type: 'debit', date: '2026-04-26', icon: 'expenses' },
  { id: 'txn-004', label: 'Freelance Payment', amount: '+$500.00', type: 'credit', date: '2026-04-25', icon: 'income' },
  { id: 'txn-005', label: 'Online Shopping', amount: '$234.99', type: 'debit', date: '2026-04-24', icon: 'expenses' },
]

function MenuIcon({ type }: { type: string }) {
  const commonProps = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

  switch (type) {
    case 'dashboard':
      return (
        <svg {...commonProps} aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="4" rx="1.5" /><rect x="14" y="11" width="7" height="10" rx="1.5" /><rect x="3" y="12" width="7" height="9" rx="1.5" />
        </svg>
      )
    case 'transfer':
      return (
        <svg {...commonProps} aria-hidden="true">
          <path d="M8 7h10" /><path d="M13 2l5 5-5 5" /><path d="M16 17H6" /><path d="M11 12l-5 5 5 5" />
        </svg>
      )
    case 'bills':
      return (
        <svg {...commonProps} aria-hidden="true">
          <path d="M3.5 8.5A2.5 2.5 0 0 1 6 6h12a2.5 2.5 0 0 1 2.5 2.5v7A2.5 2.5 0 0 1 18 18H6a2.5 2.5 0 0 1-2.5-2.5v-7Z" /><path d="M8 10h8" /><path d="M8 14h5" />
        </svg>
      )
    case 'logout':
      return (
        <svg {...commonProps} aria-hidden="true">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" />
        </svg>
      )
    case 'currency':
      return (
        <svg {...commonProps} aria-hidden="true">
          <path d="M12 1v22" /><path d="M17 5.5c0-1.7-2.2-3-5-3s-5 1.3-5 3 2.2 3 5 3 5 1.3 5 3-2.2 3-5 3-5-1.3-5-3" />
        </svg>
      )
    case 'income':
      return (
        <svg {...commonProps} aria-hidden="true">
          <path d="M12 5v14" /><path d="m6 15 6 6 6-6" />
        </svg>
      )
    case 'expenses':
      return (
        <svg {...commonProps} aria-hidden="true">
          <path d="M12 19V5" /><path d="m18 9-6-6-6 6" />
        </svg>
      )
    default:
      return null
  }
}

function Dashboard({ onSignOut, onNavigate }: { onSignOut: () => void; onNavigate?: (path: string) => void }) {
  const user = getStoredSession() ?? {
    id: 'mock-user-001',
    fullName: 'John Doe',
    email: 'john.doe@example.com',
  }

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/dashboard'

  return (
    <main className="dashboard-shell">
      <aside className="dashboard-sidebar" aria-label="Sidebar navigation">
        <div className="dashboard-brand" aria-label="SecureBank brand">
          <span className="dashboard-brand-mark" aria-hidden="true">S</span>
          <span className="dashboard-brand-label">SecureBank</span>
        </div>

        <nav aria-label="Primary navigation">
          <ul className="nav-list">
            {navItems.map((item) => {
              const isActive =
                (item.label === 'Dashboard' && currentPath === '/dashboard') ||
                (item.label === 'Transfer Money' && currentPath === '/transfer') ||
                (item.label === 'Pay Bills' && currentPath === '/bills')

              return (
                <li key={item.label}>
                  <button
                    type="button"
                    className={`nav-item${isActive ? ' active' : ''}`}
                    onClick={() => onNavigate?.(item.route)}
                  >
                    <MenuIcon type={item.icon} />
                    <span>{item.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <button
          type="button"
          className="logout-button"
          onClick={() => {
            onSignOut()
            navigateTo('/signin')
          }}
        >
          <MenuIcon type="logout" />
          <span>Logout</span>
        </button>
      </aside>

      <section className="dashboard-main" aria-labelledby="dashboard-heading">
        <header className="dashboard-header">
          <div>
            <h1 id="dashboard-heading">Dashboard</h1>
          </div>
        </header>

        <p className="dashboard-subtitle">Welcome back, {user.fullName}</p>

        <div className="summary-grid" aria-label="Account summary cards">
          {summaryCards.map((card) => (
            <article key={card.label} className="summary-card">
              <div className="summary-card-header">
                <p>{card.label}</p>
                <span className={`trend-pill ${card.trend}`} aria-hidden="true">
                  <MenuIcon type={card.icon} />
                </span>
              </div>
              <h2>{card.value}</h2>
              <span className="summary-helper">{card.helper}</span>
            </article>
          ))}
        </div>

        <section className="panel" aria-labelledby="activity-heading">
          <div className="panel-header">
            <div>
              <h3 id="activity-heading">Recent Transactions</h3>
              <small>Your latest account activity</small>
            </div>
          </div>

          <ul className="transaction-list">
            {transactions.map((transaction) => (
              <li key={transaction.id} className="transaction-item">
                <div className="transaction-left">
                  <span className={`transaction-icon ${transaction.type}`} aria-hidden="true">
                    <MenuIcon type={transaction.icon} />
                  </span>
                  <div>
                    <strong>{transaction.label}</strong>
                    <span>{transaction.date}</span>
                  </div>
                </div>
                <span className={transaction.type === 'credit' ? 'credit-amount' : 'debit-amount'}>
                  {transaction.amount}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </section>
    </main>
  )
}

export default Dashboard

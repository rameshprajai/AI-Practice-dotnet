import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { getStoredSession, navigateTo } from '../auth/session'
import { getAccounts, getRecipients, submitTransfer } from './api'
import type { AccountSummary, RecipientSummary, TransferFormValues } from './types'
import { transferSchema } from './validation'

const defaultValues: TransferFormValues = {
  fromAccountId: '',
  toAccountId: '',
  amount: '',
  currency: 'USD',
  memo: '',
}

const fallbackAccounts: AccountSummary[] = [
  { id: 'ACC-4532', type: 'Checking Account', balance: 24587.5, currency: 'USD', status: 'active' },
  { id: 'ACC-7821', type: 'Savings Account', balance: 12450.0, currency: 'USD', status: 'active' },
  { id: 'ACC-9014', type: 'Travel Fund', balance: 6800.0, currency: 'USD', status: 'active' },
]

const navItems = [
  { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
  { label: 'Transfer Money', icon: 'transfer', route: '/transfer' },
  { label: 'Pay Bills', icon: 'bills', route: '/bills' },
]

function MenuIcon({ type }: { type: string }) {
  const commonProps = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  switch (type) {
    case 'dashboard':
      return (
        <svg {...commonProps} aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="4" rx="1.5" />
          <rect x="14" y="11" width="7" height="10" rx="1.5" />
          <rect x="3" y="12" width="7" height="9" rx="1.5" />
        </svg>
      )
    case 'transfer':
      return (
        <svg {...commonProps} aria-hidden="true">
          <path d="M8 7h10" />
          <path d="M13 2l5 5-5 5" />
          <path d="M16 17H6" />
          <path d="M11 12l-5 5 5 5" />
        </svg>
      )
    case 'bills':
      return (
        <svg {...commonProps} aria-hidden="true">
          <path d="M3.5 8.5A2.5 2.5 0 0 1 6 6h12a2.5 2.5 0 0 1 2.5 2.5v7A2.5 2.5 0 0 1 18 18H6a2.5 2.5 0 0 1-2.5-2.5v-7Z" />
          <path d="M8 10h8" />
          <path d="M8 14h5" />
        </svg>
      )
    case 'logout':
      return (
        <svg {...commonProps} aria-hidden="true">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <path d="M16 17l5-5-5-5" />
          <path d="M21 12H9" />
        </svg>
      )
    default:
      return null
  }
}

function TransferMoneyPage() {
  const [accounts, setAccounts] = useState<AccountSummary[]>(fallbackAccounts)
  const [recipients, setRecipients] = useState<RecipientSummary[]>([
    { id: 'REC-1001', name: 'Jane Smith', nickname: 'Recent recipient', accountId: '...8932' },
    { id: 'REC-1002', name: 'Mike Johnson', nickname: 'Recent recipient', accountId: '...1204' },
  ])
  const [isLoading, setIsLoading] = useState(true)
  const [reviewMode, setReviewMode] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<TransferFormValues>({
    defaultValues,
    resolver: zodResolver(transferSchema),
    mode: 'onSubmit',
  })

  const formValues = watch()
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/transfer'
  const user = getStoredSession() ?? {
    id: 'mock-user-001',
    fullName: 'John Doe',
    email: 'john.doe@example.com',
  }

  useEffect(() => {
    const loadTransferData = async () => {
      try {
        const [accountsResponse, recipientsResponse] = await Promise.all([getAccounts(), getRecipients()])
        setAccounts(accountsResponse.accounts.length > 0 ? accountsResponse.accounts : fallbackAccounts)
        setRecipients(recipientsResponse.recipients.length > 0 ? recipientsResponse.recipients : [
          { id: 'REC-1001', name: 'Jane Smith', nickname: 'Recent recipient', accountId: '...8932' },
          { id: 'REC-1002', name: 'Mike Johnson', nickname: 'Recent recipient', accountId: '...1204' },
        ])
      } catch (error) {
        setAccounts(fallbackAccounts)
        setRecipients([
          { id: 'REC-1001', name: 'Jane Smith', nickname: 'Recent recipient', accountId: '...8932' },
          { id: 'REC-1002', name: 'Mike Johnson', nickname: 'Recent recipient', accountId: '...1204' },
        ])

        const message = error instanceof Error ? error.message.split(':').slice(1).join(':') || error.message : 'Unable to load transfer data.'
        setError('root', {
          type: 'server',
          message,
        })
      } finally {
        setIsLoading(false)
      }
    }

    void loadTransferData()
  }, [setError])

  const selectedAccount = useMemo(
    () => accounts.find((account) => account.id === formValues.fromAccountId) ?? null,
    [accounts, formValues.fromAccountId],
  )

  const selectedRecipient = useMemo(
    () => recipients.find((recipient) => recipient.accountId === formValues.toAccountId || recipient.id === formValues.toAccountId) ?? null,
    [formValues.toAccountId, recipients],
  )

  const reviewSummary = useMemo(() => {
    const amount = Number(formValues.amount || 0)

    return {
      source: selectedAccount?.type ?? 'Not selected',
      recipient: selectedRecipient?.name ?? 'Not selected',
      amount,
      availableBalance: selectedAccount?.balance ?? 0,
    }
  }, [formValues.amount, selectedAccount, selectedRecipient])

  const onConfirm = async (values: TransferFormValues) => {
    clearErrors('root')
    setSuccessMessage(null)

    try {
      const response = await submitTransfer(values)
      const enteredRecipientValue = values.toAccountId.trim()
      const nextRecipientLabel = enteredRecipientValue.includes('@')
        ? enteredRecipientValue.split('@')[0].replace(/[._-]/g, ' ')
        : enteredRecipientValue

      setRecipients((currentRecipients) => {
        const trimmedName = nextRecipientLabel.trim() || 'New Recipient'
        const recipientEntry: RecipientSummary = {
          id: `REC-${Date.now()}`,
          name: trimmedName
            .split(' ')
            .filter(Boolean)
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' '),
          nickname: 'Recent recipient',
          accountId: enteredRecipientValue || 'Unknown account',
        }

        const existingIndex = currentRecipients.findIndex((recipient) => recipient.accountId === recipientEntry.accountId)
        if (existingIndex >= 0) {
          const nextList = [...currentRecipients]
          nextList.splice(existingIndex, 1)
          return [recipientEntry, ...nextList]
        }

        return [recipientEntry, ...currentRecipients].slice(0, 5)
      })

      setSuccessMessage(response.message)
      setReviewMode(false)
      reset(defaultValues)
    } catch (error) {
      const message = error instanceof Error ? error.message.split(':').slice(1).join(':') || error.message : 'Unable to process this transfer.'
      setError('root', {
        type: 'server',
        message,
      })
    }
  }

  const onCancel = () => {
    setReviewMode(false)
    clearErrors('root')
    reset(defaultValues)
    navigateTo('/dashboard')
  }

  const handleRecipientPick = (recipientAccount: string) => {
    setValue('toAccountId', recipientAccount, {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  return (
    <main className="transfer-shell">
      <aside className="dashboard-sidebar transfer-sidebar" aria-label="Sidebar navigation">
        <div className="dashboard-brand" aria-label="SecureBank brand">
          <span className="dashboard-brand-mark" aria-hidden="true">S</span>
          <span className="dashboard-brand-label">SecureBank</span>
        </div>

        <nav aria-label="Primary navigation">
          <ul className="nav-list">
            {navItems.map((item) => {
              const isActive = currentPath === item.route

              return (
                <li key={item.label}>
                  <button
                    type="button"
                    className={`nav-item${isActive ? ' active' : ''}`}
                    onClick={() => navigateTo(item.route)}
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
            sessionStorage.removeItem('securebank-auth')
            navigateTo('/signin')
          }}
        >
          <MenuIcon type="logout" />
          <span>Logout</span>
        </button>
      </aside>

      <section className="transfer-page" aria-label="Transfer money page">
        <header className="transfer-header">
          <div>
            <h1>Transfer Money</h1>
            <p className="transfer-subtitle">Send money to another account</p>
          </div>
        </header>

        <div className="transfer-card">
          <div className="transfer-card-header">
            <h2>New Transfer</h2>
            <p>Enter transfer details below</p>
          </div>

          <form className="transfer-form" onSubmit={handleSubmit(onConfirm)} noValidate>
            <div className="field-group">
              <label htmlFor="fromAccountId">From Account</label>
              <select
                id="fromAccountId"
                aria-label="Source Account"
                aria-invalid={Boolean(errors.fromAccountId)}
                aria-describedby={errors.fromAccountId ? 'fromAccountId-error' : undefined}
                disabled={isLoading || accounts.length === 0}
                {...register('fromAccountId')}
              >
                <option value="">Select an account</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.type} (...{account.id.slice(-4)}) - ${account.balance.toFixed(2)}
                  </option>
                ))}
              </select>
              {errors.fromAccountId && (
                <span id="fromAccountId-error" className="field-error" role="alert">
                  {errors.fromAccountId.message}
                </span>
              )}
            </div>

            <div className="field-group">
              <label htmlFor="toAccountId">To Account / Recipient</label>
              <input
                id="toAccountId"
                type="text"
                aria-label="To account"
                placeholder="Account number or email address"
                aria-invalid={Boolean(errors.toAccountId)}
                aria-describedby={errors.toAccountId ? 'toAccountId-error' : undefined}
                {...register('toAccountId')}
              />
              {errors.toAccountId && (
                <span id="toAccountId-error" className="field-error" role="alert">
                  {errors.toAccountId.message}
                </span>
              )}
            </div>

            <div className="field-group">
              <label htmlFor="amount">Amount</label>
              <div className="amount-input-wrap">
                <span className="currency-prefix">$</span>
                <input
                  id="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  inputMode="decimal"
                  placeholder="0.00"
                  aria-invalid={Boolean(errors.amount)}
                  aria-describedby={errors.amount ? 'amount-error' : undefined}
                  {...register('amount')}
                />
              </div>
              {errors.amount && (
                <span id="amount-error" className="field-error" role="alert">
                  {errors.amount.message}
                </span>
              )}
            </div>

            <div className="field-group">
              <label htmlFor="memo">Description (Optional)</label>
              <textarea
                id="memo"
                rows={4}
                placeholder="What's this transfer for?"
                aria-label="Memo"
                aria-invalid={Boolean(errors.memo)}
                aria-describedby={errors.memo ? 'memo-error' : undefined}
                {...register('memo')}
              />
              {errors.memo && (
                <span id="memo-error" className="field-error" role="alert">
                  {errors.memo.message}
                </span>
              )}
            </div>

            {errors.root && (
              <div className="form-error" role="alert">
                {errors.root.message}
              </div>
            )}

            {successMessage && (
              <div className="success-banner" role="status">
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              className="primary-button transfer-submit"
              disabled={isSubmitting || isLoading}
              aria-label="Submit transfer"
            >
              {isSubmitting ? 'Processing...' : 'Transfer Money'}
            </button>
          </form>
        </div>

        <div className="transfer-card recent-transfers-card">
          <div className="transfer-card-header compact">
            <h2>Recent Recipients</h2>
            <p>Quick transfer to frequently used accounts</p>
          </div>

          <ul className="recipient-list">
            {recipients.length === 0 ? (
              <li className="recipient-empty">No recent recipients yet.</li>
            ) : (
              recipients.map((recipient) => (
                <li key={recipient.id} className="recipient-row">
                  <div>
                    <strong>{recipient.name}</strong>
                    <span>{recipient.accountId ? `Account ${recipient.accountId}` : 'Recent recipient'}</span>
                  </div>
                  <button type="button" className="select-button" onClick={() => handleRecipientPick(recipient.accountId || recipient.id)}>
                    Select
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="transfer-summary-info" aria-live="polite">
          <div className="summary-row">
            <span>From</span>
            <strong>{selectedAccount ? `${selectedAccount.type} • ${selectedAccount.id}` : 'Not selected'}</strong>
          </div>
          <div className="summary-row">
            <span>To</span>
            <strong>{selectedRecipient ? `${selectedRecipient.name} • ${selectedRecipient.id}` : 'Not selected'}</strong>
          </div>
          <div className="summary-row">
            <span>Amount</span>
            <strong>{reviewSummary.amount > 0 ? `$${reviewSummary.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$0.00'}</strong>
          </div>
          <div className="summary-row">
            <span>Available</span>
            <strong>{selectedAccount ? `$${selectedAccount.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$0.00'}</strong>
          </div>

          {reviewMode && selectedAccount && Number(formValues.amount || 0) > selectedAccount.balance && (
            <div className="alert-box warning" role="alert">
              This transfer exceeds the available balance in the selected account.
            </div>
          )}

          {reviewMode && !selectedAccount && (
            <div className="alert-box warning" role="alert">
              Please select a valid source account before continuing.
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default TransferMoneyPage

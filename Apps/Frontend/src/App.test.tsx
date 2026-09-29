import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, vi } from 'vitest'

import App from './App'
import { signinAccount } from './features/auth/api'
import { getAccounts, getRecipients, submitTransfer } from './features/transfer/api'

vi.mock('./features/auth/api', () => ({
  signupAccount: vi.fn(),
  signinAccount: vi.fn(),
}))

vi.mock('./features/transfer/api', () => ({
  getAccounts: vi.fn(),
  getRecipients: vi.fn(),
  submitTransfer: vi.fn(),
}))

beforeEach(() => {
  window.history.pushState({}, '', '/')
  sessionStorage.clear()
  vi.clearAllMocks()
})

describe('Signup screen', () => {
  it('renders the create account form', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
  })

  it('shows validation errors when required fields are missing', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /create account/i }))

    expect(await screen.findByText(/full name is required/i)).toBeInTheDocument()
    expect(screen.getByText(/enter a valid email address/i)).toBeInTheDocument()
    expect(screen.getByText(/password must be at least 8 characters long/i)).toBeInTheDocument()
  })

  it('shows a mismatch error when the passwords differ', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByLabelText(/full name/i), 'Jane Doe')
    await user.type(screen.getByLabelText(/email/i), 'jane@example.com')
    await user.type(screen.getByLabelText(/^password$/i), 'SecurePass!123')
    await user.type(screen.getByLabelText(/confirm password/i), 'DifferentPass!123')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument()
  })

  it('renders the sign-in screen when the route is /signin', () => {
    window.history.pushState({}, '', '/signin')
    render(<App />)

    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument()
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument()
  })

  it('shows validation errors on the sign-in screen when fields are empty', async () => {
    const user = userEvent.setup()
    window.history.pushState({}, '', '/signin')
    render(<App />)

    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByText(/enter a valid email address/i)).toBeInTheDocument()
    expect(screen.getByText(/password is required/i)).toBeInTheDocument()
  })

  it('shows an authentication error when sign in fails', async () => {
    const user = userEvent.setup()
    vi.mocked(signinAccount).mockRejectedValueOnce(new Error('INVALID_CREDENTIALS:The email or password you entered is incorrect.'))
    window.history.pushState({}, '', '/signin')
    render(<App />)

    await user.type(screen.getByLabelText(/email/i), 'jane.doe@example.com')
    await user.type(screen.getByLabelText(/^password$/i), 'WrongPass!123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByText(/the email or password you entered is incorrect/i)).toBeInTheDocument()
  })

  it('redirects unauthenticated users away from the dashboard route', () => {
    window.history.pushState({}, '', '/dashboard')
    render(<App />)

    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument()
  })

  it('renders the dashboard after a successful sign in', async () => {
    const user = userEvent.setup()
    vi.mocked(signinAccount).mockResolvedValueOnce({
      success: true,
      message: 'Sign in successful',
      user: {
        id: 'u-123',
        fullName: 'Jane Doe',
        email: 'jane.doe@example.com',
      },
    })

    window.history.pushState({}, '', '/signin')
    render(<App />)

    await user.type(screen.getByLabelText(/email/i), 'jane.doe@example.com')
    await user.type(screen.getByLabelText(/^password$/i), 'SecurePass!123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByRole('heading', { name: /dashboard/i })).toBeInTheDocument()
  })

  it('redirects unauthenticated users away from the transfer route', () => {
    window.history.pushState({}, '', '/transfer')
    render(<App />)

    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument()
  })

  it('renders the transfer screen and submits a valid transfer', async () => {
    const user = userEvent.setup()
    sessionStorage.setItem('securebank-auth', JSON.stringify({
      id: 'u-123',
      fullName: 'Jane Doe',
      email: 'jane.doe@example.com',
    }))

    vi.mocked(getAccounts).mockResolvedValueOnce({
      success: true,
      accounts: [
        { id: 'ACC-1001', type: 'Checking', balance: 2450.75, currency: 'USD', status: 'active' },
      ],
    })
    vi.mocked(getRecipients).mockResolvedValueOnce({
      success: true,
      recipients: [
        { id: 'BEN-1001', name: 'Alicia Hart', nickname: 'Family Savings', accountId: 'ACC-3001' },
      ],
    })
    vi.mocked(submitTransfer).mockResolvedValueOnce({
      success: true,
      message: 'Transfer processed successfully',
      transfer: {
        id: 'TRF-1001',
        fromAccountId: 'ACC-1001',
        toAccountId: 'ACC-3001',
        amount: 150,
        currency: 'USD',
        status: 'completed',
        createdAt: '2026-09-28T10:15:00Z',
      },
    })

    window.history.pushState({}, '', '/transfer')
    render(<App />)

    expect(await screen.findByRole('heading', { name: /transfer money/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /new transfer process/i })).toBeInTheDocument()

    await waitFor(() => expect(screen.getByLabelText(/source account/i)).toBeEnabled())
    await user.selectOptions(screen.getByLabelText(/source account/i), 'ACC-1001')
    await user.clear(screen.getByLabelText(/to account/i))
    await user.type(screen.getByLabelText(/to account/i), 'BEN-1001')
    await user.clear(screen.getByLabelText(/amount/i))
    await user.type(screen.getByLabelText(/amount/i), '150')
    await user.type(screen.getByLabelText(/memo/i), 'Monthly transfer')
    await user.click(screen.getByRole('button', { name: /submit transfer/i }))

    expect(await screen.findByText(/transfer processed successfully/i)).toBeInTheDocument()
  })

  it('blocks submission and shows errors when required fields are missing', async () => {
    const user = userEvent.setup()
    sessionStorage.setItem('securebank-auth', JSON.stringify({
      id: 'u-123',
      fullName: 'Jane Doe',
      email: 'jane.doe@example.com',
    }))
    vi.mocked(getAccounts).mockResolvedValueOnce({ success: true, accounts: [] })
    vi.mocked(getRecipients).mockResolvedValueOnce({ success: true, recipients: [] })
    window.history.pushState({}, '', '/transfer')

    render(<App />)

    await user.click(await screen.findByRole('button', { name: /submit transfer/i }))

    expect(await screen.findByText(/please select a source account/i)).toBeInTheDocument()
    expect(screen.getByText(/please enter a recipient account number or email address/i)).toBeInTheDocument()
    expect(screen.getByText(/amount is required/i)).toBeInTheDocument()
    expect(submitTransfer).not.toHaveBeenCalled()
  })

  it('blocks a zero-value transfer', async () => {
    const user = userEvent.setup()
    sessionStorage.setItem('securebank-auth', JSON.stringify({
      id: 'u-123',
      fullName: 'Jane Doe',
      email: 'jane.doe@example.com',
    }))
    vi.mocked(getAccounts).mockResolvedValueOnce({
      success: true,
      accounts: [{ id: 'ACC-1001', type: 'Checking', balance: 2450.75, currency: 'USD', status: 'active' }],
    })
    vi.mocked(getRecipients).mockResolvedValueOnce({ success: true, recipients: [] })
    window.history.pushState({}, '', '/transfer')

    render(<App />)

    await waitFor(() => expect(screen.getByLabelText(/source account/i)).toBeEnabled())
    await user.selectOptions(screen.getByLabelText(/source account/i), 'ACC-1001')
    await user.type(screen.getByLabelText(/to account/i), 'ACC-3001')
    await user.type(screen.getByLabelText(/amount/i), '0')
    await user.click(screen.getByRole('button', { name: /submit transfer/i }))

    expect(await screen.findByText(/amount must be greater than zero/i)).toBeInTheDocument()
    expect(submitTransfer).not.toHaveBeenCalled()
  })

  it('shows a transfer error and allows retrying after the API fails', async () => {
    const user = userEvent.setup()
    sessionStorage.setItem('securebank-auth', JSON.stringify({
      id: 'u-123',
      fullName: 'Jane Doe',
      email: 'jane.doe@example.com',
    }))
    vi.mocked(getAccounts).mockResolvedValueOnce({
      success: true,
      accounts: [{ id: 'ACC-1001', type: 'Checking', balance: 2450.75, currency: 'USD', status: 'active' }],
    })
    vi.mocked(getRecipients).mockResolvedValueOnce({ success: true, recipients: [] })
    vi.mocked(submitTransfer)
      .mockRejectedValueOnce(new Error('INSUFFICIENT_FUNDS:Not enough funds in this account.'))
      .mockResolvedValueOnce({
        success: true,
        message: 'Transfer processed successfully',
        transfer: {
          id: 'TRF-1002',
          fromAccountId: 'ACC-1001',
          toAccountId: 'ACC-3001',
          amount: 150,
          currency: 'USD',
          status: 'completed',
          createdAt: '2026-09-28T10:15:00Z',
        },
      })
    window.history.pushState({}, '', '/transfer')

    render(<App />)

    await waitFor(() => expect(screen.getByLabelText(/source account/i)).toBeEnabled())
    await user.selectOptions(screen.getByLabelText(/source account/i), 'ACC-1001')
    await user.type(screen.getByLabelText(/to account/i), 'ACC-3001')
    await user.type(screen.getByLabelText(/amount/i), '150')
    await user.click(screen.getByRole('button', { name: /submit transfer/i }))

    expect(await screen.findByText(/not enough funds in this account/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /submit transfer/i }))

    expect(await screen.findByText(/transfer processed successfully/i)).toBeInTheDocument()
    expect(submitTransfer).toHaveBeenCalledTimes(2)
  })
})

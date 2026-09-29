import { expect, test } from '@playwright/test'

const signupPage = 'http://192.168.29.212:5175/'

test.describe('SecureBank signup flow', () => {
  test('happy path - creates an account successfully', async ({ page }) => {
    const uniqueEmail = `jane.${Date.now()}@example.com`

    await page.goto(signupPage)
    await page.getByTestId('full-name-input').fill('Jane Doe')
    await page.getByTestId('email-input').fill(uniqueEmail)
    await page.getByTestId('password-input').fill('SecurePass!123')
    await page.getByTestId('confirm-password-input').fill('SecurePass!123')

    await page.getByTestId('create-account-button').click()

    await expect(page.getByRole('status')).toContainText('Account created successfully')
    await expect(page.getByTestId('full-name-input')).toHaveValue('')
  })

  test('validation errors are shown for empty required fields', async ({ page }) => {
    await page.goto(signupPage)
    await page.getByTestId('create-account-button').click()

    await expect(page.getByText('Full name is required.')).toBeVisible()
    await expect(page.getByText('Enter a valid email address.')).toBeVisible()
    await expect(page.getByText('Password must be at least 8 characters long.')).toBeVisible()
  })

  test('shows mismatch validation when password confirmation differs', async ({ page }) => {
    await page.goto(signupPage)
    await page.getByTestId('full-name-input').fill('Jane Doe')
    await page.getByTestId('email-input').fill('jane.mismatch@example.com')
    await page.getByTestId('password-input').fill('SecurePass!123')
    await page.getByTestId('confirm-password-input').fill('DifferentPass!123')

    await page.getByTestId('create-account-button').click()

    await expect(page.getByText('Passwords do not match.')).toBeVisible()
  })

  test('navigates to the sign-in page from signup', async ({ page }) => {
    await page.goto(signupPage)
    await page.getByRole('link', { name: 'Sign in' }).click()

    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible()
    await expect(page.getByText('Welcome back')).toBeVisible()
  })

  test('duplicate email shows a conflict error', async ({ page }) => {
    const duplicateEmail = `duplicate.${Date.now()}@example.com`

    await page.goto(signupPage)
    await page.getByTestId('full-name-input').fill('Jane Doe')
    await page.getByTestId('email-input').fill(duplicateEmail)
    await page.getByTestId('password-input').fill('SecurePass!123')
    await page.getByTestId('confirm-password-input').fill('SecurePass!123')
    await page.getByTestId('create-account-button').click()

    await expect(page.getByRole('status')).toContainText('Account created successfully')

    await page.reload()
    await page.getByTestId('full-name-input').fill('Jane Doe')
    await page.getByTestId('email-input').fill(duplicateEmail)
    await page.getByTestId('password-input').fill('SecurePass!123')
    await page.getByTestId('confirm-password-input').fill('SecurePass!123')
    await page.getByTestId('create-account-button').click()

    await expect(page.getByText('An account with this email already exists.')).toBeVisible()
  })
})

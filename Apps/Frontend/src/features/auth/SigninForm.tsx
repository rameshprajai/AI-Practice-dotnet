import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { signinAccount } from './api'
import { navigateTo, setStoredSession } from './session'
import type { SigninFormValues } from './types'
import { signinSchema } from './validation'

const defaultValues: SigninFormValues = {
  email: '',
  password: '',
}

function SigninForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<SigninFormValues>({
    defaultValues,
    resolver: zodResolver(signinSchema),
    mode: 'onSubmit',
  })

  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const onSubmit = async (values: SigninFormValues) => {
    clearErrors('root')
    setSuccessMessage(null)

    try {
      const response = await signinAccount(values)
      setStoredSession(response.user)
      setSuccessMessage(response.message)
      navigateTo('/dashboard')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to sign in right now.'
      const [code, ...rest] = message.split(':')
      const text = rest.join(':') || 'Unable to sign in right now.'

      setError('root', {
        type: 'server',
        message: code === 'INVALID_CREDENTIALS' ? 'The email or password you entered is incorrect.' : text,
      })
    }
  }

  return (
    <form className="signup-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="field-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          data-testid="signin-email-input"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'email-error' : undefined}
          {...register('email')}
        />
        {errors.email && (
          <span id="email-error" className="field-error" role="alert">
            {errors.email.message}
          </span>
        )}
      </div>

      <div className="field-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          data-testid="signin-password-input"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? 'password-error' : undefined}
          {...register('password')}
        />
        {errors.password && (
          <span id="password-error" className="field-error" role="alert">
            {errors.password.message}
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

      <button type="submit" className="primary-button" data-testid="signin-button" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  )
}

export default SigninForm

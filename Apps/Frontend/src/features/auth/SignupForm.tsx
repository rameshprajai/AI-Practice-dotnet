import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { signupAccount } from './api'
import type { SignupFormValues } from './types'
import { signupSchema } from './validation'

const defaultValues: SignupFormValues = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
}

function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
    reset,
  } = useForm<SignupFormValues>({
    defaultValues,
    resolver: zodResolver(signupSchema),
    mode: 'onSubmit',
  })

  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const onSubmit = async (values: SignupFormValues) => {
    clearErrors('root')
    setSuccessMessage(null)

    try {
      const response = await signupAccount(values)
      setSuccessMessage(`${response.message}. You can now sign in.`)
      reset(defaultValues)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to create your account.'
      const [code, ...rest] = message.split(':')
      const text = rest.join(':') || 'Unable to create your account.'

      setError('root', {
        type: 'server',
        message: code === 'EMAIL_ALREADY_EXISTS' ? 'An account with this email already exists.' : text,
      })
    }
  }

  return (
    <form className="signup-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="field-group">
        <label htmlFor="fullName">Full Name</label>
        <input
          id="fullName"
          type="text"
          autoComplete="name"
          data-testid="full-name-input"
          aria-invalid={Boolean(errors.fullName)}
          aria-describedby={errors.fullName ? 'fullName-error' : undefined}
          {...register('fullName')}
        />
        {errors.fullName && (
          <span id="fullName-error" className="field-error" role="alert">
            {errors.fullName.message}
          </span>
        )}
      </div>

      <div className="field-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          data-testid="email-input"
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
          autoComplete="new-password"
          data-testid="password-input"
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

      <div className="field-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          data-testid="confirm-password-input"
          aria-invalid={Boolean(errors.confirmPassword)}
          aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <span id="confirmPassword-error" className="field-error" role="alert">
            {errors.confirmPassword.message}
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

      <button type="submit" className="primary-button" data-testid="create-account-button" disabled={isSubmitting}>
        {isSubmitting ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  )
}

export default SignupForm

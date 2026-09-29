import axios from 'axios'

import type {
  SigninErrorResponse,
  SigninFormValues,
  SigninSuccessResponse,
  SignupErrorResponse,
  SignupFormValues,
  SignupSuccessResponse,
} from './types'

const api = axios.create({
  baseURL: 'http://192.168.1.8:5155',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export async function signupAccount(payload: SignupFormValues): Promise<SignupSuccessResponse> {
  try {
    const response = await api.post<SignupSuccessResponse>('/api/v1/auth/signup', payload)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const data = error.response.data as SignupErrorResponse
      const message = data?.error?.message ?? 'Unable to create your account right now.'
      const code = data?.error?.code ?? 'VALIDATION_ERROR'
      throw new Error(`${code}:${message}`)
    }

    throw new Error('NETWORK_ERROR:Unable to create your account right now.')
  }
}

export async function signinAccount(payload: SigninFormValues): Promise<SigninSuccessResponse> {
  try {
    const response = await api.post<SigninSuccessResponse>('/api/v1/auth/signin', payload)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const data = error.response.data as SigninErrorResponse
      const message = data?.error?.message ?? 'Unable to sign in right now.'
      const code = data?.error?.code ?? 'VALIDATION_ERROR'
      throw new Error(`${code}:${message}`)
    }

    throw new Error('NETWORK_ERROR:Unable to sign in right now.')
  }
}

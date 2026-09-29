import axios from 'axios'

import { getStoredSession } from '../auth/session'
import type { AccountsResponse, RecipientsResponse, TransferErrorResponse, TransferFormValues, TransferSuccessResponse } from './types'

const api = axios.create({
  baseURL: 'http://192.168.1.8:5155',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

function getAuthHeaders() {
  const user = getStoredSession()
  if (!user?.email) {
    throw new Error('UNAUTHORIZED:Authenticated user is required.')
  }

  return {
    'X-User-Email': user.email,
  }
}

export async function getAccounts(): Promise<AccountsResponse> {
  try {
    const response = await api.get<AccountsResponse>('/api/v1/accounts', {
      headers: getAuthHeaders(),
    })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const data = error.response.data as TransferErrorResponse
      const message = data?.error?.message ?? 'Unable to load your accounts right now.'
      const code = data?.error?.code ?? 'VALIDATION_ERROR'
      throw new Error(`${code}:${message}`)
    }

    throw new Error('NETWORK_ERROR:Unable to load your accounts right now.')
  }
}

export async function getRecipients(): Promise<RecipientsResponse> {
  try {
    const response = await api.get<RecipientsResponse>('/api/v1/recipients', {
      headers: getAuthHeaders(),
    })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const data = error.response.data as TransferErrorResponse
      const message = data?.error?.message ?? 'Unable to load your recipients right now.'
      const code = data?.error?.code ?? 'VALIDATION_ERROR'
      throw new Error(`${code}:${message}`)
    }

    throw new Error('NETWORK_ERROR:Unable to load your recipients right now.')
  }
}

export async function submitTransfer(payload: TransferFormValues): Promise<TransferSuccessResponse> {
  try {
    const response = await api.post<TransferSuccessResponse>('/api/v1/transfers', {
      fromAccountId: payload.fromAccountId,
      toAccountId: payload.toAccountId,
      amount: Number(payload.amount),
      currency: payload.currency ?? 'USD',
      memo: payload.memo ?? '',
    }, {
      headers: getAuthHeaders(),
    })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const data = error.response.data as TransferErrorResponse
      const message = data?.error?.message ?? 'Unable to process this transfer right now.'
      const code = data?.error?.code ?? 'VALIDATION_ERROR'
      throw new Error(`${code}:${message}`)
    }

    throw new Error('NETWORK_ERROR:Unable to process this transfer right now.')
  }
}

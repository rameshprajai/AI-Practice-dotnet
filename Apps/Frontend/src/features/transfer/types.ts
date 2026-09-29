export type AccountSummary = {
  id: string
  type: string
  balance: number
  currency: string
  status: string
}

export type RecipientSummary = {
  id: string
  name: string
  nickname: string
  accountId: string
}

export type TransferFormValues = {
  fromAccountId: string
  toAccountId: string
  amount: string
  currency?: string
  memo?: string
}

export type AccountsResponse = {
  success: boolean
  accounts: AccountSummary[]
}

export type RecipientsResponse = {
  success: boolean
  recipients: RecipientSummary[]
}

export type TransferSuccessResponse = {
  success: true
  message: string
  transfer: {
    id: string
    fromAccountId: string
    toAccountId: string
    amount: number
    currency: string
    status: string
    createdAt: string
  }
}

export type TransferErrorResponse = {
  success: false
  error: {
    code: string
    message: string
  }
}

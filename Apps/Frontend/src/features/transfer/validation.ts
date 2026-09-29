import { z } from 'zod'

export const transferSchema = z.object({
  fromAccountId: z.string().trim().min(1, 'Please select a source account.'),
  toAccountId: z.string().trim().min(1, 'Please enter a recipient account number or email address.'),
  amount: z
    .string()
    .trim()
    .min(1, 'Amount is required.')
    .refine((value) => {
      const parsed = Number(value)
      return !Number.isNaN(parsed) && parsed > 0
    }, 'Amount must be greater than zero.'),
  currency: z.string().optional().default('USD'),
  memo: z.string().max(200, 'Memo must be 200 characters or fewer.').optional().default(''),
})

export type TransferSchema = z.infer<typeof transferSchema>

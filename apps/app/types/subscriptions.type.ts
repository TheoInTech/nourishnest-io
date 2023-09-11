export enum SubscriptionStatus {
  ACTIVE = 'active',
  ON_TRIAL = 'on_trial',
  PAUSED = 'paused',
  PAST_DUE = 'past_due',
  UNPAID = 'unpaid',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

export enum InvoiceStatus {
  PAID = 'paid',
  VOID = 'void',
  REFUNDED = 'refunded',
  PENDING = 'pending',
}

import type { AssetSummary, CashflowSummary, ExpenseProportion } from '../types/dashboard.types'

export const DASHBOARD_ASSETS: AssetSummary[] = [
  { type: 'wallet', label: 'Wallet', amount: 'Rp 0', detail: '0 wallet', icon: 'pi-wallet', accentClass: 'bg-amber-100 text-amber-700' },
  { type: 'bank', label: 'Bank', amount: 'Rp 0', detail: '0 rekening', icon: 'pi-building-columns', accentClass: 'bg-blue-100 text-blue-700' },
  { type: 'investment', label: 'Investment', amount: 'Rp 0', detail: '0 portofolio', icon: 'pi-chart-line', accentClass: 'bg-brand-100 text-brand-700' },
]

export const DASHBOARD_CASHFLOW: CashflowSummary = { income: 'Rp 12.500.000', expense: 'Rp 7.850.000', incomeChange: '+12,4%', expenseChange: '+4,8%' }

export const DASHBOARD_PROPORTIONS: ExpenseProportion[] = [
  { label: 'Kebutuhan', value: 38, colorClass: 'bg-brand-700' },
  { label: 'Lifestyle', value: 25, colorClass: 'bg-brand-400' },
  { label: 'Transportasi', value: 18, colorClass: 'bg-amber-400' },
  { label: 'Lainnya', value: 19, colorClass: 'bg-slate-200' },
]

import { normalizeApiError } from '@/shared/api/api-error'
import { httpClient } from '@/shared/api/http-client'

export interface TransactionCategory { id: number; name: string; type: 'income' | 'expense' }
export interface CategoryPayload { name: string; type: 'income' | 'expense' }
export async function listCategories(): Promise<TransactionCategory[]> { try { const { data } = await httpClient.get<TransactionCategory[]>('/transaction-categories'); return data } catch (e) { throw normalizeApiError(e) } }
export async function createCategory(payload: CategoryPayload): Promise<TransactionCategory> { try { const { data } = await httpClient.post<TransactionCategory>('/transaction-categories', payload); return data } catch (e) { throw normalizeApiError(e) } }
export async function updateCategory(id: number, payload: CategoryPayload): Promise<TransactionCategory> { try { const { data } = await httpClient.put<TransactionCategory>(`/transaction-categories/${id}`, payload); return data } catch (e) { throw normalizeApiError(e) } }
export async function deleteCategory(id: number): Promise<void> { try { await httpClient.delete(`/transaction-categories/${id}`) } catch (e) { throw normalizeApiError(e) } }

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/modules/auth/stores/auth.store'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: { name: 'auth.login' },
    },
    {
      path: '/login',
      name: 'auth.login',
      component: () => import('@/modules/auth/pages/LoginPage.vue'),
      meta: { title: 'Masuk | FinSight AI' },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/modules/dashboard/views/DashboardView.vue'),
      meta: { title: 'Dashboard | FinSight AI', requiresAuth: true },
    },
    {
      path: '/transactions',
      name: 'transactions.list',
      component: () => import('@/modules/transactions/pages/TransactionListPage.vue'),
      meta: { title: 'Transaksi | FinSight AI', requiresAuth: true },
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('@/modules/chat/views/ChatView.vue'),
      meta: { title: 'Chat | FinSight AI', requiresAuth: true },
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  authStore.hydrate()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'auth.login', query: { redirect: to.fullPath } }
  }

  if (to.name === 'auth.login' && authStore.isAuthenticated) {
    return { name: 'dashboard' }
  }

  return true
})

router.afterEach((to) => {
  document.title = typeof to.meta.title === 'string' ? to.meta.title : 'FinSight AI'
})

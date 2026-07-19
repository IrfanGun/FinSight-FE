import { createRouter, createWebHistory } from 'vue-router'

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
  ],
  scrollBehavior: () => ({ top: 0 }),
})

router.afterEach((to) => {
  document.title = typeof to.meta.title === 'string' ? to.meta.title : 'FinSight AI'
})


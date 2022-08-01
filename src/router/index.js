import { createRouter, createWebHistory } from 'vue-router'
import StartPage from '../views/StartPage.vue'
import Landing from '../views/Landing.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'StartPage',
      component: StartPage,
      children: [
        {
          path: '/',
          name: 'Landing',
          component: Landing,
        }
      ]
    },
    {
      path: '/trips',
      name: 'TripsPage',
      component: () => import('../components/_tripsPage/TripsPage.vue'),
    },
    {
      path: '/create',
      name: 'CreateTripPage',
      component: () => import('../components/_createTrip/CreateTripPage.vue'),
    },
    {
      path: '/companions',
      name: 'CompanionsPage',
      component: () => import('../components/_companionsPage/CompanionsPage.vue'),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (to.name == 'TripsPage')
      return { top: 0 }
  }
})

export default router

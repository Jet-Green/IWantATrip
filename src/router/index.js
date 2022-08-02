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
      component: () => import('../views/TripsPage.vue'),
    },
    {
      path: '/create',
      name: 'CreateTripPage',
      component: () => import('../views/CreateTripPage.vue'),
    },
    {
      path: '/companions',
      name: 'CompanionsPage',
      component: () => import('../views/CompanionsPage.vue'),
    },
    {
      path: '/trip',
      name: 'TripInfoPage',
      component: () => import('../views/TripInfoPage.vue')
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if ((to.name == 'TripsPage') || (to.name == 'TripInfoPage') || (to.name == 'CompanionsPage'))
      return { top: 0 }
  }
})

export default router

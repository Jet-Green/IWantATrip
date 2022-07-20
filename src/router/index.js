import { createRouter, createWebHistory } from 'vue-router'
import StartPage from '../views/StartPage.vue'
import Landing from '../views/Landing.vue'
import TripsPage from '../views/TripsPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'StartPage',
      component: StartPage,
      children: [{
        path: '/',
        name: 'Landing',
        component: Landing,
      }]
    },
    {
      path: '/TripsPage',
      name: 'TripsPage',
      component: TripsPage,
    }
  ]
})

export default router

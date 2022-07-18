import { createRouter, createWebHistory } from 'vue-router'
import StartPage from '../views/StartPage.vue'
import Landing from '../views/Landing.vue'
import CityGuide from '../components/sections/CityGuide.vue'

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
      path: '/cityGuide',
      name: 'CityGuide',
      component: CityGuide,
    }
  ]
})

export default router

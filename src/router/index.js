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
      path: '/create-with-help',
      name: 'CreateTripWithHelp',
      component: () => import('../views/CreateTripWithHelp.vue'),
    },
    {
      path: '/create-no-help',
      name: 'CreateTripNoHelp',
      component: () => import('../views/CreateTripNoHelp.vue'),
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
    },
    {
      path: '/watch',
      name: 'ToWatch',
      component: () => import('../components/_guide/ToWatch.vue')
    },
    {
      path: '/eat',
      name: 'ToEat',
      component: () => import('../components/_guide/ToEat.vue')
    },
    {
      path: '/stay',
      name: 'ToStay',
      component: () => import('../components/_guide/ToStay.vue')
    },
    {
      path: '/sport',
      name: 'Sport',
      component: () => import('../components/_guide/Sport.vue')
    },
    {
      path: '/poster',
      name: 'Poster',
      component: () => import('../components/_guide/Poster.vue')
    },
    {
      path: '/excurs',
      name: 'Excursions',
      component: () => import('../components/_guide/Excursions.vue')
    },
    {
      path: '/enter',
      name: 'Entertainment',
      component: () => import('../components/_guide/Entertainment.vue')
    },
    {
      path: '/relax',
      name: 'Relax',
      component: () => import('../components/_guide/Relax.vue')
    },
    {
      path: '/guides',
      name: 'Guides',
      component: () => import('../components/_guide/Guides.vue')
    },
    {
      path: '/souvenirs',
      name: 'Souvenirs',
      component: () => import('../components/_guide/Souvenirs.vue')
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if ((to.name == 'TripsPage') || (to.name == 'TripInfoPage') || (to.name == 'CompanionsPage'))
      return { top: 0 }
    return savedPosition
  }
})

export default router

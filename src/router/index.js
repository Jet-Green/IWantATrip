import { createRouter, createWebHistory } from 'vue-router'
import Landing from '../views/Landing.vue'
import TripsPage from '../views/TripsPage.vue'



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Landing',
      component: Landing
    },
    {
      path: '/trips',
      name: 'TripsPage',
      component: TripsPage,
    },
    {
      path: '/company-info-page',
      name: 'CompanyInfoPage',
      component: () => import('../views/CompanyInfoPage.vue'),
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
      path: '/add-companion',
      name: 'AddCompanion',
      component: () => import('../views/AddCompanion.vue'),
    },
    {
      path: '/add-guide-element',
      name: 'AddGuideElement',
      component: () => import('../views/AddGuideElement.vue'),
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
    {
      path: '/dev',
      name: 'Dev',
      component: () => import('../components/DevPage.vue')
    },
    {
      path: '/cabinet',
      name: 'Cabinet',
      component: () => import('../views/Cabinet.vue')
    },
    {
      path: '/reg',
      name: 'RegForm',
      component: () => import('../components/RegForm.vue')
    },
    {
      path: '/auth',
      name: 'AuthForm',
      component: () => import('../components/AuthForm.vue')
    },
    {
      path: '/edit-trip',
      name: 'CompanyInfoPage',
      component: () => import('../components/_cabinet/EditTrip.vue'),
    },
    {
      path: '/calc',
      name: 'PriceCalc',
      component: () => import('../components/forms/PriceCalc.vue'),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if ((to.name == 'TripsPage') || (to.name == 'TripInfoPage') || (to.name == 'CompanionsPage') || (to.name == 'CreateTripNoHelp'))
      return { top: 0 }
    else return savedPosition
  }
})

export default router

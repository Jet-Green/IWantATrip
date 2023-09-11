import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../stores/auth'



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Landing',
      component: () => import('../views/Landing.vue'),
    },
    {
      path: '/wl',
      name: 'WaitingList',
      component: () => import('../components/WaitingList.vue'),
    },
    {
      path: '/trips',
      name: 'TripsPage',
      component: () => import('../components/_tripsPage/TripsList.vue'),
      // component: TripsPage,
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
      beforeEnter: async (to, from) => {
        let userStore = useAuth()
        if (!localStorage.getItem('token') || !userStore.isAuth)
          await userStore.checkAuth()

        if (!userStore.isAuth)
          return '/auth'
      }
    },
    {
      path: '/create-no-help',
      name: 'CreateTripNoHelp',
      component: () => import('../views/CreateTripNoHelp.vue'),
      beforeEnter: async (to, from) => {
        let userStore = useAuth()
        if (!localStorage.getItem('token') || !userStore.isAuth)
          await userStore.checkAuth()

        if (!userStore.isAuth)
          return '/auth'
      }
    },
    {
      path: '/copy-trip',
      name: 'CopyTrip',
      component: () => import('../views/CopyTrip.vue'),
      beforeEnter: async (to, from) => {
        let userStore = useAuth()
        if (!localStorage.getItem('token') || !userStore.isAuth)
          await userStore.checkAuth()

        if (!userStore.isAuth)
          return '/auth'
      }
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
      beforeEnter: async (to, from) => {
        let userStore = useAuth()
        if (!localStorage.getItem('token') || !userStore.isAuth)
          await userStore.checkAuth()

        if (!userStore.isAuth)
          return '/auth'
      }
    },
    {
      path: '/add-feedback',
      name: 'AddFeedback',
      component: () => import('../views/AddFeedback.vue'),
    },
    {
      path: '/add-guide-element',
      name: 'AddGuideElement',
      component: () => import('../views/AddGuideElement.vue'),
      beforeEnter: async (to, from) => {
        let userStore = useAuth()
        if (!localStorage.getItem('token') || !userStore.isAuth)
          await userStore.checkAuth()

        if (!userStore.isAuth)
          return '/auth'
      }
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
      path: '/cabinet/',
      name: 'Cabinet',
      component: () => import('../views/Cabinet.vue'),
      children: [
        {
          path: 'me',
          name: "Me",
          component: () => import('../components/_cabinet/AboutClient.vue'),
        },
        {
          path: 'booking-trips',
          component: () => import('../components/_cabinet/BookingTrips.vue'),
        },
        {
          path: 'created-trips',
          component: () => import('../components/_cabinet/CreatedTrips.vue'),
        },
        {
          path: 'customers-trip',
          component: () => import('../components/_cabinet/CustomersTrip.vue'),
        },
        {
          path: 'purchased-trips',
          component: () => import('../components/_cabinet/PurchasedTrips.vue'),
        },
        {
          path: 'my-companions',
          component: () => import('../components/_cabinet/MyCompanions.vue'),
        },
        {
          path: 'responses',
          component: () => import('../components/_cabinet/CompResponses.vue'),
        },
        {
          path: 'orders',
          component: () => import('../components/_cabinet/Orders.vue'),
        },
        {
          path: 'moderation-trips',
          name: 'TripsOnModeration',
          component: () => import('../components/admin/TripsOnModeration.vue'),
          beforeEnter: () => {
            let userStore = useAuth()
            if (!userStore.user?.roles.includes('admin')) {
              return false
            }
          }
        },
        {
          path: 'moderation-companions',
          name: 'CompanionsOnModeration',
          component: () => import('../components/admin/CompanionsOnModeration.vue'),
          beforeEnter: () => {
            let userStore = useAuth()
            if (!userStore.user?.roles.includes('admin')) {
              return false
            }
          }
        },
        {
          path: 'interface',
          name: 'Interface',
          component: () => import('../components/admin/Interface.vue'),
          beforeEnter: () => {
            let userStore = useAuth()
            if (!userStore.user?.roles.includes('admin')) {
              return false
            }
          }
        },
        {
          path: 'management',
          name: 'Management',
          component: () => import('../components/admin/Management.vue'),
          beforeEnter: () => {
            let userStore = useAuth()
            if (!userStore.user?.roles.includes('admin')) {
              return false
            }
          }
        },
        {
          path: 'scripts',
          name: 'Scripts',
          component: () => import('../components/admin/Scripts.vue'),
          beforeEnter: () => {
            let userStore = useAuth()
            if (!userStore.user?.roles.includes('admin')) {
              return false
            }
          }
        },
      ],
      beforeEnter: async (to, from) => {
        let userStore = useAuth()
        if (!localStorage.getItem('token') || !userStore.isAuth)
          await userStore.checkAuth()

        if (!userStore.isAuth)
          return '/auth'
      }
    },
    {
      path: '/trip-moderation',
      name: 'TripModeration',
      component: () => import('../components/admin/TripModeration.vue'),
      beforeEnter: async () => {
        let userStore = useAuth()
        if (!localStorage.getItem('token') || !userStore.isAuth)
          await userStore.checkAuth()
        if (!userStore.user?.roles.includes('admin')) {
          return false
        }
      }
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
      path: '/forgot-password',
      name: 'ForgotPassword',
      component: () => import('../components/ForgotPassword.vue')
    },
    {
      path: '/edit-trip',
      name: 'CompanyInfoPage',
      component: () => import('../components/_cabinet/EditTrip.vue'),
      beforeEnter: async (to, from) => {
        let userStore = useAuth()
        if (!localStorage.getItem('token') || !userStore.isAuth)
          await userStore.checkAuth()

        if (!userStore.isAuth)
          return '/auth'
      }
    },
    {
      path: '/calc',
      name: 'PriceCalc',
      component: () => import('../components/_calculator/PriceCalc.vue'),
    },
    {
      path: '/contacts',
      name: 'Contacts',
      component: () => import('../views/Contacts.vue')
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

export default router

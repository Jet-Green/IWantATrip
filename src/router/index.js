import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../stores/auth'
import tinkoffPlugin from '../plugins/tinkoff'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/blank',
      component: () => import('../layouts/Blank.vue'),
      children: [
        {
          path: '/tinkoff-payment',
          name: 'TinkoffPayment',
          component: () => import('../views/TinkoffPayment.vue')
        },
        {
          path: '/documents',
          name: 'Documents',
          component: () => import('../views/Documents.vue')
        },
        {
          path: '/document',
          name: 'Document',
          component: () => import('../views/Document.vue')
        },
        {
          path: '/print-contract',
          name: 'PrintContract',
          component: () => import('../print/PrintContract.vue')
        },
      ]
    },
    {
      path: '/places-layout',
      name: 'PlacesLayout',
      component: () => import('../layouts/Places.vue'),
      children: [
        {
          path: '/places',
          name: 'Places',
          component: () => import('../views/Places.vue')
        },
        {
          path: '/place',
          name: 'Place',
          component: () => import('../views/PlacePage.vue')
        },
        {
          path: '/poster',
          name: 'Poster',
          component: () => import('../components/_guide/Poster.vue')
        },
      ]
    },
    {
      path: '/',
      component: () => import('../layouts/Index.vue'),
      children: [
        {
          path: '/place',
          name: 'PlacePage',
          component: () => import('../views/PlacePage.vue')
        },
        {
          path: '/edit-excursion',
          name: 'EditExcursion',
          component: () => import('../views/EditExcursion.vue')
        },
        {
          path: '/payment',
          name: 'Payment',
          component: () => import('../views/Payment.vue')
        },
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
          path: '/catalog',
          name: 'CatalogPage',
          component: () => import('../components/CatalogList.vue'),
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
          path: '/create-place',
          name: 'CreatePlace',
          component: () => import('../components/_cabinet/CreatePlace.vue'),
          beforeEnter: async (to, from) => {
            let userStore = useAuth()
            if (!localStorage.getItem('token') || !userStore.isAuth)
              await userStore.checkAuth()

            if (!userStore.isAuth)
              return '/auth'
          }
        },
        {
          path: '/create-partner',
          name: 'CreatePartner',
          component: () => import('../components/_cabinet/crm/CreatePartner.vue'),
          beforeEnter: async (to, from) => {
            let userStore = useAuth()
            if (!localStorage.getItem('token') || !userStore.isAuth)
              await userStore.checkAuth()

            if (!userStore.isAuth)
              return '/auth'
          }
        },
        {
          path: '/create-task',
          name: 'CreateTask',
          component: () => import('../components/_cabinet/crm/CreateTask.vue'),
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

            if (!userStore.user.tinkoffContract?._id) {
              localStorage.setItem('fallbackMessage', JSON.stringify({ subtitle: 'Нужно заключить договор с платформой, чтобы создать тур', title: "Нет договора с \"Города и Веси\"", may_send_idea: true }))
              return '/fourothree'
            }
          }
        },
        {
          path: '/create-catalog-trip',
          name: 'CreateCatalogTrip',
          component: () => import('../views/CreateCatalogTrip.vue'),
          beforeEnter: async (to, from) => {
            let userStore = useAuth()
            if (!localStorage.getItem('token') || !userStore.isAuth)
              await userStore.checkAuth()

            if (!userStore.isAuth)
              return '/auth'

            if (!userStore.user.tinkoffContract?._id) {
              localStorage.setItem('fallbackMessage', JSON.stringify({ subtitle: 'Нужно заключить договор с платформой, чтобы создать тур', title: "Нет договора с \"Города и Веси\"", may_send_idea: true }))
              return '/fourothree'
            }
          }
        },
        {
          path: '/edit-catalog-trip',
          name: 'EditCatalogTrip',
          component: () => import('../views/EditCatalogTrip.vue'),
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
          path: '/send-idea',
          name: 'SendIdea',
          component: () => import('../views/SendIdea.vue'),
          beforeEnter: async (to, from) => {
            let userStore = useAuth()
            if (!localStorage.getItem('token') || !userStore.isAuth)
              await userStore.checkAuth()

            if (!userStore.isAuth)
              return '/auth'
          }
        },
        {
          path: '/catalog-to-active',
          name: 'CatalogTripToActive',
          component: () => import('../views/CatalogTripToActive.vue'),
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
          path: '/create-guide',
          name: 'CreateGuide',
          component: () => import('../components/_cabinet/CreateGuide.vue'),
          beforeEnter: async (to, from) => {
            let userStore = useAuth()
            if (!localStorage.getItem('token') || !userStore.isAuth)
              await userStore.checkAuth()

            if (!userStore.isAuth)
              return '/auth'
            return true
            // if (!userStore.user?.roles?.includes('manager')) {
            //   return false
            // }
          }
        },
        {
          path: '/create-bus',
          component: () => import('../components/admin/CreateBus.vue'),
        },
        {
          path: '/trip',
          name: 'TripInfoPage',
          component: () => import('../views/TripInfoPage.vue')
        },
        {
          path: '/catalog-trip',
          name: 'CatalogInfoPage',
          component: () => import('../views/CatalogInfoPage.vue')
        },
        {
          path: '/watch',
          name: 'ToWatch',
          component: () => import('../components/_guide/ToWatch.vue')
        },
        {
          path: '/transport',
          name: 'Transport',
          component: () => import('../components/_guide/Transport.vue')
        },
        {
          path: '/taxi',
          name: 'Taxi',
          component: () => import('../components/_guide/Taxi.vue')
        },
        {
          path: '/orderTransport',
          name: 'OrderTransport',
          component: () => import('../components/_guide/OrderTransport.vue')
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
          path: '/photos',
          name: 'Photos',
          component: () => import('../components/_guide/Photos.vue')
        },
        {
          path: '/excursions',
          name: 'ExcursionsPage',
          component: () => import('../components/_guide/Excursions.vue')
        },
        {
          path: '/excursion',
          name: 'ExcursionPage',
          component: () => import('../views/ExcursionPage.vue')
        },
        {
          path: '/excursion-moderation',
          name: 'ExcursionModeration',
          component: () => import('../components/admin/ExcursionModeration.vue')
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
          path: '/offer-trip',
          name: 'OfferTrip',
          component: () => import('../components/_cabinet/forms/OfferTrip.vue'),
        },
        {
          path: '/offers',
          name: 'OffersPage',
          component: () => import('../components/_cabinet/OffersPage.vue'),
          children: [
            {
              path: 'new',
              name: 'NewOffers',
              component: () => import('../components/_cabinet/offers/NewOffers.vue'),
            },
            {
              path: 'accepted',
              name: 'AcceptedOffers',
              component: () => import('../components/_cabinet/offers/AcceptedOffers.vue'),
            },
            {
              path: 'rejected',
              name: 'RejectedOffers',
              component: () => import('../components/_cabinet/offers/RejectedOffers.vue'),
            }
          ]
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
              path: 'excursion-customers',
              name: 'ExcursionCustomers',
              component: () => import('../components/_cabinet/ExcursionCustomers.vue'),
            },
            {
              path: 'excursion-booking-info',
              name: 'ExcursionBookingInfo',
              component: () => import('../components/_cabinet/ExcursionBookingInfo.vue'),
            },
            {
              path: 'my-places',
              name: 'MyPlaces',
              component: () => import('../components/_cabinet/MyPlaces.vue'),
            },
            {
              path: 'partners',
              name: 'Partners',
              component: () => import('../components/_cabinet/crm/Partners.vue'),
            },
            {
              path: 'tasks',
              name: 'Tasks',
              component: () => import('../components/_cabinet/crm/Tasks.vue'),
            },
            {
              path: 'excursion-bookings',
              name: 'ExcursionBookings',
              component: () => import('../components/_cabinet/ExcursionBookings.vue'),
            },
            {
              path: 'guide',
              name: 'Guide',
              component: () => import('../components/_cabinet/Guide.vue'),
            },
            {
              path: 'created-trips',
              component: () => import('../components/_cabinet/CreatedTrips.vue'),
              children: [
                {
                  path: 'created-trip-on-moderation',
                  component: () => import('../components/_cabinet/CreatedTripsOnModeration.vue'),
                },
                {
                  path: 'created-active-trips',
                  component: () => import('../components/_cabinet/ActiveTrips.vue'),
                },
                {
                  path: 'created-archived-trips',
                  component: () => import('../components/_cabinet/ArchivedTrips.vue'),
                },
                {
                  path: 'catalog-trips',
                  component: () => import('../components/_cabinet/CatalogTrips.vue'),
                },

              ]
            },
            {
              path: 'excursions',
              name: 'Excursions',
              component: () => import('../components/_cabinet/Excursions.vue')
            },

            {
              path: 'excursion-info',
              name: 'ExcursionsInfo',
              component: () => import('../components/_cabinet/ExcursionInfo.vue')
            },
            {
              path: 'add-excursion-dates',
              name: 'AddExcursionDates',
              component: () => import('../components/_cabinet/AddExcursionDates.vue')
            },
            {
              path: 'find-buyer',
              component: () => import('../components/_cabinet/FindBuyer.vue'),
            },
            {
              path: 'booking-notifications',
              component: () => import('../components/_cabinet/BookingNotifications.vue'),
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
              path: 'bought-trips',
              component: () => import('../components/_cabinet/BoughtTrips.vue')
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
              path: 'moderation-trips/',
              name: 'TripsOnModeration',
              component: () => import('../components/admin/TripsOnModeration.vue'),
              beforeEnter: () => {
                let userStore = useAuth()
                if (!userStore.user?.roles.includes('manager')) {
                  return false
                }
              },
              children: [
                {
                  path: 'rejected-trips',
                  component: () => import('../components/admin/RejectedTrips.vue'),
                },
                {
                  path: 'not-moderated-trips',
                  component: () => import('../components/admin/NotModeratedTrips.vue'),
                },
              ]
            },
            {
              path: 'catalog-trips-moderation/',
              name: 'CatalogTripsModeration',
              component: () => import('../components/admin/CatalogTripsModeration.vue'),
              beforeEnter: () => {
                let userStore = useAuth()
                if (!userStore.user?.roles.includes('manager')) {
                  return false
                }
              },
              children: [
                {
                  path: 'rejected',
                  component: () => import('../components/admin/catalog/Rejected.vue')
                },
                {
                  path: 'on-moderation',
                  component: () => import('../components/admin/catalog/OnModeration.vue')
                },
              ]
            },
            {
              path: 'moderation-companions',
              name: 'CompanionsOnModeration',
              component: () => import('../components/admin/CompanionsOnModeration.vue'),
              beforeEnter: () => {
                let userStore = useAuth()
                if (!userStore.user?.roles.includes('manager')) {
                  return false
                }
              }
            },
            {
              path: 'moderation-excursions',
              name: 'ExcursionOnModeration',
              component: () => import('../components/admin/ExcursionOnModeration.vue'),
              beforeEnter: () => {
                let userStore = useAuth()
                if (!userStore.user?.roles.includes('manager')) {
                  return false
                }
              }
            },
            {
              path: 'moderation-places',
              name: 'PlacesModeration',
              component: () => import('../components/admin/PlacesOnModeration.vue'),
              beforeEnter: () => {
                let userStore = useAuth()
                if (!userStore.user?.roles.includes('manager')) {
                  return false
                }
              },
              children: [
                {
                  path: 'on-moderation',
                  name: 'PlacesOnModeration',
                  component: () => import('../components/admin/placesOnModeration/onModeration.vue'),
                },
                {
                  path: 'rejected',
                  name: 'RejectedPlaces',
                  component: () => import('../components/admin/placesOnModeration/rejected.vue'),
                },
                {
                  path: 'manage',
                  name: 'ManagePlaces',
                  component: () => import('../components/admin/placesOnModeration/manage.vue'),
                },
              ]
            },
            {
              path: 'moderation-guides',
              name: 'GuidesModeration',
              component: () => import('../components/admin/GuidesOnModeration.vue'),
              beforeEnter: () => {
                let userStore = useAuth()
                if (!userStore.user?.roles.includes('manager')) {
                  return false
                }
              },
              children: [
                {
                  path: 'on-moderation',
                  name: 'GuidesOnModeration',
                  component: () => import('../components/admin/guidesOnModeration/onModeration.vue'),
                },
                {
                  path: 'rejected',
                  name: 'RejectedGuides',
                  component: () => import('../components/admin/guidesOnModeration/rejected.vue'),
                },
                {
                  path: 'manage',
                  name: 'ManageGuides',
                  component: () => import('../components/admin/guidesOnModeration/manage.vue'),
                },
              ]
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
              path: 'transport',
              name: 'AdminTransport',
              component: () => import('../components/admin/Transport.vue'),
              beforeEnter: () => {
                let userStore = useAuth()
                if (!userStore.user?.roles.includes('manager')) {
                  return false
                }
              }
            },
            {
              path: 'guides',
              name: 'AdminGuides',
              component: () => import('../components/admin/Guide.vue'),
              beforeEnter: () => {
                let userStore = useAuth()
                if (!userStore.user?.roles.includes('admin')) {
                  return false
                }
              }
            },
            // {
            //   path: 'scripts',
            //   name: 'Scripts',
            //   component: () => import('../components/admin/Scripts.vue'),
            //   beforeEnter: () => {
            //     let userStore = useAuth()
            //     if (!userStore.user?.roles.includes('admin')) {
            //       return false
            //     }
            //   }
            // },
            {
              path: "add-admin-contract",
              name: 'AddAdminContract',
              props: true,
              component: () => import('../components/admin/AddAdminContract.vue'),
              beforeEnter: () => {
                let userStore = useAuth()
                if (!userStore.user?.roles.includes('admin')) {
                  return false
                }
              }
            },
            {
              path: "admin-contracts-list",
              name: 'AdminContracts',
              component: () => import('../components/admin/AdminContractsList.vue'),
              beforeEnter: () => {
                let userStore = useAuth()
                if (!userStore.user?.roles.includes('admin')) {
                  return false
                }
              }
            },
            {
              path: "determinate-winner",
              name: 'DeterminateWinner',
              component: () => import('../components/admin/DeterminateWinner.vue'),
              beforeEnter: () => {
                let userStore = useAuth()
                if (!userStore.user?.roles.includes('manager')) {
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
        // UpdateContract
        {
          path: "/update-contract",
          name: 'UpdateContract',
          component: () => import('../components/admin/UpdateContract.vue'),
          beforeEnter: async () => {
            let userStore = useAuth()
            if (!localStorage.getItem('token') || !userStore.isAuth)
              await userStore.checkAuth()

            if (!userStore.user?.roles?.includes('admin')) {
              return '/'
            }

            let isTinkoffAuth = await tinkoffPlugin.checkAuth()
            if (!isTinkoffAuth) {
              return '/'
            }
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
            if (!userStore.user?.roles.includes('manager')) {
              return false
            }
          }
        },
        {
          path: '/catalog-trip-moderation',
          name: 'CatalogTripModeration',
          component: () => import('../components/admin/CatalogTripModeration.vue'),
          beforeEnter: async () => {
            let userStore = useAuth()
            if (!localStorage.getItem('token') || !userStore.isAuth)
              await userStore.checkAuth()
            if (!userStore.user?.roles.includes('manager')) {
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

        {
          path: '/fourothree',
          name: 'FourOThree',
          component: () => import('../views/fallbacks/403.vue')
        },
        {
          path: "/contract-create",
          name: 'ContractCreate',
          component: () => import('../components/forms/ContractCreate.vue'),
        },
        {
          path: "/create-excursion",
          name: "CreateExcursion",
          component: () => import('../views/CreateExcursion.vue'),
          beforeEnter: async (to, from) => {
            let userStore = useAuth()
            if (!localStorage.getItem('token') || !userStore.isAuth)
              await userStore.checkAuth()
            if (!userStore.isAuth)
              return '/auth'
          }
        },
        {
          path: "/moderate-place",
          name: "ModeratePlace",
          component: () => import('../components/admin/ModeratePlace.vue'),
          beforeEnter: async () => {
            let userStore = useAuth()
            if (!localStorage.getItem('token') || !userStore.isAuth)
              await userStore.checkAuth()
            if (!userStore.user?.roles.includes('manager')) {
              return false
            }
          }
        },
        {
          path: "/edit-place",
          name: "EditPlace",
          component: () => import('../views/EditPlace.vue'),
          beforeEnter: async () => {
            let userStore = useAuth()
            if (!localStorage.getItem('token') || !userStore.isAuth)
              await userStore.checkAuth()
          }
        },
      ]
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (to.path === '/places' ) {
      // Scroll to the element with id "top" on /places route
      return { el: '#top' };
    } else if (savedPosition) {
      return savedPosition;
    } 
    else {
      // Default behavior for other routes
      return { x: 0, y: 0 };
    }
  },

})

// // яндекс аналитика
// router.afterEach((to, from) => {
//   if (typeof ym !== 'undefined') {
//     ym(98607105, 'hit', to.fullPath);
//   }
// });

export default router

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Signup from '../components/Signup.vue'
import Login from '../components/Login.vue'
import ViewProfile from '../components/ViewProfile.vue'
import ModifyProfile from '../components/ModifyProfile.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/signup',
    name: 'signup',
    component: Signup
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/view-profile/:id',
    name: 'view-profile',
    component: ViewProfile
  },
  {
    path: '/modify-profile/:id',
    name: 'modify-profile',
    component: ModifyProfile
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

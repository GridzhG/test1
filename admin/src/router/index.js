import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from "@/pages/Index";
import Cases from "@/pages/Cases";
import Categories from "@/pages/Categories";
import CaseItems from "@/pages/CaseItems";
import Items from "@/pages/Items";
import Withdraws from "@/pages/Withdraws";
import Users from "@/pages/Users";
import User from "@/pages/User";
import Payments from "../pages/Payments";
import Settings from "../pages/Settings";
import Promocodes from "../pages/Promocodes";
import Giveaways from "../pages/Giveaways";
import Giveaway from "../pages/Giveaway";
import Bots from "../pages/Bots";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    component: Index
  },
  {
    path: '/cases',
    name: 'cases',
    component: Cases
  },
  {
    path: '/bots',
    name: 'bots',
    component: Bots
  },
  {
    path: '/categories',
    name: 'categories',
    component: Categories
  },
  {
    path: '/case/items/:id',
    name: 'CaseItems',
    component: CaseItems
  },
  {
    path: '/items',
    name: 'items',
    component: Items
  },
  {
    path: '/withdraws',
    name: 'withdraws',
    component: Withdraws
  },
  {
    path: '/users',
    name: 'users',
    component: Users
  },
  {
    path: '/user/:id',
    name: 'user',
    component: User
  },
  {
    path: '/payments',
    name: 'payments',
    component: Payments
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings
  },
  {
    path: '/promocodes',
    name: 'promocodes',
    component: Promocodes
  },
  {
    path: '/giveaways',
    name: 'giveaways',
    component: Giveaways
  },
  {
    path: '/giveaway/:id',
    name: 'giveaway',
    component: Giveaway
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
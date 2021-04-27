import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import AppLogin from "./AppLogin.vue";
import UserInfo from "./components/UserInfo.vue";
import HomePage from "./components/HomePage.vue";
import DayCreation from "./components/DayCreation.vue"
import AllCalendars from "./components/AllCalendars.vue"
Vue.use(VueRouter);

const myRoutes: Array<RouteConfig> = [
  {
    name: "Login",
    path: "/",
    component: AppLogin,
  },
  {
    name: "userinfo",
    path: "/userinfo",
    component: UserInfo,
  },
  {
    name: "HomePage",
    path: "/homepage",
    component: HomePage,
  },
  {
    name: "DayCreation",
    path: "/daycreation",
    component: DayCreation,
  },
  {
    name: "AllCalendars",
    path: "/allcalendars",
    component: AllCalendars
  }
];

export const AppRouter = new VueRouter({ 
  routes: myRoutes, 
  mode: "history" 
});   
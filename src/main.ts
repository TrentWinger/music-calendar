import Vue from 'vue'
import App from './App.vue'
import firebase from "firebase/app"
import "firebase/firestore";
import VueApexCharts from "vue-apexcharts";
import "firebase/auth";
import { AppRouter } from "./app-routing";
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

const firebaseConfig = {
  apiKey: "AIzaSyC6fyYeSUgGo-ItnyyQa0fDNCZGqh1g-vA",
  authDomain: "music-calendar-7c9a8.firebaseapp.com",
  projectId: "music-calendar-7c9a8",
  storageBucket: "music-calendar-7c9a8.appspot.com",
  messagingSenderId: "6414795405",
  appId: "1:6414795405:web:24f6b01bc14820a77798c4",
  measurementId: "G-DD6BXQ8YRH"
};

firebase.initializeApp(firebaseConfig);

Vue.prototype.$appAuth = firebase.auth();
Vue.prototype.$appDB = firebase.firestore();


Vue.config.productionTip = false
Vue.use(VueApexCharts)
Vue.use(BootstrapVue)


new Vue({
  router: AppRouter,
  render: h => h(App),
}).$mount('#app')

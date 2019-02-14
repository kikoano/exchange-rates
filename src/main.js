import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'

import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue);
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import VueSidebarMenu from './index'
Vue.use(VueSidebarMenu)

import ToggleButton from 'vue-js-toggle-button';
Vue.use(ToggleButton)

import TitleScreen from "./components/TitleScreen.vue"
import Table from "./components/Table.vue"
import Graph from "./components/Graph.vue"

Vue.use(VueRouter)
const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'TitleScreen',
      component: TitleScreen,
    },
    {
      path: '/table',
      name: 'Table',
      component: Table,
      children: [
        {
          path: 'date',
          name: 'Table',
        },
        {
          path: '/table/period',
          name: 'Period',
          component: Table,
          children: [
            {
              path: '',
              name: 'Kontiuniran',
              query: { mode: "1" }
            },
            {
              path: '',
              name: 'Presecno',
              query: { mode: "2" }
            }
          ]
        }
      ]
    },
    {
      path: '/graph',
      name: 'Graph',
      component: Graph,
      children: [
        {
          path: '',
          name: 'SingleGraph',
          query: { num: "1" }
        },
        {
          path: '',
          name: 'DoubleGraph',
          query: { num: "2" }
        }
      ]
    }
  ]
})
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

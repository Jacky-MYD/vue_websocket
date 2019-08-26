import Vue from 'vue'
import Router from 'vue-router'
import Chat from './views/Chat.vue';
import Login from './views/Login.vue';
import Friends from './views/Friends.vue';

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login,
    },
    {
      path: '/chat',
      name: 'chat',
      component: Chat,
    },
    {
      path: '/friends',
      name: 'friends',
      component: Friends,
    },
  ]
})

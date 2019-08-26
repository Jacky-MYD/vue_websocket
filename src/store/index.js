import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import actions from './actions';
import { state, mutations } from './mutations';
import getters from './getters';
// modules
// import demo from './modules/demo/index.ts'

Vue.use(Vuex);

export default  new Vuex.Store({
  actions,
  state,
  mutations,
  getters,
  modules: {
    // 添加自定义模块
    // demo,
  },
});

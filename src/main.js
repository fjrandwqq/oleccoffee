// import './style/variables.less';

import FastClick from 'fastclick';
FastClick.attach(document.body)

/* import 'babel-polyfill';
import promise from 'es6-promise';
promise.polyfill(); */

// import './lib/shim/ie9-shim';
// import './lib/shim/html5';
// import './lib/shim/es5-shim.js';

import Vue from 'vue';
Vue.config.productionTip = false;

import { AjaxPlugin } from 'vux';
Vue.use(AjaxPlugin);
// Vue.config.devtools = true;

// import './services/registerComponent';

// import './services/mock';

import './services/lazyload';

import App from './App';
import router from './router';
import store from './store';

new Vue({
  el: '#app',
  router,
  render: h => h('App'),
  store,
  components: {
    App
  }
});

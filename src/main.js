// import './style/variables.less';

import FastClick from 'fastclick';
FastClick.attach(document.body);

/* import 'babel-polyfill';
import promise from 'es6-promise';
promise.polyfill(); */

// import './lib/shim/ie9-shim';
// import './lib/shim/html5';
// import './lib/shim/es5-shim.js';

import Vue from 'vue';
Vue.config.productionTip = false;

import {
    WechatPlugin,
    ViewBox,
    XButton,
    Group,
    Cell,
    CellBox,
    Panel
} from 'vux';

Vue.use(WechatPlugin);
Vue.component('view-box', ViewBox);
Vue.component('x-button', XButton);
Vue.component('group', Group);
Vue.component('cell-box', CellBox);
Vue.component('cell', Cell);
Vue.component('panel', Panel);
import {
    setWechatConfig
} from '@/services/getData';

console.log(window.location.href);
const url = window.location.href.split('#')[0];
setWechatConfig({
        url: url,
    })
    .then(res => {
        console.log('setWechatConfig');
        Vue.wechat.config({
            // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: res.appId, // 必填，公众号的唯一标识
            timestamp: res.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.nonceStr, // 必填，生成签名的随机串
            signature: res.signature, // 必填，签名
            jsApiList: ['getLocation'],
        });
    });

import App from './App';
import router from './router';
import store from './store';

new Vue({
    el: '#app',
    router,
    render: h => h('App'),
    store,
    components: {
        App,
    },
})
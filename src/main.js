// import './style/variables.less';

import FastClick from "fastclick";
FastClick.attach(document.body);

/* import 'babel-polyfill';
import promise from 'es6-promise';
promise.polyfill(); */

// import './lib/shim/ie9-shim';
// import './lib/shim/html5';
// import './lib/shim/es5-shim.js';

import Vue from "vue";
Vue.config.productionTip = false;

import { ViewBox, XButton, Group, Cell, CellBox, Panel, WechatPlugin } from "vux";

Vue.use(WechatPlugin);
Vue.component("view-box", ViewBox);
Vue.component("x-button", XButton);
Vue.component("group", Group);
Vue.component("cell-box", CellBox);
Vue.component("cell", Cell);
Vue.component("panel", Panel);
import {setWechatConfig} from '@/services/getData';



// Vue.config.devtools = true;

// import './services/registerComponent';

// import './services/mock';

// import './services/lazyload';
console.log(Vue.wechat)
setWechatConfig().then(res=>{
  Vue.wechat.config({
    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: res.appId, // 必填，公众号的唯一标识
    timestamp: res.timestamp, // 必填，生成签名的时间戳
    nonceStr: res.nonceStr, // 必填，生成签名的随机串
    signature: res.signature,// 必填，签名
    jsApiList: ['chooseImage', 'uploadImage', 'downloadImage',
      'previewImage', 'openLocation', 'getLocation',
      'scanQRCode', 'checkJsApi', 'onMenuShareTimeline',
      'onMenuShareAppMessage', 'onMenuShareQQ',
      'onMenuShareWeibo', 'onMenuShareQZone'] // 必填，需要使用的JS接口列表
  });
}).catch(err => console.log('微信注入config失败'));

import App from './App';
import router from './router';
import store from './store';


new Vue({
  el: "#app",
  router,
  render: h => h("App"),
  store,
  components: {
    App
  }
});

import Vue from "vue";
import { AjaxPlugin } from "vux";
Vue.use(AjaxPlugin);
Vue.http.defaults.baseURL = "/api";
Vue.http.defaults.timeout = 10000;
Vue.http.defaults.headers["Content-Type"] = "application/json;charset=UTF-8";
Vue.http.defaults.headers["X-Requested-With"] = "XMLHttpRequest";

Vue.http.interceptors.request.use(
  config => {
    return config;
  },
  err => Promise.reject(err)
);
const $http = promise =>
  promise.then(res => res.data).catch(err => Promise.reject(err));

/* const $http = (promise, success, error) => {
  promise
    .then(res => {
      success(res);
    })
    .catch(err => {
      error(err);
    });
}; */

const setWechatConfig = () => {
    return $http(Vue.http("/publicPlatform/api/auth/jsapiSignature"));
};
export { setWechatConfig };

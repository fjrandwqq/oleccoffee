import Vue from "vue";
import {
    AjaxPlugin
} from "vux";
Vue.use(AjaxPlugin);
Vue.http.defaults.baseURL = "/apiv";
Vue.http.defaults.timeout = 10000000;
Vue.http.defaults.headers["Content-Type"] = "application/json;charset=UTF-8";
Vue.http.defaults.headers["X-Requested-With"] = "XMLHttpRequest";

Vue.http.interceptors.request.use(config => config, err => Promise.reject(err));
const $http = promise => promise.then(res => res.data).catch(err => Promise.reject(err));

const getShopList = params => $http(Vue.http.get("/publicPlatform/api/shop", {
    params
}));

const getCategoryByShop = shopId => $http(Vue.http.get(`/publicPlatform/api/goodsCats/shopGoodsCats/${shopId}`));

const getProductsByCategory = (shopId, categoryId) => $http(Vue.http.get(`/publicPlatform/api/goods/${shopId}/${categoryId}`));

const getProductDetail = id => $http(Vue.http.get(`/publicPlatform/api/goods/${id}`));

const getBanners = shopId => $http(Vue.http.get(`/publicPlatform/api/shop/carouselImg/${shopId}`));

const setWechatConfig = url => $http(Vue.http.post("http://193.112.224.86/publicPlatform/api/auth/jsapiSignature", {
    url
}));

export {
    getBanners,
    getProductDetail,
    getProductsByCategory,
    getCategoryByShop,
    getShopList,
    setWechatConfig
};
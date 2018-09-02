import Vue from 'vue';
import {
    AjaxPlugin
} from 'vux';
import qs from 'qs';
Vue.use(AjaxPlugin);
Vue.http.defaults.baseURL = '/oleccoffee/apiv1';
// Vue.http.defaults.baseURL = 'http://193.112.224.86:80';
Vue.http.defaults.timeout = 200000;
Vue.http.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8';
Vue.http.defaults.headers['X-Requested-With'] = 'XMLHttpRequest';

Vue.http.interceptors.request.use(config => config, err => Promise.reject(err));
const $http = promise => promise.then(res => res.data).catch(err => Promise.reject(err));

const getShopList = params => $http(Vue.http.get("/publicPlatform/api/shop", {
    params
}));

const getCategoryByShop = shopId => $http(Vue.http.get(`/publicPlatform/api/goodsCats/shopGoodsCats/${shopId}`));

const getProductsByCategory = (shopId, categoryId) => $http(Vue.http.get(`/publicPlatform/api/goods/${shopId}/${categoryId}`));

const getProductDetail = id => $http(Vue.http.get(`/publicPlatform/api/goods/${id}`));

const getBanners = shopId => $http(Vue.http.get(`/publicPlatform/api/shop/carouselImg/${shopId}`));

const setWechatConfig = params => $http(
    Vue.http.post('/publicPlatform/api/auth/jsapiSignature', qs.stringify(params), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    })
);
const getUserInfo = params => $http(Vue.http.get('/publicPlatform/api/user/userInfo', {
    params
}));

const getOrderList = params => $http(Vue.http.get('/publicPlatform/api/orders/myOrders', {
    params
}));

const addAddress = params => $http(Vue.http.post('/publicPlatform/api/userAddress', qs.stringify(params), {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    }
}));


const getOpenId = code => $http(Vue.http.get(`/publicPlatform/api/auth/openId/${code}`));

const getUserAddressList = openId => $http(Vue.http.get(`/publicPlatform/api/userAddress?openId=${openId}`));



const createOrder = params => $http(Vue.http.post(`/publicPlatform/api/orders`,params));

const updateAddress = params => $http(Vue.http.put(`/publicPlatform/api/userAddress`, qs.stringify(params), {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    }
}));


const unifiedOrder =params =>$http(Vue.http.post(`/pay/api/weChat/unifiedOrder`, params,{
    baseURL:'/oleccoffee/apiv2'
}
));

const getAllGoods = shopId =>$http(Vue.http.get(`/publicPlatform/api/goods/shopGoods/${shopId}`));

/**
 * 计算总价
 * @param {JS} params 
 */
const getTotalPrice = params => $http(Vue.http.post(`/publicPlatform/api/orders/totalMoney`,params));

export {
    setWechatConfig,
    getUserInfo,
    getOrderList,
    getBanners,
    getProductDetail,
    getProductsByCategory,
    getCategoryByShop,
    getShopList,
    addAddress,
    getOpenId,
    getUserAddressList,
    createOrder,
    updateAddress,
    unifiedOrder,
    getAllGoods,
    getTotalPrice
};
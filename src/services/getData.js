import Vue from 'vue';
import {
    AjaxPlugin
} from 'vux';
import qs from 'qs';
Vue.use(AjaxPlugin);
Vue.http.defaults.baseURL = '/oleccoffee/apiv1';
Vue.http.defaults.timeout = 200000;
Vue.http.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8';
Vue.http.defaults.headers['X-Requested-With'] = 'XMLHttpRequest';

Vue.http.interceptors.request.use(config => config, err => Promise.reject(err));
const $http = promise => promise.then(res => res.data).catch(err => Promise.reject(err));

const getShopList = params => $http(Vue.http.get("/api/shop", {
    params
}));

const getCategoryByShop = shopId => $http(Vue.http.get(`/api/goodsCats/shopGoodsCats/${shopId}`));

const getProductsByCategory = (shopId, categoryId) => $http(Vue.http.get(`/api/goods/${shopId}/${categoryId}`));

const getProductDetail = id => $http(Vue.http.get(`/api/goods/${id}`));

const getBanners = shopId => $http(Vue.http.get(`/api/shop/carouselImg/${shopId}`));

const setWechatConfig = params => $http(
    Vue.http.post('/api/auth/jsapiSignature', qs.stringify(params), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    })
);
const getUserInfo = params => $http(Vue.http.get('/api/user/userInfo', {
    params
}));

const getOrderList = params => $http(Vue.http.get('/api/orders/myOrders', {
    params
}));

const addAddress = params => $http(Vue.http.post('/api/userAddress', qs.stringify(params), {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    }
}));


const getOpenId = code => $http(Vue.http.get(`/api/auth/openId/${code}`));

const getUserAddressList = openId => $http(Vue.http.get(`/api/userAddress?openId=${openId}`));



const createOrder = params => $http(Vue.http.post(`/api/orders`,params));

const updateAddress = params => $http(Vue.http.put(`/api/userAddress`, qs.stringify(params), {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    }
}));


const unifiedOrder =params =>$http(Vue.http.post(`/pay/api/weChat/unifiedOrder`, params,{
    baseURL:'/oleccoffee/apiv2'
}
));

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
    unifiedOrder
};